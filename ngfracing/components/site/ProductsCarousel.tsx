"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import type { PublicProduct } from "@/lib/types";

type Props = {
  products: PublicProduct[];
};

const AUTOPLAY_MS = 4800;

function getCardsPerPage(width: number) {
  if (width < 700) {
    return 1;
  }

  if (width < 1080) {
    return 2;
  }

  return 3;
}

export function ProductsCarousel({ products }: Props) {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const shuffledProducts = useMemo(() => products, [products]);

  useEffect(() => {
    const syncViewport = () => {
      setCardsPerPage(getCardsPerPage(window.innerWidth));
    };

    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  const totalPages = Math.max(1, Math.ceil(shuffledProducts.length / cardsPerPage));
  const currentPage = Math.min(page, totalPages - 1);
  const visibleProducts = shuffledProducts.slice(currentPage * cardsPerPage, currentPage * cardsPerPage + cardsPerPage);

  useEffect(() => {
    if (page !== currentPage) {
      setPage(currentPage);
    }
  }, [currentPage, page]);

  useEffect(() => {
    if (totalPages <= 1 || isPaused) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setDirection(1);
      setPage((current) => (current + 1) % totalPages);
    }, AUTOPLAY_MS);

    return () => window.clearTimeout(timeout);
  }, [currentPage, isPaused, totalPages]);

  const paginate = (step: number) => {
    setDirection(step);
    setPage((current) => (current + step + totalPages) % totalPages);
  };

  return (
    <div
      className="products-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="products-carousel-head">
        <div className="products-carousel-progress" aria-live="polite">
          <span>
            {String(currentPage + 1).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
          </span>
        </div>
        <div className="products-carousel-controls">
          <button
            type="button"
            className="carousel-arrow"
            onClick={() => paginate(-1)}
            aria-label="Ver produtos anteriores"
            disabled={shuffledProducts.length <= cardsPerPage}
          >
            <span aria-hidden="true">{"<"}</span>
          </button>
          <button
            type="button"
            className="carousel-arrow"
            onClick={() => paginate(1)}
            aria-label="Ver proximos produtos"
            disabled={shuffledProducts.length <= cardsPerPage}
          >
            <span aria-hidden="true">{">"}</span>
          </button>
        </div>
      </div>

      <div className="products-carousel-viewport">
        <AnimatePresence custom={direction} initial={false} mode="wait">
          <motion.div
            key={`${currentPage}-${cardsPerPage}`}
            custom={direction}
            variants={{
              enter: (value: number) => ({
                x: value > 0 ? 90 : -90,
                opacity: 0
              }),
              center: {
                x: 0,
                opacity: 1
              },
              exit: (value: number) => ({
                x: value > 0 ? -90 : 90,
                opacity: 0
              })
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="products-carousel-track"
          >
            {visibleProducts.map((product) => (
              <div key={product.id} className="products-carousel-item">
                <ProductCard product={product} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
