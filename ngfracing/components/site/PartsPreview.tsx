import Link from "next/link";
import { getPartCategories } from "@/lib/data";

export async function PartsPreview() {
  const categories = await getPartCategories();

  return (
    <section className="section">
      <div className="container stack">
        <div>
          <span className="section-kicker">FuelTech</span>
          <h2 className="section-title">Peças de alta performance</h2>
          <p className="section-copy">
            Soluções selecionadas para setups de rua e pista, com orientação da equipe para cada objetivo.
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
              <h3 style={{ marginTop: 0 }}>Catálogo em atualização</h3>
              <p className="muted" style={{ marginBottom: 0 }}>
                Em breve novas peças de alta performance estarão disponíveis aqui.
              </p>
            </div>
          )}
        </div>
        <div>
          <Link href="/pecas" className="button-primary">
            Ver catálogo de peças
          </Link>
        </div>
      </div>
    </section>
  );
}
