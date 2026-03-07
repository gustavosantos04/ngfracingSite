import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminSession } from "@/lib/auth";
import { siteCopy, siteSettings } from "@/lib/siteContent";

export default async function AdminSettingsPage() {
  await requireAdminSession();

  return (
    <AdminShell>
      <div className="stack">
        <div className="admin-card stack">
          <span className="section-kicker">Conteúdo</span>
          <h1 className="section-title" style={{ marginBottom: 8 }}>
            Hero, sobre e contato
          </h1>
          <p className="section-copy">
            O conteúdo institucional da home agora fica centralizado em `lib/siteContent.ts`.
            Para alterar textos, CTAs, timeline, endereço e horários, edite esse arquivo.
          </p>
        </div>

        <div className="admin-card stack">
          <h2 style={{ margin: 0 }}>Resumo atual</h2>
          <p className="section-copy" style={{ marginTop: 0 }}>
            Hero: {siteCopy.hero.kicker} / {siteSettings.heroTitle}
          </p>
          <p className="section-copy" style={{ marginTop: 0 }}>
            Sobre: {siteCopy.about.kicker} / {siteSettings.aboutTitle}
          </p>
          <p className="section-copy" style={{ marginTop: 0 }}>
            Contato: {siteCopy.contact.kicker} / {siteCopy.contact.title}
          </p>
        </div>
      </div>
    </AdminShell>
  );
}
