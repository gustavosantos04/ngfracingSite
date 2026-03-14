"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { sharedImageBlurDataUrl } from "@/lib/images";

export function HeroParallaxMedia({ imageUrl }: { imageUrl: string }) {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, 140]);
  const scale = useTransform(scrollY, [0, 700], [1.08, 1.18]);

  if (reduceMotion) {
    return (
      <div className="hero-media">
        <Image
          src={imageUrl}
          alt=""
          aria-hidden="true"
          fill
          priority
          placeholder="blur"
          blurDataURL={sharedImageBlurDataUrl}
          sizes="100vw"
          className="hero-media-image"
        />
        <div className="hero-media-overlay" />
      </div>
    );
  }

  return (
    <motion.div
      className="hero-media"
      style={{
        y,
        scale
      }}
    >
      <Image
        src={imageUrl}
        alt=""
        aria-hidden="true"
        fill
        priority
        placeholder="blur"
        blurDataURL={sharedImageBlurDataUrl}
        sizes="100vw"
        className="hero-media-image"
      />
      <div className="hero-media-overlay" />
    </motion.div>
  );
}
