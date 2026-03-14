"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

export function PageTransitionShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={pathname}
        className="page-transition-layer"
        initial={
          reduceMotion
            ? { opacity: 1 }
            : { opacity: 0, y: 18, filter: "blur(8px)", clipPath: "inset(0 0 12% 0)" }
        }
        animate={{ opacity: 1, y: 0, filter: "blur(0px)", clipPath: "inset(0 0 0% 0)" }}
        exit={
          reduceMotion
            ? { opacity: 1 }
            : { opacity: 0, y: -10, filter: "blur(6px)", clipPath: "inset(8% 0 0 0)" }
        }
        transition={reduceMotion ? { duration: 0 } : { duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

