import Image from "next/image";
import Link from "next/link";
import type { PublicProduct } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function ProductCard({ product }: { product: PublicProduct }) {
  return (
    <article className="surface-card product-card">
      <div className="product-card-media">
        <Image
          src={product.primaryImageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 900px) 100vw, 33vw"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div style={{ padding: 18 }} className="stack">
        <div className="inline-actions" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <span className="chip">{product.categoryLabel}</span>
          {product.isFeatured ? <span className="chip">Destaque</span> : null}
        </div>
        <div>
          <h3 style={{ margin: "0 0 8px" }}>{product.name}</h3>
          <div className="price" style={{ fontSize: "1.25rem" }}>
            {formatCurrency(product.priceCents)}
          </div>
        </div>
        <Link href={`/produtos/${product.slug}`} className="button-primary">
          Ver detalhes
        </Link>
      </div>
    </article>
  );
}
