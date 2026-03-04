const cars = [
  {
    id: 1,
    brand: "VW",
    model: "Voyage G6",
    year: 2009,
    km: 84969,
    fuel: "Flex",
    transmission: "Manual",
    price: "R$ 49.900,00",
    images: [
      "/cars/voyage_cinza_2.jpg",
      "/cars/voyage_cinza.jpg",
      "/cars/voyage_cinza_1.jpg",
      "/cars/voyage_cinza_4.jpg",
      "/cars/voyage_cinza_5.jpg"
    ],
    specs: {
      versão: "Highline",
      motor: "1.6 8V",
      consumo: "13 km/l",
    },
    options: [
      "Alarme",
      "Ar Condicionado",
      "Ar Quente",
      "Desembaçador Traseiro",
      "Direção Hidráulica",
      "Retrovisor Elétrico",
      "Rodas de Liga Leve",
      "Trava Elétrica",
      "Vidros Elétricos"
    ]
  },
  {
    id: 2,
    brand: "Fiat",
    model: "Palio",
    year: 2010,
    km: 108611,
    fuel: "Flex",
    transmission: "Manual",
    price: "R$ 29.900,00",
    images: [
      "/cars/palio.jpg",
      "/cars/palio_1.jpg",
      "/cars/palio_2.jpg",
      "/cars/palio_3.jpg",
      "/cars/palio_4.jpg",
      "/cars/palio_5.jpg"
    ],
    specs: {
      versão: "Fire Economy",
      motor: "1.0 8V",
      consumo: "10 km/l",
    },
    options: [
      "Alarme",
      "Ar Quente",
      "Desembaçador Traseiro",
      "Direção Hidráulica",
      "Limpador Traseiro",
      "Trava Elétrica",
      "Vidros Elétricos",
      "Segundo Dono"
    ]
  },
  {
    id: 3,
    brand: "Fiat",
    model: "Prisma",
    year: 2010,
    km: 107511,
    fuel: "Flex",
    transmission: "Manual",
    price: "R$ 35.900,00",
    images: [
      "/cars/1.jpg",
      "/cars/2.jpg",
      "/cars/3.jpg",
      "/cars/4.jpg",
      "/cars/5.jpg",
    ],
    specs: {
      versão: "MAXX FlexpowerR",
      motor: "1.0 VHC-E 8V",
      consumo: "12 km/l",
    },
    options: [
      "Alarme",
      "Ar Condicionado",
      "Desembaçador Traseiro",
      "Direção Hidráulica",
      "Trava Elétrica",
      "Vidros Elétricos",
      "Segundo Dono",
      "Logo e Etiquetas (GM)"
    ]
  },
  {
    id: 4,
    brand: "VW",
    model: "FOX G2",
    year: 2012,
    km: 93678,
    fuel: "Flex",
    transmission: "Manual",
    price: "R$ 35.900,00",
    images: [
      "/cars/fox2.jpg",
      "/cars/fox1.jpg",
      "/cars/fox3.jpg",
      "/cars/fox4.jpg",
      "/cars/fox5.jpg"
    ],
    specs: {
      versão: "Trend",
      motor: "1.0 8V",
      consumo: "10 km/l",
    },
    options: [
      "Raridade",
      "IPVA2 025 Pago",
      "Alarme",
      "Ar Quente",
      "Logo e Etiquetas(VW) de Fábrica",
      "Segundo dono",
      "ABS",
      "Desembaçador Traseiro",
      "Computador de Bordo",
    ]
  }
];

export default cars;
