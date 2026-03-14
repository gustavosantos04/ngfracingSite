"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function GlobalRouteTransition() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const isFirstRender = useRef(true);
  const [transitionKey, setTransitionKey] = useState(0);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setTransitionKey((current) => current + 1);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      {transitionKey > 0 ? (
        <motion.div
          key={transitionKey}
          className="route-transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.2 }}
          aria-hidden="true"
        >
          <motion.div
            className="route-transition-sheen"
            initial={{ x: "-115%" }}
            animate={{ x: "115%" }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="route-transition-edge"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 1, opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

