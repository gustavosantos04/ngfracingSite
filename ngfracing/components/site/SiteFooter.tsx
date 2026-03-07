import { getSiteSettings } from "@/lib/data";
import { siteCopy } from "@/lib/siteContent";

export async function SiteFooter() {
  const settings = await getSiteSettings();

  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <div className="site-footer-main">
          <div>
            <div className="site-footer-brand">{siteCopy.footer.brand}</div>
            <div className="muted">{settings.address}</div>
          </div>
          <div className="inline-actions">
            <a href={`https://wa.me/${settings.phoneWhatsapp}`} className="button-secondary">
              {siteCopy.footer.primaryCtaLabel}
            </a>
            <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="button-ghost">
              {siteCopy.footer.secondaryCtaLabel}
            </a>
          </div>
        </div>
        <div className="muted site-footer-copy">{siteCopy.footer.copy}</div>
      </div>
    </footer>
  );
}
