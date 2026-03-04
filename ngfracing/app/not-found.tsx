import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-shell" style={{ display: "grid", placeItems: "center", padding: 24 }}>
      <div className="admin-card" style={{ width: "min(520px, 100%)" }}>
        <div className="stack">
          <span className="section-kicker">404</span>
          <h1 className="section-title" style={{ fontSize: "2rem" }}>
            Conteudo nao encontrado
          </h1>
          <p className="section-copy">
            A rota solicitada nao existe ou o item foi removido do catalogo.
          </p>
          <div className="inline-actions">
            <Link href="/" className="button-primary">
              Voltar para a home
            </Link>
            <Link href="/estoque" className="button-secondary">
              Abrir estoque
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
