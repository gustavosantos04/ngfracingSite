import type { Metadata } from "next";
import { InventoryFilters } from "@/components/site/InventoryFilters";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getAllCars } from "@/lib/data";

export const metadata: Metadata = {
  title: "Estoque de Carros",
  description: "Seleção de carros da NGF Racing com procedência e foco em performance."
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
            <h1 className="section-title">Carros com procedência comprovada</h1>
            <p className="section-copy">
              Explore nossa seleção, compare detalhes e fale com a equipe para encontrar o carro ideal para o seu perfil.
            </p>
          </div>
          {cars.length === 0 ? (
            <div className="admin-card">
              <strong style={{ display: "block", marginBottom: 8 }}>Em breve novos carros</strong>
              <span className="muted">
                Ainda não temos veículos publicados. Novas opções serão adicionadas em breve.
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
