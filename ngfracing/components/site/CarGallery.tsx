"use client";

import Image from "next/image";
import { useState } from "react";
import type { PublicCar } from "@/lib/types";

export function CarGallery({ car }: { car: PublicCar }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = car.images[activeIndex] ?? car.images[0];

  if (!activeImage) {
    return null;
  }

  return (
    <div className="stack">
      <div className="surface-card" style={{ position: "relative", minHeight: 440, overflow: "hidden" }}>
        <Image
          src={activeImage.url}
          alt={activeImage.alt}
          fill
          priority
          sizes="(max-width: 900px) 100vw, 60vw"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(92px, 1fr))",
          gap: 10
        }}
      >
        {car.images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Selecionar foto ${index + 1}`}
            style={{
              position: "relative",
              minHeight: 84,
              borderRadius: 14,
              border:
                index === activeIndex
                  ? "2px solid var(--yellow)"
                  : "1px solid rgba(255,255,255,0.08)",
              overflow: "hidden",
              background: "transparent"
            }}
          >
            <Image src={image.url} alt={image.alt} fill sizes="100px" style={{ objectFit: "cover" }} />
          </button>
        ))}
      </div>
    </div>
  );
}
