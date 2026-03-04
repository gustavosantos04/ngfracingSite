import { saveSettingsAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminSession } from "@/lib/auth";
import { getSiteSettings } from "@/lib/data";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminSettingsPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdminSession();

  const settings = await getSiteSettings();
  const params = await searchParams;
  const saved = params.saved === "1";

  return (
    <AdminShell>
      <div className="stack">
      <div>
        <span className="section-kicker">Conteudo</span>
        <h1 className="section-title" style={{ marginBottom: 8 }}>
          Hero, sobre e contato
        </h1>
        <p className="section-copy">
          Editor simples para o conteudo institucional da home sem tocar no codigo.
        </p>
      </div>

      {saved ? <div className="admin-card">Configuracoes atualizadas com sucesso.</div> : null}

      <form action={saveSettingsAction} className="stack">
        <div className="admin-card stack">
          <h2 style={{ margin: 0 }}>Hero</h2>
          <div className="field">
            <label htmlFor="heroTitle">Titulo</label>
            <input id="heroTitle" name="heroTitle" defaultValue={settings.heroTitle} required />
          </div>
          <div className="field">
            <label htmlFor="heroSubtitle">Subtitulo</label>
            <textarea id="heroSubtitle" name="heroSubtitle" defaultValue={settings.heroSubtitle} required />
          </div>
          <div className="field-grid two">
            <div className="field">
              <label htmlFor="heroBgImage">Imagem de fundo</label>
              <input id="heroBgImage" name="heroBgImage" defaultValue={settings.heroBgImage} required />
            </div>
            <div className="field">
              <label htmlFor="heroPrimaryCtaHref">Link CTA principal</label>
              <input id="heroPrimaryCtaHref" name="heroPrimaryCtaHref" defaultValue={settings.heroPrimaryCtaHref} required />
            </div>
          </div>
          <div className="field-grid two">
            <div className="field">
              <label htmlFor="heroPrimaryCtaLabel">Texto CTA principal</label>
              <input id="heroPrimaryCtaLabel" name="heroPrimaryCtaLabel" defaultValue={settings.heroPrimaryCtaLabel} required />
            </div>
            <div className="field">
              <label htmlFor="heroSecondaryCtaLabel">Texto CTA secundario</label>
              <input id="heroSecondaryCtaLabel" name="heroSecondaryCtaLabel" defaultValue={settings.heroSecondaryCtaLabel} required />
            </div>
          </div>
          <div className="field">
            <label htmlFor="heroSecondaryCtaHref">Link CTA secundario</label>
            <input id="heroSecondaryCtaHref" name="heroSecondaryCtaHref" defaultValue={settings.heroSecondaryCtaHref} required />
          </div>
        </div>

        <div className="admin-card stack">
          <h2 style={{ margin: 0 }}>Sobre</h2>
          <div className="field">
            <label htmlFor="aboutTitle">Titulo</label>
            <input id="aboutTitle" name="aboutTitle" defaultValue={settings.aboutTitle} required />
          </div>
          <div className="field">
            <label htmlFor="aboutText">Texto</label>
            <textarea id="aboutText" name="aboutText" defaultValue={settings.aboutText} required />
          </div>
          <div className="field">
            <label htmlFor="aboutImage">Imagem</label>
            <input id="aboutImage" name="aboutImage" defaultValue={settings.aboutImage} required />
          </div>
        </div>

        <div className="admin-card stack">
          <h2 style={{ margin: 0 }}>Contato</h2>
          <div className="field-grid two">
            <div className="field">
              <label htmlFor="phoneWhatsapp">WhatsApp (somente numeros)</label>
              <input id="phoneWhatsapp" name="phoneWhatsapp" defaultValue={settings.phoneWhatsapp} required />
            </div>
            <div className="field">
              <label htmlFor="phoneDisplay">WhatsApp exibido</label>
              <input id="phoneDisplay" name="phoneDisplay" defaultValue={settings.phoneDisplay} required />
            </div>
          </div>
          <div className="field-grid two">
            <div className="field">
              <label htmlFor="contactEmail">E-mail</label>
              <input id="contactEmail" name="contactEmail" type="email" defaultValue={settings.contactEmail} required />
            </div>
            <div className="field">
              <label htmlFor="instagramUrl">Instagram</label>
              <input id="instagramUrl" name="instagramUrl" type="url" defaultValue={settings.instagramUrl} required />
            </div>
          </div>
          <div className="field">
            <label htmlFor="address">Endereco</label>
            <input id="address" name="address" defaultValue={settings.address} required />
          </div>
          <div className="field">
            <label htmlFor="businessHours">Horario</label>
            <input id="businessHours" name="businessHours" defaultValue={settings.businessHours} required />
          </div>
        </div>

        <div>
          <button type="submit" className="button-primary">
            Salvar configuracoes
          </button>
        </div>
      </form>
      </div>
    </AdminShell>
  );
}
