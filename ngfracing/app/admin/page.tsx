import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  await requireAdminSession();

  const [available, reserved, sold, totalParts] = await Promise.all([
    prisma.car.count({ where: { status: "AVAILABLE" } }),
    prisma.car.count({ where: { status: "RESERVED" } }),
    prisma.car.count({ where: { status: "SOLD" } }),
    prisma.partItem.count()
  ]);

  const stats = [
    { label: "Disponiveis", value: available, tone: "rgba(23,163,74,0.18)" },
    { label: "Reservados", value: reserved, tone: "rgba(246,201,14,0.18)" },
    { label: "Vendidos", value: sold, tone: "rgba(215,0,0,0.18)" },
    { label: "Pecas no catalogo", value: totalParts, tone: "rgba(255,255,255,0.08)" }
  ];

  return (
    <AdminShell>
      <div className="stack">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap"
        }}
      >
        <div>
          <span className="section-kicker">Dashboard</span>
          <h1 className="section-title" style={{ marginBottom: 8 }}>
            Painel de controle
          </h1>
          <p className="section-copy">Resumo rapido para colocar o MVP no ar sem editar codigo.</p>
        </div>
        <div className="inline-actions">
          <Link href="/admin/carros/new" className="button-primary">
            Adicionar carro
          </Link>
          <Link href="/admin/configuracoes" className="button-secondary">
            Editar conteudo
          </Link>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16
        }}
      >
        {stats.map((item) => (
          <div key={item.label} className="admin-card" style={{ background: item.tone }}>
            <div className="muted" style={{ fontSize: "0.85rem" }}>
              {item.label}
            </div>
            <div style={{ marginTop: 10, fontSize: "2rem", fontWeight: 800 }}>{item.value}</div>
          </div>
        ))}
      </div>
      </div>
    </AdminShell>
  );
}
