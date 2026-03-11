export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function parseJsonList(value: string): string[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.map((item) => String(item).trim()).filter(Boolean)
      : [];
  } catch {
    return [];
  }
}

export function parseJsonObjectList<T>(value: string, isValidItem: (item: unknown) => item is T): T[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(isValidItem) : [];
  } catch {
    return [];
  }
}

export function formatCurrency(valueInCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(valueInCents / 100);
}

export function formatKilometers(value: number) {
  return `${new Intl.NumberFormat("pt-BR").format(value)} km`;
}

export function normalizePhoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function productCategoryLabel(category: "PART" | "APPAREL" | "ACCESSORY") {
  switch (category) {
    case "PART":
      return "Peça";
    case "APPAREL":
      return "Roupa";
    case "ACCESSORY":
      return "Acessório";
    default:
      return category;
  }
}

export function orderStatusLabel(status: "NEW" | "CONTACTED" | "CLOSED" | "CANCELED") {
  switch (status) {
    case "NEW":
      return "Novo";
    case "CONTACTED":
      return "Contatado";
    case "CLOSED":
      return "Fechado";
    case "CANCELED":
      return "Cancelado";
    default:
      return status;
  }
}

export function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo"
  }).format(value);
}
