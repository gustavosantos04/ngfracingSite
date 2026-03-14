"use client";

import Lenis from "lenis";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type TransitionPhase = "idle" | "covering" | "revealing";

type RouteTransitionContextValue = {
  phase: TransitionPhase;
  routeKey: string;
};

const RouteTransitionContext = createContext<RouteTransitionContextValue | null>(null);

const EASE = [0.22, 1, 0.36, 1] as const;

function clearTimer(timerRef: { current: number | null }) {
  if (timerRef.current !== null) {
    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }
}

function getHashTarget(hash: string) {
  if (!hash) {
    return null;
  }

  const id = decodeURIComponent(hash.slice(1));
  if (!id) {
    return null;
  }

  return document.getElementById(id);
}

export function useRouteTransitionState() {
  const context = useContext(RouteTransitionContext);

  if (!context) {
    throw new Error("useRouteTransitionState must be used within GlobalRouteTransition.");
  }

  return context;
}

export function GlobalRouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const isFirstRender = useRef(true);
  const phaseRef = useRef<TransitionPhase>("idle");
  const coverStartedAtRef = useRef(0);
  const pendingHrefRef = useRef<string | null>(null);
  const pushTimerRef = useRef<number | null>(null);
  const revealTimerRef = useRef<number | null>(null);
  const idleTimerRef = useRef<number | null>(null);
  const failSafeTimerRef = useRef<number | null>(null);
  const hashScrollTimerRef = useRef<number | null>(null);
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const routeKey = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  const coverDuration = reduceMotion ? 0 : 0.26;
  const revealDuration = reduceMotion ? 0 : 0.28;
  const coverDelayMs = reduceMotion ? 0 : 260;
  const revealDelayMs = reduceMotion ? 0 : 36;
  const revealTimeoutMs = reduceMotion ? 0 : 320;

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      syncTouch: false,
      lerp: 0.085,
      duration: 1.05,
      wheelMultiplier: 0.92,
      anchors: {
        offset: -92,
        duration: 1,
        easing: (value) => 1 - Math.pow(1 - value, 3)
      },
      stopInertiaOnNavigate: true
    });

    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduceMotion]);

  const clearNavigationTimers = useCallback(() => {
    clearTimer(pushTimerRef);
    clearTimer(revealTimerRef);
    clearTimer(idleTimerRef);
    clearTimer(failSafeTimerRef);
    clearTimer(hashScrollTimerRef);
  }, []);

  const finishTransition = useCallback(() => {
    clearNavigationTimers();
    pendingHrefRef.current = null;
    setPhase("idle");
    lenisRef.current?.start();
  }, [clearNavigationTimers]);

  const beginCover = useCallback(() => {
    clearNavigationTimers();
    coverStartedAtRef.current = window.performance.now();
    setPhase("covering");
    lenisRef.current?.stop();

    failSafeTimerRef.current = window.setTimeout(() => {
      finishTransition();
    }, 5000);
  }, [clearNavigationTimers, finishTransition]);

  useEffect(() => {
    document.documentElement.classList.toggle("nav-transition-active", phase !== "idle");
    document.body.classList.toggle("nav-transition-active", phase !== "idle");

    return () => {
      document.documentElement.classList.remove("nav-transition-active");
      document.body.classList.remove("nav-transition-active");
    };
  }, [phase]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        anchor.dataset.noTransition !== undefined ||
        anchor.getAttribute("rel")?.includes("external")
      ) {
        return;
      }

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) {
        return;
      }

      const nextUrl = new URL(anchor.href, window.location.href);
      const currentUrl = new URL(window.location.href);

      if (nextUrl.origin !== currentUrl.origin) {
        return;
      }

      const samePath = nextUrl.pathname === currentUrl.pathname && nextUrl.search === currentUrl.search;
      const sameHash = nextUrl.hash === currentUrl.hash;

      if (samePath && sameHash) {
        event.preventDefault();
        return;
      }

      if (samePath && nextUrl.hash) {
        return;
      }

      event.preventDefault();

      const targetHref = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
      pendingHrefRef.current = targetHref;
      beginCover();

      pushTimerRef.current = window.setTimeout(() => {
        router.push(targetHref, { scroll: true });
      }, coverDelayMs);
    };

    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [beginCover, coverDelayMs, router]);

  useEffect(() => {
    const handlePopState = () => {
      if (phaseRef.current !== "idle") {
        return;
      }

      pendingHrefRef.current = null;
      beginCover();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [beginCover]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const elapsed = window.performance.now() - coverStartedAtRef.current;
    const remainingCover = phaseRef.current === "covering" ? Math.max(0, coverDelayMs - elapsed) : 0;

    clearTimer(pushTimerRef);
    clearTimer(revealTimerRef);
    clearTimer(idleTimerRef);

    revealTimerRef.current = window.setTimeout(() => {
      setPhase("revealing");

      const target = getHashTarget(window.location.hash);
      if (target && lenisRef.current) {
        hashScrollTimerRef.current = window.setTimeout(() => {
          lenisRef.current?.scrollTo(target, {
            offset: -92,
            duration: 1,
            easing: (value) => 1 - Math.pow(1 - value, 3)
          });
        }, 48);
      }

      idleTimerRef.current = window.setTimeout(() => {
        finishTransition();
      }, revealTimeoutMs);
    }, remainingCover + revealDelayMs);
  }, [coverDelayMs, finishTransition, revealDelayMs, revealTimeoutMs, routeKey]);

  useEffect(() => {
    return () => {
      clearNavigationTimers();
      lenisRef.current?.destroy();
      document.documentElement.classList.remove("nav-transition-active");
      document.body.classList.remove("nav-transition-active");
    };
  }, [clearNavigationTimers]);

  const contextValue = useMemo<RouteTransitionContextValue>(
    () => ({
      phase,
      routeKey
    }),
    [phase, routeKey]
  );

  return (
    <RouteTransitionContext.Provider value={contextValue}>
      {children}

      <AnimatePresence>
        {phase !== "idle" ? (
          <motion.div
            className="route-transition"
            aria-hidden="true"
            initial={phase === "covering" ? { x: "-100%" } : false}
            animate={phase === "covering" ? { x: "0%" } : { x: "100%" }}
            exit={{ opacity: 0 }}
            transition={{
              duration: phase === "covering" ? coverDuration : revealDuration,
              ease: EASE
            }}
          >
            <div className="route-transition-shell">
              <div className="route-transition-accent" />
              <div className="route-transition-stripe" />
              <div className="route-transition-glow" />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </RouteTransitionContext.Provider>
  );
}
