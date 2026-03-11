"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatProductAvailability, getAvailableStock, hasSelectableSizes } from "@/lib/products";
import type { PublicProduct } from "@/lib/types";

export function ProductPurchaseConfigurator({ product }: { product: PublicProduct }) {
  const requiresSize = hasSelectableSizes(product.category);
  const firstAvailableSize = product.sizeStocks.find((item) => item.stock > 0)?.size ?? "";
  const [size, setSize] = useState(firstAvailableSize);
  const [quantity, setQuantity] = useState(1);
  const availableStock = getAvailableStock(product, size);
  const maxQuantity = Math.max(1, availableStock);

  useEffect(() => {
    setQuantity((current) => Math.min(current, maxQuantity));
  }, [maxQuantity]);

  const requestHref = useMemo(() => {
    const params = new URLSearchParams({
      quantity: String(quantity)
    });

    if (size) {
      params.set("size", size);
    }

    return `/produtos/${product.slug}/solicitar?${params.toString()}`;
  }, [product.slug, quantity, size]);

  const canRequest = requiresSize ? Boolean(size) && availableStock > 0 : availableStock > 0;

  return (
    <div className="admin-card stack">
      <h2 style={{ margin: 0 }}>Solicitar compra</h2>
      {requiresSize ? (
        <div className="field">
          <label htmlFor="product-size">Tamanho</label>
          <select id="product-size" value={size} onChange={(event) => setSize(event.target.value)}>
            <option value="">Selecione</option>
            {product.sizeStocks.map((item) => (
              <option key={item.size} value={item.size} disabled={item.stock < 1}>
                {item.size} {item.stock > 0 ? `(${item.stock} un.)` : "(Sem estoque)"}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="field">
        <label htmlFor="product-quantity">Quantidade</label>
        <input
          id="product-quantity"
          type="number"
          min={1}
          max={maxQuantity}
          value={quantity}
          onChange={(event) => {
            const next = Number.parseInt(event.target.value, 10) || 1;
            setQuantity(Math.max(1, Math.min(next, maxQuantity)));
          }}
        />
      </div>

      <div className="chip">{formatProductAvailability(product, size)}</div>

      {canRequest ? (
        <Link href={requestHref} className="button-primary">
          Solicitar compra
        </Link>
      ) : (
        <span className="button-secondary" style={{ opacity: 0.6, pointerEvents: "none" }}>
          Indisponível no momento
        </span>
      )}
    </div>
  );
}
