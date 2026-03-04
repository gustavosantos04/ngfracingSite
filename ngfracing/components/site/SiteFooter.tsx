import Link from "next/link";
import { getSiteSettings } from "@/lib/data";

export async function SiteFooter() {
  const settings = await getSiteSettings();

  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.08)", background: "#080808" }}>
      <div className="container" style={{ display: "grid", gap: 18, padding: "28px 0 38px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            alignItems: "center"
          }}
        >
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem" }}>NGF Racing</div>
            <div className="muted">{settings.address}</div>
          </div>
          <div className="inline-actions">
            <a href={`https://wa.me/${settings.phoneWhatsapp}`}>{settings.phoneDisplay}</a>
            <a href={settings.instagramUrl} target="_blank" rel="noreferrer">
              Instagram
            </a>
            <Link href="/admin/login">Admin</Link>
          </div>
        </div>
        <div className="muted" style={{ fontSize: "0.9rem" }}>
          Seminovos, carros modificados e pecas de alta performance. Site migrado para Next.js com CMS.
        </div>
      </div>
    </footer>
  );
}
