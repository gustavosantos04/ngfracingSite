import type { Metadata } from "next";
import { Montserrat, Orbitron } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-body",
  subsets: ["latin"]
});

const orbitron = Orbitron({
  variable: "--font-display",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"),
  title: {
    default: "NGF Racing | Seminovos, Projetos e Pecas de Alta Performance",
    template: "%s | NGF Racing"
  },
  description:
    "NGF Racing: loja de carros seminovos, projetos diferenciados e pecas FuelTech de alta performance.",
  openGraph: {
    title: "NGF Racing",
    description:
      "Seminovos, carros diferenciados e pecas de alta performance com procedencia.",
    url: "/",
    siteName: "NGF Racing",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/branding/hero-car.jpg",
        width: 1600,
        height: 900,
        alt: "Hero NGF Racing"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "NGF Racing",
    description: "Seminovos, projetos diferenciados e pecas de alta performance.",
    images: ["/branding/hero-car.jpg"]
  },
  icons: {
    icon: "/branding/logoredondoNGF.ico"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${montserrat.variable} ${orbitron.variable}`}>{children}</body>
    </html>
  );
}
