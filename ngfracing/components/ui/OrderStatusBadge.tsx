import type { OrderStatus } from "@prisma/client";
import { orderStatusLabel } from "@/lib/utils";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`status-badge ${status.toLowerCase()}`}>{orderStatusLabel(status)}</span>;
}
