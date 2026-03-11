import Link from "next/link";
import { OrderStatus } from "@prisma/client";
import { notFound } from "next/navigation";
import { updateOrderStatusAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { requireAdminSession } from "@/lib/auth";
import { getOrderById } from "@/lib/data";
import { formatCurrency, formatDateTime } from "@/lib/utils";

type Params = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminOrderDetailsPage({ params, searchParams }: Params) {
  await requireAdminSession();

  const { id } = await params;
  const order = await getOrderById(id);
  const query = await searchParams;
  const notice = query.saved === "1" ? "Status atualizado com sucesso." : "";

  if (!order) {
    notFound();
  }

  return (
    <AdminShell>
      <div className="stack">
        <div className="inline-actions">
          <Link href="/admin/pedidos" className="button-secondary">
            Voltar
          </Link>
          <Link href="/admin/produtos" className="button-ghost">
            Ir para produtos
          </Link>
        </div>

        {notice ? <div className="admin-card">{notice}</div> : null}

        <div className="field-grid two" style={{ alignItems: "start" }}>
          <div className="stack">
            <div className="admin-card stack">
              <div className="inline-actions" style={{ justifyContent: "space-between" }}>
                <div>
                  <span className="section-kicker">Pedido</span>
                  <h1 className="section-title" style={{ marginBottom: 8 }}>
                    {order.productNameSnapshot}
                  </h1>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="chip">Data do pedido: {formatDateTime(order.createdAt)}</div>
              <div className="chip">Atualizado em: {formatDateTime(order.updatedAt)}</div>
              <div className="chip">Categoria: {order.productCategorySnapshot}</div>
              <div className="chip">Preco: {formatCurrency(order.productPriceSnapshot)}</div>
              <div className="chip">ID do produto: {order.productId}</div>
              <div className="chip">Quantidade: {order.quantity}</div>
              {order.selectedSize ? <div className="chip">Tamanho: {order.selectedSize}</div> : null}
            </div>

            <div className="admin-card stack">
              <h2 style={{ margin: 0 }}>Cliente</h2>
              <div className="chip">Nome: {order.customerName}</div>
              <div className="chip">E-mail: {order.customerEmail}</div>
              <div className="chip">Telefone: {order.customerPhone}</div>
              <div className="chip">Endereco: {order.customerAddress}</div>
            </div>
          </div>

          <form action={updateOrderStatusAction} className="admin-card stack">
            <input type="hidden" name="orderId" value={order.id} />
            <h2 style={{ margin: 0 }}>Atualizar status</h2>
            <div className="field">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={order.status}>
                <option value={OrderStatus.NEW}>Novo</option>
                <option value={OrderStatus.CONTACTED}>Contatado</option>
                <option value={OrderStatus.CLOSED}>Fechado</option>
                <option value={OrderStatus.CANCELED}>Cancelado</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="notes">Observacoes</label>
              <textarea id="notes" name="notes" defaultValue={order.notes ?? ""} />
            </div>
            <button type="submit" className="button-primary">
              Salvar status
            </button>
          </form>
        </div>
      </div>
    </AdminShell>
  );
}
