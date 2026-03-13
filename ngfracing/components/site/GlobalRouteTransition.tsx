"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAVIGATION_DELAY_MS = 260;

function isValidInternalAnchor(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return null;
  }

  const anchor = target.closest("a");
  if (!(anchor instanceof HTMLAnchorElement)) {
    return null;
  }

  if (anchor.target && anchor.target !== "_self") {
    return null;
  }

  if (anchor.hasAttribute("download")) {
    return null;
  }

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return null;
  }

  try {
    const parsed = new URL(anchor.href, window.location.href);
    if (parsed.origin !== window.location.origin) {
      return null;
    }

    if (
      parsed.pathname === window.location.pathname &&
      parsed.search === window.location.search &&
      parsed.hash.length > 0
    ) {
      return null;
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return null;
  }
}

export function GlobalRouteTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const nextHrefRef = useRef<string | null>(null);
  const navigateTimerRef = useRef<number | null>(null);
  const settleTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const href = isValidInternalAnchor(event.target);
      if (!href) {
        return;
      }

      const currentHref = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (href === currentHref) {
        return;
      }

      event.preventDefault();
      nextHrefRef.current = href;
      setIsTransitioning(true);

      if (navigateTimerRef.current) {
        window.clearTimeout(navigateTimerRef.current);
      }

      navigateTimerRef.current = window.setTimeout(() => {
        const nextHref = nextHrefRef.current;
        if (nextHref) {
          router.push(nextHref);
        }
      }, reduceMotion ? 0 : NAVIGATION_DELAY_MS);
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [reduceMotion, router]);

  useEffect(() => {
    if (!isTransitioning) {
      return;
    }

    if (settleTimerRef.current) {
      window.clearTimeout(settleTimerRef.current);
    }

    settleTimerRef.current = window.setTimeout(() => {
      setIsTransitioning(false);
      nextHrefRef.current = null;
    }, reduceMotion ? 0 : 380);
  }, [pathname, isTransitioning, reduceMotion]);

  useEffect(() => {
    return () => {
      if (navigateTimerRef.current) {
        window.clearTimeout(navigateTimerRef.current);
      }
      if (settleTimerRef.current) {
        window.clearTimeout(settleTimerRef.current);
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {isTransitioning ? (
        <motion.div
          className="route-transition"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          exit={{ scaleY: 0, opacity: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          <motion.div
            className="route-transition-line"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    duration: 0.46,
                    ease: [0.22, 1, 0.36, 1]
                  }
            }
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
