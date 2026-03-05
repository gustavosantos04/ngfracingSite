"use client";

import { useMemo, useState } from "react";
import type { PublicCar } from "@/lib/types";
import { CarCard } from "@/components/site/CarCard";

type SortKey = "featured" | "price-asc" | "price-desc" | "year-desc" | "km-asc";

export function InventoryFilters({ cars }: { cars: PublicCar[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState<SortKey>("featured");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const nextCars = cars.filter((car) => {
      const matchesQuery =
        !normalized ||
        [car.title, car.brand, car.model, ...car.tags]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      const matchesStatus = status === "ALL" || car.status === status;
      return matchesQuery && matchesStatus;
    });

    switch (sortBy) {
      case "price-asc":
        nextCars.sort((a, b) => a.priceCents - b.priceCents);
        break;
      case "price-desc":
        nextCars.sort((a, b) => b.priceCents - a.priceCents);
        break;
      case "year-desc":
        nextCars.sort((a, b) => b.year - a.year);
        break;
      case "km-asc":
        nextCars.sort((a, b) => a.km - b.km);
        break;
      default:
        nextCars.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
        break;
    }

    return nextCars;
  }, [cars, query, sortBy, status]);

  return (
    <div className="stack">
      <div className="admin-card">
        <div className="field-grid three">
          <div className="field">
            <label htmlFor="query">Buscar</label>
            <input
              id="query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Marca, modelo ou palavra-chave"
            />
          </div>
          <div className="field">
            <label htmlFor="status">Status</label>
            <select id="status" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="ALL">Todos</option>
              <option value="AVAILABLE">Disponível</option>
              <option value="RESERVED">Reservado</option>
              <option value="SOLD">Vendido</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="sortBy">Ordenar</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortKey)}
            >
              <option value="featured">Destaques</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="year-desc">Mais novo</option>
              <option value="km-asc">Menor km</option>
            </select>
          </div>
        </div>
      </div>

      <div className="muted">{filtered.length} veículo(s) encontrado(s)</div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 18
        }}
      >
        {filtered.length > 0 ? (
          filtered.map((car) => <CarCard key={car.id} car={car} />)
        ) : (
          <article className="surface-card" style={{ padding: 24 }}>
            <h3 style={{ marginTop: 0 }}>Nenhum carro encontrado</h3>
            <p className="section-copy" style={{ marginBottom: 0 }}>
              Ajuste os filtros ou chame a NGF Racing no WhatsApp para encontrar uma opção sob medida.
            </p>
          </article>
        )}
      </div>
    </div>
  );
}
