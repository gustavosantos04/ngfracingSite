import bcrypt from "bcryptjs";
import { CarStatus, PrismaClient, ProductCategory } from "@prisma/client";
import { siteSettings } from "../lib/siteContent";

const prisma = new PrismaClient();

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function main() {
  const adminEmail = process.env.ADMIN_USER?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("Missing ADMIN_USER or ADMIN_PASSWORD in environment");
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash
    }
  });

  await prisma.siteSettings.upsert({
    where: { id: "site_settings" },
    update: {
      heroTitle: siteSettings.heroTitle,
      heroSubtitle: siteSettings.heroSubtitle,
      heroBgImage: siteSettings.heroBgImage,
      heroPrimaryCtaLabel: siteSettings.heroPrimaryCtaLabel,
      heroPrimaryCtaHref: siteSettings.heroPrimaryCtaHref,
      heroSecondaryCtaLabel: siteSettings.heroSecondaryCtaLabel,
      heroSecondaryCtaHref: siteSettings.heroSecondaryCtaHref,
      aboutTitle: siteSettings.aboutTitle,
      aboutText: siteSettings.aboutText,
      aboutImage: siteSettings.aboutImage,
      phoneWhatsapp: siteSettings.phoneWhatsapp,
      phoneDisplay: siteSettings.phoneDisplay,
      contactEmail: siteSettings.contactEmail,
      address: siteSettings.address,
      instagramUrl: siteSettings.instagramUrl,
      businessHours: siteSettings.businessHours
    },
    create: {
      id: siteSettings.id,
      heroTitle: siteSettings.heroTitle,
      heroSubtitle: siteSettings.heroSubtitle,
      heroBgImage: siteSettings.heroBgImage,
      heroPrimaryCtaLabel: siteSettings.heroPrimaryCtaLabel,
      heroPrimaryCtaHref: siteSettings.heroPrimaryCtaHref,
      heroSecondaryCtaLabel: siteSettings.heroSecondaryCtaLabel,
      heroSecondaryCtaHref: siteSettings.heroSecondaryCtaHref,
      aboutTitle: siteSettings.aboutTitle,
      aboutText: siteSettings.aboutText,
      aboutImage: siteSettings.aboutImage,
      phoneWhatsapp: siteSettings.phoneWhatsapp,
      phoneDisplay: siteSettings.phoneDisplay,
      contactEmail: siteSettings.contactEmail,
      address: siteSettings.address,
      instagramUrl: siteSettings.instagramUrl,
      businessHours: siteSettings.businessHours
    }
  });

  const products = [
    {
      name: "FuelTech FT550",
      category: ProductCategory.PART,
      description: "Modulo de injecao programavel para projetos street e pista com resposta rapida e excelente controle.",
      priceCents: 689000,
      primaryImageUrl: "/cars/audi-rs3-1.jpeg",
      galleryJson: JSON.stringify(["/cars/audi-rs3-1.jpeg", "/cars/bmw-m3-1.jpg"]),
      stockQuantity: 4,
      sizeStockJson: JSON.stringify([]),
      isFeatured: true
    },
    {
      name: "Camiseta NGF Racing Track",
      category: ProductCategory.APPAREL,
      description: "Camiseta premium em algodao com estampa frontal e modelagem confortavel para o dia a dia.",
      priceCents: 12990,
      primaryImageUrl: "/cars/supra-1.jpg",
      galleryJson: JSON.stringify(["/cars/supra-1.jpg", "/cars/voyage_cinza.jpg"]),
      stockQuantity: null,
      sizeStockJson: JSON.stringify([
        { size: "P", stock: 3 },
        { size: "M", stock: 5 },
        { size: "G", stock: 4 },
        { size: "GG", stock: 2 }
      ]),
      isFeatured: true
    },
    {
      name: "Bone NGF Racing Garage",
      category: ProductCategory.ACCESSORY,
      description: "Bone estruturado com aba curva, ajuste traseiro e identidade visual da NGF Racing.",
      priceCents: 8990,
      primaryImageUrl: "/cars/voyage_cinza_1.jpg",
      galleryJson: JSON.stringify(["/cars/voyage_cinza_1.jpg"]),
      stockQuantity: 7,
      sizeStockJson: JSON.stringify([]),
      isFeatured: false
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: slugify(product.name) },
      update: product,
      create: {
        ...product,
        slug: slugify(product.name)
      }
    });
  }

  const cars = [
    {
      title: "VW Voyage G6 Highline",
      brand: "VW",
      model: "Voyage G6",
      year: 2009,
      km: 84969,
      priceCents: 4990000,
      fuel: "Flex",
      transmission: "Manual",
      status: CarStatus.AVAILABLE,
      isFeatured: true,
      tags: ["Seminovo", "Procedencia", "Revisado"],
      mods: ["Multimidia", "Rodas de liga leve", "Alarme"],
      features: ["Ar condicionado", "Direcao hidraulica", "Vidros eletricos"],
      description:
        "Sedan revisado, com historico consistente e excelente acabamento. Ideal para quem busca uso diario com confiabilidade.",
      images: [
        "/cars/voyage_cinza.jpg",
        "/cars/voyage_cinza_1.jpg",
        "/cars/voyage_cinza_2.jpg",
        "/cars/voyage_cinza_4.jpg",
        "/cars/voyage_cinza_5.jpg"
      ]
    },
    {
      title: "Fiat Palio Fire Economy",
      brand: "Fiat",
      model: "Palio",
      year: 2010,
      km: 108611,
      priceCents: 2990000,
      fuel: "Flex",
      transmission: "Manual",
      status: CarStatus.AVAILABLE,
      isFeatured: false,
      tags: ["Entrada", "Economico", "Segundo dono"],
      mods: ["Som atualizado", "Peliculas", "Tapetes premium"],
      features: ["Ar quente", "Trava eletrica", "Vidros eletricos"],
      description:
        "Hatch economico e pronto para uso. Bom custo-beneficio para primeira compra ou carro de apoio.",
      images: ["/cars/palio.jpg", "/cars/palio_1.jpg", "/cars/palio_2.jpg", "/cars/palio_3.jpg", "/cars/palio_4.jpg", "/cars/palio_5.jpg"]
    },
    {
      title: "VW Fox G2 Trend",
      brand: "VW",
      model: "Fox G2",
      year: 2012,
      km: 93678,
      priceCents: 3590000,
      fuel: "Flex",
      transmission: "Manual",
      status: CarStatus.RESERVED,
      isFeatured: false,
      tags: ["Raridade", "Original", "Colecionavel"],
      mods: ["Acabamento original", "Pneus novos"],
      features: ["ABS", "Computador de bordo", "Desembacador traseiro"],
      description:
        "Exemplar diferenciado, preservado e com configuracao rara. Excelente para clientes que valorizam originalidade.",
      images: ["/cars/fox1.jpg", "/cars/fox2.jpg", "/cars/fox3.jpg", "/cars/fox4.jpg", "/cars/fox5.jpg"]
    }
  ];

  for (const car of cars) {
    const slug = slugify(`${car.brand}-${car.model}-${car.year}`);
    await prisma.car.upsert({
      where: { slug },
      update: {
        title: car.title,
        brand: car.brand,
        model: car.model,
        year: car.year,
        km: car.km,
        priceCents: car.priceCents,
        fuel: car.fuel,
        transmission: car.transmission,
        status: car.status,
        isFeatured: car.isFeatured,
        description: car.description,
        modsJson: JSON.stringify(car.mods),
        featuresJson: JSON.stringify(car.features),
        tagsJson: JSON.stringify(car.tags),
        whatsappLink: "https://wa.me/5551999866578"
      },
      create: {
        slug,
        title: car.title,
        brand: car.brand,
        model: car.model,
        year: car.year,
        km: car.km,
        priceCents: car.priceCents,
        fuel: car.fuel,
        transmission: car.transmission,
        status: car.status,
        isFeatured: car.isFeatured,
        description: car.description,
        modsJson: JSON.stringify(car.mods),
        featuresJson: JSON.stringify(car.features),
        tagsJson: JSON.stringify(car.tags),
        whatsappLink: "https://wa.me/5551999866578"
      }
    });

    const persisted = await prisma.car.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (!persisted) {
      continue;
    }

    await prisma.carImage.deleteMany({ where: { carId: persisted.id } });
    await prisma.carImage.createMany({
      data: car.images.map((url, index) => ({
        carId: persisted.id,
        url,
        alt: `${car.title} - foto ${index + 1}`,
        sortOrder: index
      }))
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
