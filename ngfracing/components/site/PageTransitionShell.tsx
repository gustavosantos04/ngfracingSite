"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRouteTransitionState } from "@/components/site/GlobalRouteTransition";

export function PageTransitionShell({ children }: { children: React.ReactNode }) {
  const { phase, routeKey } = useRouteTransitionState();
  const reduceMotion = useReducedMotion();
  const pendingRouteRef = useRef<{ routeKey: string; children: React.ReactNode } | null>(null);
  const [visibleRoute, setVisibleRoute] = useState({
    routeKey,
    children
  });

  useEffect(() => {
    if (routeKey === visibleRoute.routeKey) {
      return;
    }

    if (phase === "covering" || phase === "idle") {
      pendingRouteRef.current = null;
      setVisibleRoute({ routeKey, children });
      return;
    }

    pendingRouteRef.current = { routeKey, children };
  }, [children, phase, routeKey, visibleRoute.routeKey]);

  useEffect(() => {
    if (phase !== "covering" || !pendingRouteRef.current || pendingRouteRef.current.routeKey === visibleRoute.routeKey) {
      return;
    }

    setVisibleRoute(pendingRouteRef.current);
    pendingRouteRef.current = null;
  }, [phase, visibleRoute.routeKey]);

  return (
    <motion.div
      key={visibleRoute.routeKey}
      className={`page-transition-layer${phase === "covering" ? " is-covering" : ""}`}
      initial={
        reduceMotion || phase === "idle"
          ? false
          : {
              opacity: 0.18,
              y: 24,
              scale: 0.985,
              filter: "blur(10px)"
            }
      }
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)"
      }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              duration: 0.42,
              delay: phase === "revealing" ? 0.08 : 0,
              ease: [0.22, 1, 0.36, 1]
            }
      }
    >
      {visibleRoute.children}
    </motion.div>
  );
}
