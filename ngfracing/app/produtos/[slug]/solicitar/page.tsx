import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PurchaseRequestForm } from "@/components/site/PurchaseRequestForm";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getProductBySlug } from "@/lib/data";
import { getAvailableStock } from "@/lib/products";
import { formatCurrency } from "@/lib/utils";

type Params = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "Solicitar compra"
};

export default async function ProductPurchaseRequestPage({ params, searchParams }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const query = await searchParams;
  const quantity = Math.max(1, Number.parseInt(String(query.quantity ?? "1"), 10) || 1);
  const size = typeof query.size === "string" ? query.size : null;
  const availableStock = getAvailableStock(product, size);
  const invalidRequest =
    availableStock < quantity || (product.category === "APPAREL" && (!size || availableStock < 1));

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="section">
        <div className="container stack">
          <div className="inline-actions">
            <Link href={`/produtos/${product.slug}`} className="button-secondary">
              Voltar ao produto
            </Link>
          </div>
          <div>
            <span className="section-kicker">Solicitação</span>
            <h1 className="section-title" style={{ marginBottom: 8 }}>
              Solicitar compra
            </h1>
            <p className="section-copy">Preencha os dados abaixo e a equipe da NGF Racing retorna com o próximo passo.</p>
          </div>

          <div className="field-grid two" style={{ alignItems: "start" }}>
            <div className="admin-card stack">
              <h2 style={{ margin: 0 }}>Resumo do pedido</h2>
              <div className="chip">Produto: {product.name}</div>
              <div className="chip">Categoria: {product.categoryLabel}</div>
              <div className="chip">Preço: {formatCurrency(product.priceCents)}</div>
              <div className="chip">Quantidade desejada: {quantity}</div>
              {size ? <div className="chip">Tamanho: {size}</div> : null}
              <div className="chip">Disponibilidade atual: {availableStock} un.</div>
            </div>

            {invalidRequest ? (
              <div className="admin-card">
                A quantidade ou o tamanho selecionado não estão mais disponíveis. Volte ao produto e ajuste sua seleção.
              </div>
            ) : (
              <PurchaseRequestForm productId={product.id} quantity={quantity} size={size} />
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
