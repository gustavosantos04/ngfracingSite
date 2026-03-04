import Image from "next/image";
import { getSiteSettings } from "@/lib/data";

const timeline = [
  { year: "2001", copy: "Inicio nas pistas de arrancada" },
  { year: "2013", copy: "Curadoria de veiculos e atendimento especializado" },
  { year: "Hoje", copy: "Loja referencia em performance e procedencia" }
];

export async function AboutSection() {
  const settings = await getSiteSettings();

  return (
    <section id="sobre" className="section">
      <div className="container">
        <div
          className="surface-card"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.2fr) minmax(280px, 0.8fr)",
            gap: 0
          }}
        >
          <div style={{ padding: 32 }}>
            <span className="section-kicker">Sobre</span>
            <h2 className="section-title" style={{ marginBottom: 18 }}>
              {settings.aboutTitle}
            </h2>
            <p className="section-copy">{settings.aboutText}</p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 12,
                marginTop: 28
              }}
            >
              {timeline.map((item) => (
                <div
                  key={item.year}
                  style={{
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.08)",
                    padding: 14,
                    background: "rgba(255,255,255,0.03)"
                  }}
                >
                  <div style={{ color: "var(--yellow)", fontWeight: 800 }}>{item.year}</div>
                  <div className="muted" style={{ fontSize: "0.94rem", marginTop: 6 }}>
                    {item.copy}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ minHeight: 360, position: "relative" }}>
            <Image
              src={settings.aboutImage}
              alt="Imagem da historia da NGF Racing"
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
