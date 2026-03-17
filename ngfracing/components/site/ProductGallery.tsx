"use client";

import Image from "next/image";
import { useState } from "react";
import { sharedImageBlurDataUrl } from "@/lib/images";
import type { PublicProduct } from "@/lib/types";

export function ProductGallery({ product }: { product: PublicProduct }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = product.images[activeIndex] ?? product.images[0];

  if (!activeImage) {
    return null;
  }

  return (
    <div className="stack car-gallery-shell">
      <div className="surface-card car-gallery-main">
        <div className="car-gallery-stage">
          <div className="car-gallery-stage-media">
            <Image
              src={activeImage.url}
              alt={activeImage.alt}
              fill
              priority={activeIndex === 0}
              placeholder="blur"
              blurDataURL={sharedImageBlurDataUrl}
              sizes="(max-width: 900px) 100vw, 58vw"
              className="car-gallery-stage-image"
            />
          </div>
        </div>
      </div>
      {product.images.length > 1 ? (
        <div className="car-gallery-thumbs">
          {product.images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Selecionar foto ${index + 1}`}
              className={`car-gallery-thumb ${index === activeIndex ? "is-active" : ""}`}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="96px"
                placeholder="blur"
                blurDataURL={sharedImageBlurDataUrl}
                style={{ objectFit: "cover" }}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
