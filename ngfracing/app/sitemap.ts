import type { MetadataRoute } from "next";
import { getAllCars } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const baseRoutes = ["", "/estoque", "/pecas"];

  try {
    const cars = await getAllCars();
    const carRoutes = cars.map((car) => `/estoque/${car.slug}`);

    return [...baseRoutes, ...carRoutes].map((path) => ({
      url: `${baseUrl}${path}`,
      changeFrequency: "daily",
      priority: path === "" ? 1 : 0.8
    }));
  } catch (error) {
    console.error("[sitemap] fallback", error);
    return baseRoutes.map((path) => ({
      url: `${baseUrl}${path}`,
      changeFrequency: "daily",
      priority: path === "" ? 1 : 0.8
    }));
  }
}
