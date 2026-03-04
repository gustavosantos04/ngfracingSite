import Link from "next/link";
import { deleteCarAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatKilometers } from "@/lib/utils";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminCarsPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdminSession();

  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const perPage = 8;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const status = typeof params.status === "string" ? params.status : "";
  const brand = typeof params.brand === "string" ? params.brand.trim() : "";
  const year = Number(params.year ?? 0) || undefined;
  const priceMax = Number(params.priceMax ?? 0) || undefined;
  const where = {
    ...(query
      ? {
          OR: [
            { title: { contains: query } },
            { brand: { contains: query } },
            { model: { contains: query } }
          ]
        }
      : {}),
    ...(status ? { status: status as "AVAILABLE" | "RESERVED" | "SOLD" } : {}),
    ...(brand ? { brand: { contains: brand } } : {}),
    ...(year ? { year } : {}),
    ...(priceMax ? { priceCents: { lte: priceMax * 100 } } : {})
  };

  const [cars, total] = await Promise.all([
    prisma.car.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { updatedAt: "desc" }],
      skip: (page - 1) * perPage,
      take: perPage
    }),
    prisma.car.count({ where })
  ]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <AdminShell>
      <div className="stack">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          alignItems: "center"
        }}
      >
        <div>
          <span className="section-kicker">Admin</span>
          <h1 className="section-title" style={{ marginBottom: 8 }}>
            Gerenciar carros
          </h1>
          <p className="section-copy">Busca, filtros e paginacao para manter o estoque sem editar codigo.</p>
        </div>
        <Link href="/admin/carros/new" className="button-primary">
          Adicionar carro
        </Link>
      </div>

      <form method="get" className="admin-card">
        <div className="field-grid three">
          <div className="field">
            <label htmlFor="q">Busca</label>
            <input id="q" name="q" defaultValue={query} placeholder="Titulo, marca, modelo" />
          </div>
          <div className="field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={status}>
              <option value="">Todos</option>
              <option value="AVAILABLE">Disponivel</option>
              <option value="RESERVED">Reservado</option>
              <option value="SOLD">Vendido</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="brand">Marca</label>
            <input id="brand" name="brand" defaultValue={brand} />
          </div>
        </div>
        <div className="field-grid two" style={{ marginTop: 16 }}>
          <div className="field">
            <label htmlFor="year">Ano</label>
            <input id="year" name="year" type="number" defaultValue={year ?? ""} />
          </div>
          <div className="field">
            <label htmlFor="priceMax">Preco maximo (BRL)</label>
            <input id="priceMax" name="priceMax" type="number" defaultValue={priceMax ?? ""} />
          </div>
        </div>
        <div className="inline-actions" style={{ marginTop: 16 }}>
          <button type="submit" className="button-primary">
            Filtrar
          </button>
          <Link href="/admin/carros" className="button-secondary">
            Limpar
          </Link>
        </div>
      </form>

      <div className="surface-card table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Carro</th>
              <th>Status</th>
              <th>Ano</th>
              <th>KM</th>
              <th>Preco</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id}>
                <td>
                  <strong>{car.title}</strong>
                  <div className="muted">
                    {car.brand} {car.model}
                  </div>
                </td>
                <td>
                  <StatusBadge status={car.status} />
                </td>
                <td>{car.year}</td>
                <td>{formatKilometers(car.km)}</td>
                <td className="price">{formatCurrency(car.priceCents)}</td>
                <td>
                  <div className="inline-actions">
                    <Link href={`/admin/carros/${car.id}`} className="button-ghost">
                      Editar
                    </Link>
                    <form action={deleteCarAction}>
                      <input type="hidden" name="carId" value={car.id} />
                      <button type="submit" className="button-danger">
                        Excluir
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {!cars.length ? (
              <tr>
                <td colSpan={6} className="muted">
                  Nenhum carro encontrado com os filtros atuais.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="inline-actions" style={{ justifyContent: "space-between" }}>
        <div className="muted">
          Pagina {page} de {totalPages}
        </div>
        <div className="inline-actions">
          {page > 1 ? (
            <Link href={`/admin/carros?page=${page - 1}`} className="button-secondary">
              Anterior
            </Link>
          ) : null}
          {page < totalPages ? (
            <Link href={`/admin/carros?page=${page + 1}`} className="button-secondary">
              Proxima
            </Link>
          ) : null}
        </div>
      </div>
      </div>
    </AdminShell>
  );
}
