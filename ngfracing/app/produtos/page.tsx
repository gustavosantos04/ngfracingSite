import type { Metadata } from "next";
import { ProductCard } from "@/components/site/ProductCard";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getAllProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Produtos",
  description: "Catálogo de peças, roupas e acessórios selecionados pela NGF Racing."
};

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="section">
        <div className="container stack">
          <div>
            <span className="section-kicker">Produtos</span>
            <h1 className="section-title">Catálogo de produtos</h1>
            <p className="section-copy">
              Peças, roupas e acessórios com curadoria da NGF Racing para quem quer desempenho e identidade no mesmo projeto.
            </p>
          </div>
          {products.length > 0 ? (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <section className="admin-card">
              <h2 style={{ marginTop: 0 }}>Em breve novos produtos</h2>
              <p className="section-copy" style={{ marginBottom: 0 }}>
                Nosso catálogo ainda não possui itens publicados. Volte em breve para acompanhar as novidades.
              </p>
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
