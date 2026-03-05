import type { Metadata } from "next";
import Image from "next/image";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getPartCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Pecas de Alta Performance",
  description: "Catalogo informativo de pecas FuelTech e acessorios de performance."
};

export default async function PartsPage() {
  const categories = await getPartCategories();

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="section">
        <div className="container stack">
          <div>
            <span className="section-kicker">FuelTech</span>
            <h1 className="section-title">Catalogo de pecas de alta performance</h1>
            <p className="section-copy">
              Secao informativa gerenciavel pelo Admin. Sem checkout no MVP, focada em captar interesse e organizar o catalogo.
            </p>
          </div>
          <div className="stack">
            {categories.length > 0 ? (
              categories.map((category) => (
                <section key={category.id} className="admin-card">
                  <div className="inline-actions" style={{ justifyContent: "space-between" }}>
                    <h2 style={{ margin: 0 }}>{category.name}</h2>
                    <span className="chip">{category.items.length} item(ns)</span>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                      gap: 16,
                      marginTop: 18
                    }}
                  >
                    {category.items.map((item) => (
                      <article key={item.id} className="surface-card">
                        {item.imageUrl ? (
                          <div style={{ position: "relative", minHeight: 180 }}>
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              sizes="(max-width: 900px) 100vw, 25vw"
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                        ) : null}
                        <div style={{ padding: 18 }}>
                          <div className="inline-actions" style={{ justifyContent: "space-between" }}>
                            <h3 style={{ margin: 0 }}>{item.name}</h3>
                            {item.isFeatured ? <span className="chip">Destaque</span> : null}
                          </div>
                          <p className="section-copy" style={{ marginTop: 12, fontSize: "0.95rem" }}>
                            {item.description}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))
            ) : (
              <section className="admin-card">
                <h2 style={{ marginTop: 0 }}>Em breve novas pecas</h2>
                <p className="section-copy" style={{ marginBottom: 0 }}>
                  Nosso catalogo ainda nao possui itens publicados. Volte em breve para acompanhar as novidades.
                </p>
              </section>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
