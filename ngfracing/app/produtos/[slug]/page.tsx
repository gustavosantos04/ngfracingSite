import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/site/ProductGallery";
import { ProductPurchaseConfigurator } from "@/components/site/ProductPurchaseConfigurator";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getProductBySlug } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Produto não encontrado" };
  }

  return {
    title: product.name,
    description: `${product.name} - ${product.categoryLabel} por ${formatCurrency(product.priceCents)}.`,
    openGraph: {
      images: [product.primaryImageUrl]
    }
  };
}

export default async function ProductDetailsPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((image) => image.url),
    description: product.description,
    category: product.categoryLabel,
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: (product.priceCents / 100).toFixed(2),
      availability: product.totalStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="section">
        <div className="container stack">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
          />
          <div className="field-grid two" style={{ alignItems: "start" }}>
            <ProductGallery product={product} />
            <div className="stack">
              <div className="admin-card">
                <div className="inline-actions" style={{ justifyContent: "space-between" }}>
                  <span className="chip">{product.categoryLabel}</span>
                  {product.isFeatured ? <span className="chip">Destaque</span> : null}
                </div>
                <h1 className="section-title" style={{ marginTop: 18, marginBottom: 8 }}>
                  {product.name}
                </h1>
                <div className="price" style={{ fontSize: "2rem" }}>
                  {formatCurrency(product.priceCents)}
                </div>
                <p className="section-copy" style={{ marginTop: 22 }}>
                  {product.description}
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 12,
                    marginTop: 18
                  }}
                >
                  <div className="chip">Categoria: {product.categoryLabel}</div>
                  <div className="chip">Disponibilidade: {product.totalStock > 0 ? "Em estoque" : "Sem estoque"}</div>
                  <div className="chip">
                    {product.category === "APPAREL"
                      ? `${product.totalStock} un. somadas`
                      : `${product.stockQuantity ?? 0} un. disponíveis`}
                  </div>
                  <div className="chip">
                    {product.category === "APPAREL"
                      ? `${product.sizeStocks.length} tamanho(s) disponíveis`
                      : "Quantidade livre por unidade"}
                  </div>
                </div>
                <div className="inline-actions" style={{ marginTop: 24 }}>
                  <Link href="/produtos" className="button-secondary">
                    Voltar aos produtos
                  </Link>
                </div>
              </div>
              <ProductPurchaseConfigurator product={product} />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
