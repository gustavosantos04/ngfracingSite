import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/site/ProductCard";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import {
  countProductsByCategory,
  filterProductsByCategory,
  getProductsCategoryHref,
  parseProductCategoryQuery,
  productCategoryFilterOptions
} from "@/lib/productCategories";
import { getAllProducts } from "@/lib/data";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const metadata: Metadata = {
  title: "Produtos",
  description: "Catálogo de peças, roupas e acessórios selecionados pela NGF Racing."
};

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const [products, params] = await Promise.all([getAllProducts(), searchParams]);
  const selectedCategory = parseProductCategoryQuery(params.categoria);
  const filteredProducts = filterProductsByCategory(products, selectedCategory);
  const counts = countProductsByCategory(products);
  const activeOption = productCategoryFilterOptions.find((option) => option.category === selectedCategory) ?? productCategoryFilterOptions[0];

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

          <section className="admin-card stack">
            <div>
              <h2 style={{ marginTop: 0, marginBottom: 8 }}>Filtrar por categoria</h2>
              <p className="section-copy" style={{ marginBottom: 0 }}>
                Selecione o tipo de produto para refinar a listagem. A URL permanece compartilhável com o filtro ativo.
              </p>
            </div>

            <div className="category-card-grid">
              {productCategoryFilterOptions.map((option) => {
                const isActive = option.category === selectedCategory;
                const itemCount =
                  option.category === null ? counts.all : counts[option.category];

                return (
                  <Link
                    key={option.label}
                    href={getProductsCategoryHref(option.category)}
                    className={`category-card ${isActive ? "is-active" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="category-card-kicker">{isActive ? "Filtro ativo" : "Categoria"}</span>
                    <div className="category-card-title-row">
                      <div>
                        <h3 style={{ margin: 0 }}>{option.shortLabel}</h3>
                        <p className="category-card-meta" style={{ marginTop: 6 }}>
                          {option.description}
                        </p>
                      </div>
                      <span className="category-card-icon" aria-hidden="true">
                        {option.accent}
                      </span>
                    </div>
                    <div className="category-card-meta">{itemCount} produto(s) encontrados</div>
                  </Link>
                );
              })}
            </div>
          </section>

          <div className="inline-actions" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <span className="chip">Filtro: {activeOption.label}</span>
            <span className="chip">{filteredProducts.length} produto(s)</span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <section className="admin-card">
              <h2 style={{ marginTop: 0 }}>Nenhum item nesta categoria</h2>
              <p className="section-copy">
                Ainda não há produtos publicados em <strong>{activeOption.shortLabel}</strong>. Escolha outro filtro ou{" "}
                <Link href="/produtos" style={{ color: "var(--yellow)" }}>
                  volte para ver todos os produtos
                </Link>
                .
              </p>
            </section>
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
