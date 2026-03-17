import Image from "next/image";
import Link from "next/link";
import type { PublicCar } from "@/lib/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { sharedImageBlurDataUrl } from "@/lib/images";
import { formatCurrency, formatKilometers } from "@/lib/utils";

export function CarCard({ car }: { car: PublicCar }) {
  const heroImage = car.images[0];

  return (
    <article
      className="surface-card"
      style={{ display: "grid", gridTemplateRows: "220px auto", overflow: "hidden" }}
    >
      <div style={{ position: "relative" }}>
        {heroImage ? (
          <Image
            src={heroImage.url}
            alt={heroImage.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 380px"
            placeholder="blur"
            blurDataURL={sharedImageBlurDataUrl}
            style={{ objectFit: "cover" }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.18) 50%, rgba(0,0,0,0.8))"
          }}
        />
        <div style={{ position: "absolute", right: 12, top: 12 }}>
          <StatusBadge status={car.status} />
        </div>
      </div>
      <div style={{ padding: 18, display: "grid", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.2rem", fontFamily: "var(--font-display)" }}>
              {car.title}
            </h3>
            <div className="muted" style={{ marginTop: 6 }}>
              {car.brand} {car.model}
            </div>
          </div>
          <div className="price">{formatCurrency(car.priceCents)}</div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(94px, 1fr))",
            gap: 8,
            fontSize: "0.9rem"
          }}
        >
          <div className="chip">{car.year}</div>
          <div className="chip">{formatKilometers(car.km)}</div>
          <div className="chip">{car.transmission ?? "Manual"}</div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {car.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                display: "inline-flex",
                padding: "6px 10px",
                borderRadius: 999,
                background: "rgba(246, 201, 14, 0.12)",
                color: "#ffe58d",
                fontSize: "0.8rem",
                fontWeight: 700
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {car.features.length > 0 ? (
          <div className="car-card-feature-list">
            {car.features.slice(0, 3).map((feature) => (
              <span key={feature} className="car-card-feature">
                {feature}
              </span>
            ))}
          </div>
        ) : null}

        <div className="inline-actions">
          <Link href={`/estoque/${car.slug}`} className="button-primary">
            Ver detalhes
          </Link>
          <a href={car.whatsappLink ?? "https://wa.me/5551999866578"} className="button-secondary">
            Quero meu carro
          </a>
        </div>
      </div>
    </article>
  );
}
