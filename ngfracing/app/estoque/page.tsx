import type { Metadata } from "next";
import { InventoryFilters } from "@/components/site/InventoryFilters";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getAllCars } from "@/lib/data";

export const metadata: Metadata = {
  title: "Estoque de Carros",
  description: "Lista publica de carros disponiveis, reservados e vendidos da NGF Racing."
};

export default async function InventoryPage() {
  const cars = await getAllCars();

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="section">
        <div className="container stack">
          <div>
            <span className="section-kicker">Estoque</span>
            <h1 className="section-title">Carros com procedencia e performance</h1>
            <p className="section-copy">
              Filtros e ordenacao no cliente, com pagina dedicada para cada carro e SEO via metadata e Schema.org.
            </p>
          </div>
          {cars.length === 0 ? (
            <div className="admin-card">
              <strong style={{ display: "block", marginBottom: 8 }}>Em breve novos carros</strong>
              <span className="muted">
                Ainda nao temos veiculos publicados. Novas opcoes serao adicionadas em breve.
              </span>
            </div>
          ) : null}
          <InventoryFilters cars={cars} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
