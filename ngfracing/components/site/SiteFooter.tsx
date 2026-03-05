import { getSiteSettings } from "@/lib/data";

export async function SiteFooter() {
  const settings = await getSiteSettings();
  const fixedAddress = "R. Ver\u00edssimo Rosa, 452 - Partenon";

  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <div className="site-footer-main">
          <div>
            <div className="site-footer-brand">NGF Racing</div>
            <div className="muted">{fixedAddress}</div>
          </div>
          <div className="inline-actions">
            <a href={`https://wa.me/${settings.phoneWhatsapp}`} className="button-secondary">
              Chamar no WhatsApp
            </a>
            <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="button-ghost">
              Instagram
            </a>
          </div>
        </div>
        <div className="muted site-footer-copy">
          Seleção premium de seminovos e projetos preparados com procedência, transparência e atendimento direto.
        </div>
      </div>
    </footer>
  );
}