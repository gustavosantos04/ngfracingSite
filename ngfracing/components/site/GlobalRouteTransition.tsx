"use client";

import Lenis from "lenis";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";

type TransitionPhase = "idle" | "covering" | "revealing";

type RouteTransitionContextValue = {
  phase: TransitionPhase;
  routeKey: string;
};

const RouteTransitionContext = createContext<RouteTransitionContextValue | null>(null);

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
  
  const lenisRef = useRef<Lenis | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  
  const routeKey = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  // Initialize Lenis
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      lerp: 0.08,
      duration: 1.2,
    });
    lenisRef.current = lenis;
    return () => lenis.destroy();
  }, []);

  const startTransition = useCallback((href: string) => {
    if (phase !== "idle") return;

    setPhase("covering");
    lenisRef.current?.stop();

    const tl = gsap.timeline({
      onComplete: () => {
        router.push(href);
      }
    });

    // Phase 1: Cover - Logo entra com efeito de movimento
    tl.fromTo(logoRef.current, 
      {
        opacity: 0,
        scale: 0.8,
        x: -100
      },
      {
        opacity: 1,
        scale: 1,
        x: 0,
        duration: 0.4,
        ease: "back.out"
      },
      0
    );

    tl.to(overlayRef.current, {
      x: "0%",
      duration: 0.6,
      ease: "expo.inOut",
    }, 0);
    
    tl.to(contentRef.current, {
      opacity: 0,
      scale: 0.98,
      duration: 0.4,
      ease: "power2.inOut"
    }, "-=0.4");

  }, [phase, router]);

  // Handle Route Change (Reveal)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (phase === "covering") {
      setPhase("revealing");
      
      const tl = gsap.timeline({
        onComplete: () => {
          setPhase("idle");
          lenisRef.current?.start();
          window.scrollTo(0, 0);
        }
      });

      // Phase 2: Reveal - Logo "acelera" para fora
      tl.to(logoRef.current, {
        opacity: 0,
        scale: 1.3,
        x: 200,
        duration: 0.5,
        ease: "power2.in"
      }, 0);

      tl.set(contentRef.current, { opacity: 0, scale: 1.02 });
      
      tl.to(overlayRef.current, {
        x: "100%",
        duration: 0.7,
        ease: "expo.inOut",
      }, 0);

      tl.to(contentRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.4");
      
      // Reset overlay position for next time
      tl.set(overlayRef.current, { x: "-100%" });
    }
  }, [routeKey]);

  // Intercept Clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (
        anchor && 
        anchor.href && 
        anchor.host === window.location.host && 
        !anchor.hash &&
        anchor.target !== "_blank" &&
        !anchor.hasAttribute("download") &&
        anchor.getAttribute("data-no-transition") === null
      ) {
        const currentUrl = window.location.pathname + window.location.search;
        const targetUrl = anchor.pathname + anchor.search;

        if (currentUrl !== targetUrl) {
          e.preventDefault();
          startTransition(targetUrl);
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [startTransition]);

  const contextValue = useMemo(() => ({ phase, routeKey }), [phase, routeKey]);

  return (
    <RouteTransitionContext.Provider value={contextValue}>
      <div ref={contentRef} className="page-transition-content" style={{ willChange: 'opacity, transform' }}>
        {children}
      </div>

      <div 
        ref={overlayRef} 
        className="gsap-route-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#d70000',
          zIndex: 9999,
          transform: 'translateX(-100%)',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        {/* Logo com visibilidade total e animação de aceleração */}
        <div 
          ref={logoRef}
          className="overlay-logo" 
          style={{ 
            position: 'relative',
            zIndex: 10,
            filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.4))',
            willChange: 'opacity, transform'
          }}
        >
          <Image 
            src="/branding/logoNGFRACING.png" 
            alt="NGF Racing Logo" 
            width={280}
            height={90}
            style={{ 
              objectFit: 'contain',
              filter: 'brightness(1.1) drop-shadow(0 4px 12px rgba(255, 255, 255, 0.2))'
            }}
            priority
          />
        </div>
      </div>
    </RouteTransitionContext.Provider>
  );
}
