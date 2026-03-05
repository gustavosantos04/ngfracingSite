"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import type { PublicCar } from "@/lib/types";

export function CarGallery({ car }: { car: PublicCar }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  const activeImage = car.images[activeIndex] ?? car.images[0];
  const totalImages = car.images.length;

  const imageVariants = useMemo(
    () => ({
      enter: (dir: number) => ({
        x: reduceMotion ? 0 : dir > 0 ? 32 : -32,
        opacity: 0,
        filter: "blur(8px)",
        clipPath: "inset(0 0 100% 0)"
      }),
      center: {
        x: 0,
        opacity: 1,
        filter: "blur(0px)",
        clipPath: "inset(0 0 0% 0)"
      },
      exit: (dir: number) => ({
        x: reduceMotion ? 0 : dir > 0 ? -26 : 26,
        opacity: 0,
        filter: "blur(8px)",
        clipPath: "inset(100% 0 0 0)"
      })
    }),
    [reduceMotion]
  );

  if (!activeImage) {
    return null;
  }

  const updateIndex = (nextIndex: number) => {
    if (nextIndex === activeIndex) {
      return;
    }
    setDirection(nextIndex > activeIndex ? 1 : -1);
    setActiveIndex(nextIndex);
  };

  const moveBy = (step: number) => {
    if (totalImages < 2) {
      return;
    }

    const nextIndex = (activeIndex + step + totalImages) % totalImages;
    setDirection(step > 0 ? 1 : -1);
    setActiveIndex(nextIndex);
  };

  const handleTouchStart = (clientX: number) => {
    setTouchStartX(clientX);
  };

  const handleTouchEnd = (clientX: number) => {
    if (touchStartX === null) {
      return;
    }

    const delta = clientX - touchStartX;
    if (Math.abs(delta) >= 45) {
      moveBy(delta < 0 ? 1 : -1);
    }
    setTouchStartX(null);
  };

  return (
    <div className="stack">
      <div
        className="surface-card car-gallery-main"
        onTouchStart={(event) => handleTouchStart(event.touches[0]?.clientX ?? 0)}
        onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={activeImage.id}
            className="car-gallery-stage"
            custom={direction}
            variants={imageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={reduceMotion ? { duration: 0 } : { duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={activeImage.url}
              alt={activeImage.alt}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 60vw"
              style={{ objectFit: "cover" }}
            />
          </motion.div>
        </AnimatePresence>

        {totalImages > 1 ? (
          <>
            <button type="button" className="gallery-nav gallery-nav-prev" onClick={() => moveBy(-1)} aria-label="Imagem anterior">
              {"<"}
            </button>
            <button type="button" className="gallery-nav gallery-nav-next" onClick={() => moveBy(1)} aria-label="Próxima imagem">
              {">"}
            </button>
          </>
        ) : null}
      </div>
      <div className="car-gallery-thumbs">
        {car.images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => updateIndex(index)}
            aria-label={`Selecionar foto ${index + 1}`}
            className={`car-gallery-thumb ${index === activeIndex ? "is-active" : ""}`}
          >
            <Image src={image.url} alt={image.alt} fill sizes="100px" style={{ objectFit: "cover" }} />
          </button>
        ))}
      </div>
    </div>
  );
}