"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

export function HeroParallaxMedia({ imageUrl }: { imageUrl: string }) {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, 140]);
  const scale = useTransform(scrollY, [0, 700], [1.08, 1.18]);

  if (reduceMotion) {
    return (
      <div
        className="hero-media"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(0,0,0,0.82), rgba(0,0,0,0.5)), url(${imageUrl})`
        }}
      />
    );
  }

  return (
    <motion.div
      className="hero-media"
      style={{
        y,
        scale,
        backgroundImage: `linear-gradient(120deg, rgba(0,0,0,0.82), rgba(0,0,0,0.5)), url(${imageUrl})`
      }}
    />
  );
}
