import bcrypt from "bcryptjs";
import { PrismaClient, CarStatus } from "@prisma/client";

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
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@ngfracing.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
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
    update: {},
    create: {
      id: "site_settings",
      heroTitle: "Acelerando rumo a sua melhor conquista sobre quatro rodas.",
      heroSubtitle: "NGF Racing: seminovos, projetos diferenciados e pecas de alta performance com procedencia.",
      heroBgImage: "/branding/hero-car.jpg",
      heroPrimaryCtaLabel: "Ver estoque",
      heroPrimaryCtaHref: "/estoque",
      heroSecondaryCtaLabel: "Chamar no WhatsApp",
      heroSecondaryCtaHref: "https://wa.me/5551999866578",
      aboutTitle: "Nossa historia",
      aboutText:
        "Por mais de 10 anos, a NGF Racing acelerou nas pistas de arrancada e transformou essa experiencia em curadoria de carros diferenciados, seminovos confiaveis e pecas FuelTech para quem leva performance a serio.",
      aboutImage: "/branding/carro-corrida-antigo.jpg",
      phoneWhatsapp: "5551999866578",
      phoneDisplay: "(51) 99986-6578",
      contactEmail: "ngfracing@hotmail.com",
      address: "Porto Alegre, RS",
      instagramUrl: "https://instagram.com/ngfracing",
      businessHours: "Segunda a Sexta: 8h as 18h | Sabado: 9h as 15h"
    }
  });

  const categories = [
    { name: "ECU", slug: "ecu" },
    { name: "Wideband", slug: "wideband" },
    { name: "Chicotes e Acessorios", slug: "chicotes-e-acessorios" }
  ];

  for (const category of categories) {
    await prisma.partCategory.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category
    });
  }

  const allCategories = await prisma.partCategory.findMany();
  const categoryBySlug = Object.fromEntries(allCategories.map((item) => [item.slug, item.id]));

  const partItems = [
    {
      categorySlug: "ecu",
      name: "FuelTech FT550",
      description: "Modulo de injecao programavel para projetos street e pista.",
      imageUrl: "/cars/audi-rs3-1.jpeg",
      isFeatured: true
    },
    {
      categorySlug: "wideband",
      name: "Wideband Nano",
      description: "Leitura precisa de mistura para ajuste fino e monitoramento.",
      imageUrl: "/cars/bmw-m3-1.jpg",
      isFeatured: true
    },
    {
      categorySlug: "chicotes-e-acessorios",
      name: "Chicote Plug and Play",
      description: "Chicotes, sensores e acessorios para instalacao rapida e limpa.",
      imageUrl: "/cars/supra-1.jpg",
      isFeatured: false
    }
  ];

  for (const item of partItems) {
    await prisma.partItem.upsert({
      where: { slug: slugify(item.name) },
      update: {
        description: item.description,
        imageUrl: item.imageUrl,
        isFeatured: item.isFeatured,
        categoryId: categoryBySlug[item.categorySlug]
      },
      create: {
        categoryId: categoryBySlug[item.categorySlug],
        name: item.name,
        slug: slugify(item.name),
        description: item.description,
        imageUrl: item.imageUrl,
        isFeatured: item.isFeatured
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
      images: [
        "/cars/palio.jpg",
        "/cars/palio_1.jpg",
        "/cars/palio_2.jpg",
        "/cars/palio_3.jpg",
        "/cars/palio_4.jpg",
        "/cars/palio_5.jpg"
      ]
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
      images: [
        "/cars/fox1.jpg",
        "/cars/fox2.jpg",
        "/cars/fox3.jpg",
        "/cars/fox4.jpg",
        "/cars/fox5.jpg"
      ]
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
