import Image from "next/image";
import Link from "next/link";
import { getSiteSettings } from "@/lib/data";

export async function SiteHeader() {
  const settings = await getSiteSettings();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(14px)",
        background: "rgba(8, 8, 8, 0.88)",
        borderBottom: "1px solid rgba(255,255,255,0.08)"
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 78,
          gap: 16
        }}
      >
        <Link href="/" aria-label="Voltar para a pagina inicial da NGF Racing">
          <Image
            src="/branding/logoNGFRACING.png"
            alt="NGF Racing"
            width={180}
            height={58}
            priority
          />
        </Link>
        <nav
          aria-label="Navegacao principal"
          style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}
        >
          <Link href="/">Inicio</Link>
          <Link href="/#sobre">Sobre</Link>
          <Link href="/estoque">Estoque</Link>
          <Link href="/pecas">Pecas</Link>
          <a href={`https://wa.me/${settings.phoneWhatsapp}`} className="button-primary">
            WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
