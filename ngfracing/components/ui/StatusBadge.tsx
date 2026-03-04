import type { CarStatus } from "@prisma/client";

const labels: Record<CarStatus, string> = {
  AVAILABLE: "Disponivel",
  RESERVED: "Reservado",
  SOLD: "Vendido"
};

export function StatusBadge({ status }: { status: CarStatus }) {
  return <span className={`status-badge ${status.toLowerCase()}`}>{labels[status]}</span>;
}
