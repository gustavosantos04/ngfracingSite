import Link from "next/link";
import { CarCard } from "@/components/site/CarCard";
import { getFeaturedCars } from "@/lib/data";

export async function FeaturedInventory() {
  const cars = await getFeaturedCars(3);

  return (
    <section id="estoque" className="section">
      <div className="container stack">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "end",
            flexWrap: "wrap"
          }}
        >
          <div>
            <span className="section-kicker">Estoque</span>
            <h2 className="section-title">Seleção de destaque</h2>
            <p className="section-copy">
              Veículos escolhidos com critério técnico, histórico confiável e preparo para quem busca performance de verdade.
            </p>
          </div>
          <Link href="/estoque" className="button-ghost">
            Ver todo o estoque
          </Link>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 18
          }}
        >
          {cars.length > 0 ? (
            cars.map((car) => <CarCard key={car.id} car={car} />)
          ) : (
            <article className="surface-card" style={{ padding: 24 }}>
              <h3 style={{ marginTop: 0 }}>Em breve novos carros</h3>
              <p className="section-copy" style={{ marginBottom: 0 }}>
                Nosso estoque está sendo atualizado. Fale com a equipe para receber as próximas oportunidades.
              </p>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
