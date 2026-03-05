import { getSiteSettings } from "@/lib/data";

export async function ContactSection() {
  const settings = await getSiteSettings();
  const fixedAddress = "R. Ver\u00edssimo Rosa, 452 - Partenon";
  const mapsQuery = encodeURIComponent("R. Ver\u00edssimo Rosa, 452 - Partenon");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <section className="section" id="contato">
      <div className="container">
        <div className="surface-card contact-shell">
          <div className="contact-content">
            <span className="section-kicker">Contato</span>
            <h2 className="section-title">Sua próxima conquista começa aqui</h2>
            <p className="section-copy">
              Atendimento próximo, resposta rápida e orientação completa para você escolher com segurança. Fale com a NGF Racing e acelere para o carro certo.
            </p>
            <div className="inline-actions contact-cta-group">
              <a href={`https://wa.me/${settings.phoneWhatsapp}`} className="button-primary">
                Chamar no WhatsApp
              </a>
              <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="button-secondary">
                Falar com a NGF
              </a>
            </div>
          </div>

          <div className="contact-cards">
            <article className="fueltech-card">
              <div className="fueltech-card-head">
                <span className="fueltech-icon">WA</span>
                <strong>WhatsApp</strong>
              </div>
              <p>{settings.phoneDisplay}</p>
              <a href={`https://wa.me/${settings.phoneWhatsapp}`} className="button-primary">
                Chamar agora
              </a>
            </article>

            <article className="fueltech-card">
              <div className="fueltech-card-head">
                <span className="fueltech-icon">MAP</span>
                <strong>Endereço</strong>
              </div>
              <p>{fixedAddress}</p>
              <a href={mapsUrl} target="_blank" rel="noreferrer" className="button-secondary">
                Abrir no Maps
              </a>
            </article>

            <article className="fueltech-card">
              <div className="fueltech-card-head">
                <span className="fueltech-icon">IG</span>
                <strong>Instagram</strong>
              </div>
              <p>Conteúdo diário e novidades em tempo real.</p>
              <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="button-secondary">
                Ver perfil
              </a>
            </article>

            <article className="fueltech-card">
              <div className="fueltech-card-head">
                <span className="fueltech-icon">HRS</span>
                <strong>Horários</strong>
              </div>
              <p>{settings.businessHours}</p>
              <a href={`mailto:${settings.contactEmail}`} className="button-ghost">
                Enviar e-mail
              </a>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}