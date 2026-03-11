import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { requireAdminSession } from "@/lib/auth";
import { getAllOrders } from "@/lib/data";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default async function AdminOrdersPage() {
  await requireAdminSession();
  const orders = await getAllOrders();

  return (
    <AdminShell>
      <div className="stack">
        <div>
          <span className="section-kicker">Pedidos</span>
          <h1 className="section-title" style={{ marginBottom: 8 }}>
            Solicitacoes recebidas
          </h1>
          <p className="section-copy">Acompanhe os pedidos de produtos, visualize os dados do cliente e atualize o status.</p>
        </div>

        <div className="surface-card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Cliente</th>
                <th>Contato</th>
                <th>Produto</th>
                <th>Qtd.</th>
                <th>Status</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{formatDateTime(order.createdAt)}</td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{order.customerName}</div>
                    <div className="muted">{order.customerEmail}</div>
                  </td>
                  <td>{order.customerPhone}</td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{order.productNameSnapshot}</div>
                    <div className="muted">
                      {order.productCategorySnapshot} · {formatCurrency(order.productPriceSnapshot)}
                    </div>
                  </td>
                  <td>
                    {order.quantity}
                    {order.selectedSize ? ` / ${order.selectedSize}` : ""}
                  </td>
                  <td>
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td>
                    <Link href={`/admin/pedidos/${order.id}`} className="button-secondary">
                      Abrir
                    </Link>
                  </td>
                </tr>
              ))}
              {!orders.length ? (
                <tr>
                  <td colSpan={7} className="muted">
                    Nenhum pedido registrado ainda.
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
