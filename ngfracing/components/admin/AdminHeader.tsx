import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { prisma } from "@/lib/prisma";

export async function AdminHeader() {
  const newOrders = await prisma.order.count({ where: { status: "NEW" } }).catch(() => 0);

  return (
    <header style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <div
        className="admin-main"
        style={{
          paddingTop: 18,
          paddingBottom: 18,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap"
        }}
      >
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.45rem" }}>NGF Racing Admin</div>
          <div className="muted" style={{ fontSize: "0.9rem" }}>
            CMS para estoque, conteudo e catalogo de produtos
          </div>
        </div>
        <nav className="inline-actions" aria-label="Navegacao do admin">
          <Link href="/admin" className="button-ghost">
            Dashboard
          </Link>
          <Link href="/admin/pedidos" className="button-ghost admin-nav-link">
            <span>Pedidos</span>
            {newOrders > 0 ? <span className="admin-nav-badge">{newOrders}</span> : null}
          </Link>
          <Link href="/admin/carros" className="button-ghost">
            Carros
          </Link>
          <Link href="/admin/produtos" className="button-ghost">
            Produtos
          </Link>
          <Link href="/admin/configuracoes" className="button-ghost">
            Configuracoes
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="button-danger">
              Sair
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
