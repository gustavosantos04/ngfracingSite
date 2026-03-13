import Link from "next/link";
import { deleteProductAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminSession } from "@/lib/auth";
import { getAllProducts } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminProductsPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdminSession();

  const products = await getAllProducts();
  const params = await searchParams;
  const notice = params.saved === "1" ? "Produto salvo com sucesso." : params.deleted === "1" ? "Produto removido." : "";

  return (
    <AdminShell>
      <div className="stack">
        <div className="inline-actions" style={{ justifyContent: "space-between" }}>
          <div>
            <span className="section-kicker">Produtos</span>
            <h1 className="section-title" style={{ marginBottom: 8 }}>
              Catálogo de produtos
            </h1>
            <p className="section-copy">Gerencie peças, roupas e acessórios com estoque simples ou por tamanho.</p>
          </div>
          <Link href="/admin/produtos/new" className="button-primary admin-compact-cta">
            Novo produto
          </Link>
        </div>

        {notice ? <div className="admin-card form-feedback form-feedback-success">{notice}</div> : null}

        <div className="surface-card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{product.name}</div>
                    <div className="muted">{product.slug}</div>
                  </td>
                  <td>{product.categoryLabel}</td>
                  <td>{formatCurrency(product.priceCents)}</td>
                  <td>
                    {product.category === "APPAREL"
                      ? `${product.totalStock} un. / ${product.sizeStocks.length} tamanho(s)`
                      : `${product.stockQuantity ?? 0} un.`}
                  </td>
                  <td>
                    <div className="inline-actions">
                      <Link href={`/admin/produtos/${product.id}`} className="button-secondary">
                        Editar
                      </Link>
                      <Link href={`/produtos/${product.slug}`} className="button-ghost">
                        Ver
                      </Link>
                      <form action={deleteProductAction}>
                        <input type="hidden" name="productId" value={product.id} />
                        <button type="submit" className="button-danger">
                          Excluir
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {!products.length ? (
                <tr>
                  <td colSpan={5} className="muted">
                    Nenhum produto cadastrado ainda.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
