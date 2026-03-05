import Image from "next/image";
import { getSiteSettings } from "@/lib/data";
import { AboutTimeline } from "@/components/site/AboutTimeline";

const timeline = [
  { year: "2001", copy: "Primeiros projetos nas pistas de arrancada." },
  { year: "2013", copy: "Curadoria profissional de ve\u00edculos e atendimento consultivo." },
  { year: "Hoje", copy: "Refer\u00eancia em proced\u00eancia, performance e confian\u00e7a no atendimento." }
];

export async function AboutSection() {
  const settings = await getSiteSettings();

  return (
    <section id="sobre" className="section">
      <div className="container">
        <div className="surface-card about-shell">
          <div className="about-content">
            <span className="section-kicker">Sobre</span>
            <h2 className="section-title about-title">{settings.aboutTitle}</h2>
            <p className="section-copy">{settings.aboutText}</p>
            <AboutTimeline items={timeline} />
          </div>
          <div className="about-media">
            <Image
              src={settings.aboutImage}
              alt="Imagem da hist\u00f3ria da NGF Racing"
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