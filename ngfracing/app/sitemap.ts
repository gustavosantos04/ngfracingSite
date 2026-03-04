import type { MetadataRoute } from "next";
import { getAllCars } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const cars = await getAllCars();

  return ["", "/estoque", "/pecas", ...cars.map((car) => `/estoque/${car.slug}`)].map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: "daily",
    priority: path === "" ? 1 : 0.8
  }));
}
