import type { PublicSiteSettings } from "@/lib/types";

export const siteSettings: PublicSiteSettings = {
  id: "site_settings",
  heroTitle: "Acelerando rumo a sua melhor conquista sobre quatro rodas.",
  heroSubtitle:
    "NGF Racing: seminovos com procedência, produtos de qualidade e peças de alta performance.",
  heroBgImage: "/branding/hero-car.jpg",
  heroPrimaryCtaLabel: "Quero meu carro",
  heroPrimaryCtaHref: "/estoque",
  heroSecondaryCtaLabel: "Falar com a NGF",
  heroSecondaryCtaHref: "https://wa.me/5551999866578",
  aboutTitle: "Nossa história",
  aboutText:
    "Por mais de 10 anos, aceleramos forte nas pistas de arrancada pelo Rio Grande do Sul, conquistando vários troféus na jornada com o carro 658. A paixão por performance começou nas pistas e hoje a NGF Racing leva essa experiência para a venda de seminovos com procedência, produtos de qualidade e peças de alta performance. ",
  aboutImage: "/branding/carro-corrida-antigo.jpg",
  phoneWhatsapp: "5551999866578",
  phoneDisplay: "(51) 99986-6578",
  contactEmail: "ngfracing@hotmail.com",
  address: "R. Veríssimo Rosa, 452 - Partenon",
  instagramUrl: "https://instagram.com/ngfracing",
  businessHours: "Segunda a Sexta: 8h às 18h | Sábado: 9h às 15h"
};

export const siteCopy = {
  header: {
    navItems: [
      { href: "/", label: "Início" },
      { href: "/#sobre", label: "Sobre" },
      { href: "/estoque", label: "Estoque" },
      { href: "/pecas", label: "Peças" },
      { href: "/#contato", label: "Contato" }
    ],
    desktopCtaLabel: "Falar com a NGF",
    mobileCtaLabel: "Chamar no WhatsApp"
  },
  hero: {
    kicker: "NGF Racing"
  },
  about: {
    kicker: "Sobre",
    timeline: [
      { year: "2001", copy: "Primeiros passos nas pistas de arrancada." },
      { year: "2013", copy: "Ínicio das atividades da NGF vendendo seminovos de qualidade e procedência." },
      { year: "Hoje", copy: "Abertura oficial da loja NGF Racing." }
    ]
  },
  contact: {
    kicker: "Contato",
    title: "Sua próxima conquista começa aqui",
    copy:
      "Atendimento próximo, resposta rápida e orientação completa para você escolher com segurança. Fale com a NGF Racing e acelere para o carro certo.",
    primaryCtaLabel: "Chamar no WhatsApp",
    secondaryCtaLabel: "Falar com a NGF",
    cards: {
      whatsapp: {
        title: "WhatsApp",
        ctaLabel: "Chamar agora"
      },
      address: {
        title: "Endereço",
        ctaLabel: "Abrir no Maps"
      },
      instagram: {
        title: "Instagram",
        copy: "Conteúdo diário e novidades em tempo real.",
        ctaLabel: "Ver perfil"
      },
      hours: {
        title: "Horários",
        ctaLabel: "Enviar e-mail"
      }
    }
  },
  footer: {
    brand: "NGF Racing",
    primaryCtaLabel: "Chamar no WhatsApp",
    secondaryCtaLabel: "Instagram",
    copy: "Seleção premium de seminovos e projetos preparados com procedência, transparência e atendimento direto."
  }
};
