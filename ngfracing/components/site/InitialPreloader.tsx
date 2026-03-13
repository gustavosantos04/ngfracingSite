"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export function InitialPreloader() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  const isAdminRoute = useMemo(() => pathname.startsWith("/admin"), [pathname]);

  useEffect(() => {
    if (isAdminRoute) {
      setVisible(false);
      return;
    }

    let cancelled = false;
    let intervalTimer: number | null = null;
    let exitTimer: number | null = null;
    let loadHandler: (() => void) | null = null;

    const completeLoading = () => {
      setProgress(100);
      exitTimer = window.setTimeout(() => {
        if (!cancelled) {
          setVisible(false);
        }
      }, reduceMotion ? 0 : 460);
    };

    intervalTimer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 92) {
          return current;
        }
        const step = current > 80 ? 1 : current > 55 ? 2 : 3;
        return Math.min(92, current + step);
      });
    }, 46);

    const ready = document.readyState === "complete";
    if (ready) {
      completeLoading();
    } else {
      loadHandler = () => completeLoading();
      window.addEventListener("load", loadHandler, { once: true });
    }

    return () => {
      cancelled = true;
      if (intervalTimer) {
        window.clearInterval(intervalTimer);
      }
      if (exitTimer) {
        window.clearTimeout(exitTimer);
      }
      if (loadHandler) {
        window.removeEventListener("load", loadHandler);
      }
    };
  }, [isAdminRoute, reduceMotion]);

  if (isAdminRoute) {
    return null;
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="initial-preloader"
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          exit={{
            y: "-108%",
            transition: reduceMotion ? { duration: 0 } : { duration: 0.72, ease: [0.22, 1, 0.36, 1] }
          }}
          aria-live="polite"
          role="status"
        >
          <div className="initial-preloader-inner">
            <span className="initial-preloader-kicker">NGF Racing</span>
            <h2 className="initial-preloader-title">Ajustando telemetria da pista</h2>

            <div className="initial-preloader-track-wrap">
              <div className="initial-preloader-track" />
              <motion.div
                className="initial-preloader-fill"
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.24, ease: "easeOut" }}
              />
              <motion.div
                className="initial-preloader-car"
                initial={false}
                animate={{ left: `${progress}%` }}
                transition={{ duration: 0.24, ease: "easeOut" }}
                aria-hidden="true"
              >
                <svg viewBox="0 0 80 32" focusable="false">
                  <path d="M10 22h7l7-10h23l6 5h12v5h-4a6 6 0 0 0-12 0H24a6 6 0 0 0-12 0H10z" fill="currentColor" />
                  <circle cx="18" cy="24" r="4" fill="#0a0a0a" />
                  <circle cx="55" cy="24" r="4" fill="#0a0a0a" />
                </svg>
              </motion.div>
            </div>

            <p className="initial-preloader-progress">{progress}%</p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
