"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";

type TimelineItem = {
  year: string;
  copy: string;
};

export function AboutTimeline({ items }: { items: readonly TimelineItem[] }) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 85%", "end 30%"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 26,
    mass: 0.8
  });

  return (
    <div className="timeline" ref={sectionRef}>
      <div className="timeline-line">
        <motion.span
          className="timeline-progress timeline-progress-horizontal"
          style={{ scaleX: reduceMotion ? 1 : smoothProgress }}
        />
        <motion.span
          className="timeline-progress timeline-progress-vertical"
          style={{ scaleY: reduceMotion ? 1 : smoothProgress }}
        />
      </div>

      <div className="timeline-grid">
        {items.map((item, index) => (
          <motion.article
            key={item.year}
            className="timeline-item"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 170, damping: 22, delay: index * 0.08 }
            }
          >
            <span className="timeline-dot" aria-hidden="true" />
            <div className="timeline-year">{item.year}</div>
            <p>{item.copy}</p>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
