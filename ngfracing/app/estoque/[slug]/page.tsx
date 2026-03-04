import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CarGallery } from "@/components/site/CarGallery";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getCarBySlug } from "@/lib/data";
import { formatCurrency, formatKilometers } from "@/lib/utils";

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCarBySlug(slug);

  if (!car) {
    return { title: "Carro nao encontrado" };
  }

  return {
    title: car.title,
    description: `${car.title} - ${car.year}, ${formatKilometers(car.km)} e ${formatCurrency(car.priceCents)}.`,
    openGraph: {
      images: car.images[0] ? [car.images[0].url] : []
    }
  };
}

export default async function CarDetailsPage({ params }: Params) {
  const { slug } = await params;
  const car = await getCarBySlug(slug);

  if (!car) {
    notFound();
  }

  const vehicleSchema = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: car.title,
    brand: car.brand,
    model: car.model,
    vehicleModelDate: String(car.year),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: car.km,
      unitCode: "KMT"
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: (car.priceCents / 100).toFixed(2),
      availability:
        car.status === "SOLD"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock"
    },
    image: car.images.map((image) => image.url),
    description: car.description
  };

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="section">
        <div className="container stack">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleSchema) }}
          />
          <div className="field-grid two" style={{ alignItems: "start" }}>
            <CarGallery car={car} />
            <div className="stack">
              <div className="admin-card">
                <div className="inline-actions" style={{ justifyContent: "space-between" }}>
                  <StatusBadge status={car.status} />
                  {car.isFeatured ? <span className="chip">Destaque</span> : null}
                </div>
                <h1 className="section-title" style={{ marginTop: 18, marginBottom: 8 }}>
                  {car.title}
                </h1>
                <p className="muted" style={{ marginTop: 0 }}>
                  {car.brand} {car.model}
                </p>
                <div className="price" style={{ fontSize: "2rem", marginTop: 10 }}>
                  {formatCurrency(car.priceCents)}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 12,
                    marginTop: 18
                  }}
                >
                  <div className="chip">Ano: {car.year}</div>
                  <div className="chip">KM: {formatKilometers(car.km)}</div>
                  <div className="chip">Combustivel: {car.fuel ?? "Nao informado"}</div>
                  <div className="chip">Cambio: {car.transmission ?? "Nao informado"}</div>
                </div>
                <p className="section-copy" style={{ marginTop: 22 }}>
                  {car.description}
                </p>
                <div className="inline-actions" style={{ marginTop: 24 }}>
                  <a href={car.whatsappLink ?? "https://wa.me/5551999866578"} className="button-primary">
                    Tenho interesse
                  </a>
                  <Link href="/estoque" className="button-secondary">
                    Voltar ao estoque
                  </Link>
                </div>
              </div>
              <div className="admin-card">
                <h2 style={{ marginTop: 0 }}>Modificacoes</h2>
                <div className="inline-actions">
                  {car.mods.map((mod) => (
                    <span key={mod} className="chip">
                      {mod}
                    </span>
                  ))}
                </div>
              </div>
              <div className="admin-card">
                <h2 style={{ marginTop: 0 }}>Opcionais</h2>
                <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9 }}>
                  {car.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
