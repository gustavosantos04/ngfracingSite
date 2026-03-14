"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouteTransitionState } from "@/components/site/GlobalRouteTransition";

export function PageTransitionShell({ children }: { children: React.ReactNode }) {
  const { routeKey } = useRouteTransitionState();
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={routeKey}
        className="page-transition-layer"
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                duration: 0.34,
                delay: 0.05,
                ease: [0.22, 1, 0.36, 1]
              }
        }
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
