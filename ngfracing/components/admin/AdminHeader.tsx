import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

export function AdminHeader() {
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
            CMS para estoque, conteúdo e catálogo FuelTech
          </div>
        </div>
        <nav className="inline-actions" aria-label="Navegação do admin">
          <Link href="/admin" className="button-ghost">
            Dashboard
          </Link>
          <Link href="/admin/carros" className="button-ghost">
            Carros
          </Link>
          <Link href="/admin/pecas" className="button-ghost">
            Peças
          </Link>
          <Link href="/admin/configuracoes" className="button-ghost">
            Configurações
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
