import Link from "next/link";
import { ProductsCarousel } from "@/components/site/ProductsCarousel";
import { getFeaturedProducts } from "@/lib/data";

export async function ProductsPreview() {
  const products = await getFeaturedProducts(6);

  return (
    <section className="section">
      <div className="container stack">
        <div>
          <span className="section-kicker">Produtos</span>
          <h2 className="section-title">Pecas, roupas e acessorios</h2>
          <p className="section-copy">
            Um catalogo mais completo para quem busca performance, estilo e itens selecionados pela NGF Racing.
          </p>
        </div>
        {products.length > 0 ? (
          <ProductsCarousel products={products} />
        ) : (
          <div className="admin-card">
            <h3 style={{ marginTop: 0 }}>Catalogo em atualizacao</h3>
            <p className="muted" style={{ marginBottom: 0 }}>
              Em breve novos produtos estarao disponiveis aqui.
            </p>
          </div>
        )}
        <div>
          <Link href="/produtos" className="button-primary">
            Ver todos os produtos
          </Link>
        </div>
      </div>
    </section>
  );
}
