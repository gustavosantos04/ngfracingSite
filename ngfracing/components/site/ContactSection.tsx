import { getSiteSettings } from "@/lib/data";

export async function ContactSection() {
  const settings = await getSiteSettings();

  return (
    <section className="section" id="contato">
      <div className="container">
        <div
          className="surface-card"
          style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 0 }}
        >
          <div style={{ padding: 32 }}>
            <span className="section-kicker">Contato</span>
            <h2 className="section-title">Fale com a NGF Racing</h2>
            <p className="section-copy">
              Atendimento rapido para compra, avaliacao, preparacao e pecas FuelTech. O CTA principal continua sendo o WhatsApp, agora administravel pelo CMS.
            </p>
            <div
              style={{
                display: "grid",
                gap: 12,
                marginTop: 26,
                color: "rgba(255,255,255,0.84)"
              }}
            >
              <div>
                <strong>WhatsApp:</strong> {settings.phoneDisplay}
              </div>
              <div>
                <strong>E-mail:</strong> {settings.contactEmail}
              </div>
              <div>
                <strong>Endereco:</strong> {settings.address}
              </div>
              <div>
                <strong>Horario:</strong> {settings.businessHours}
              </div>
            </div>
            <div className="inline-actions" style={{ marginTop: 24 }}>
              <a href={`https://wa.me/${settings.phoneWhatsapp}`} className="button-primary">
                Chamar no WhatsApp
              </a>
              <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="button-secondary">
                Instagram
              </a>
            </div>
          </div>
          <div
            style={{
              padding: 32,
              background:
                "linear-gradient(180deg, rgba(215, 0, 0, 0.16), rgba(246, 201, 14, 0.08))"
            }}
          >
            <div className="stack">
              <div className="admin-card">
                <strong style={{ display: "block", marginBottom: 8 }}>Veiculos com procedencia</strong>
                <span className="muted">Curadoria baseada em historico, procedencia e perfil do cliente.</span>
              </div>
              <div className="admin-card">
                <strong style={{ display: "block", marginBottom: 8 }}>Projetos e performance</strong>
                <span className="muted">Carros antigos modificados, setups especiais e atendimento de nicho.</span>
              </div>
              <div className="admin-card">
                <strong style={{ display: "block", marginBottom: 8 }}>FuelTech</strong>
                <span className="muted">Catalogo informativo de pecas de alta performance gerenciavel no painel.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
