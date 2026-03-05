import Link from "next/link";
import { getPartCategories } from "@/lib/data";

export async function PartsPreview() {
  const categories = await getPartCategories();

  return (
    <section className="section">
      <div className="container stack">
        <div>
          <span className="section-kicker">FuelTech</span>
          <h2 className="section-title">Pecas de alta performance</h2>
          <p className="section-copy">
            MVP sem checkout, com catalogo administravel. Ideal para publicar rapido e evoluir depois.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16
          }}
        >
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.id} className="admin-card">
                <div style={{ color: "var(--yellow)", fontSize: "0.82rem", textTransform: "uppercase" }}>
                  Categoria
                </div>
                <h3 style={{ margin: "10px 0 8px" }}>{category.name}</h3>
                <p className="muted" style={{ margin: 0 }}>
                  {category.items.length} item(ns) cadastrados
                </p>
              </div>
            ))
          ) : (
            <div className="admin-card">
              <h3 style={{ marginTop: 0 }}>Catalogo em atualizacao</h3>
              <p className="muted" style={{ marginBottom: 0 }}>
                Em breve novas pecas de alta performance estarao disponiveis aqui.
              </p>
            </div>
          )}
        </div>
        <div>
          <Link href="/pecas" className="button-primary">
            Abrir catalogo de pecas
          </Link>
        </div>
      </div>
    </section>
  );
}
