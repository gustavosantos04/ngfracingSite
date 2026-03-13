import { getSiteSettings } from "@/lib/data";
import { ContactTechBackground } from "@/components/site/ContactTechBackground";
import { siteCopy } from "@/lib/siteContent";

export async function ContactSection() {
  const settings = await getSiteSettings();
  const mapsQuery = encodeURIComponent(settings.address);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <section className="section" id="contato">
      <div className="container">
        <div className="surface-card contact-shell">
          <ContactTechBackground />

          <div className="contact-content contact-foreground">
            <span className="section-kicker">{siteCopy.contact.kicker}</span>
            <h2 className="section-title">{siteCopy.contact.title}</h2>
            <p className="section-copy">{siteCopy.contact.copy}</p>
            <div className="inline-actions contact-cta-group">
              <a href={`https://wa.me/${settings.phoneWhatsapp}`} className="button-primary">
                {siteCopy.contact.primaryCtaLabel}
              </a>
              <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="button-secondary">
                {siteCopy.contact.secondaryCtaLabel}
              </a>
            </div>
          </div>

          <div className="contact-cards contact-foreground">
            <article className="fueltech-card">
              <div className="fueltech-card-head">
                <span className="fueltech-icon">WA</span>
                <strong>{siteCopy.contact.cards.whatsapp.title}</strong>
              </div>
              <p>{settings.phoneDisplay}</p>
              <a href={`https://wa.me/${settings.phoneWhatsapp}`} className="button-primary">
                {siteCopy.contact.cards.whatsapp.ctaLabel}
              </a>
            </article>

            <article className="fueltech-card">
              <div className="fueltech-card-head">
                <span className="fueltech-icon">MAP</span>
                <strong>{siteCopy.contact.cards.address.title}</strong>
              </div>
              <div className="contact-address-block">
                <p>{settings.addressLine}</p>
                <p>{settings.addressRegion}</p>
                <p>{settings.addressCountry}</p>
              </div>
              <a href={mapsUrl} target="_blank" rel="noreferrer" className="button-secondary">
                {siteCopy.contact.cards.address.ctaLabel}
              </a>
            </article>

            <article className="fueltech-card">
              <div className="fueltech-card-head">
                <span className="fueltech-icon">IG</span>
                <strong>{siteCopy.contact.cards.instagram.title}</strong>
              </div>
              <p>{siteCopy.contact.cards.instagram.copy}</p>
              <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="button-secondary">
                {siteCopy.contact.cards.instagram.ctaLabel}
              </a>
            </article>

            <article className="fueltech-card">
              <div className="fueltech-card-head">
                <span className="fueltech-icon">HRS</span>
                <strong>{siteCopy.contact.cards.hours.title}</strong>
              </div>
              <p>{settings.businessHours}</p>
              <a href={`mailto:${settings.contactEmail}`} className="button-ghost">
                {siteCopy.contact.cards.hours.ctaLabel}
              </a>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
