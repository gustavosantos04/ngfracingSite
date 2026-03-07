import Image from "next/image";
import { AboutTimeline } from "@/components/site/AboutTimeline";
import { getSiteSettings } from "@/lib/data";
import { siteCopy } from "@/lib/siteContent";

export async function AboutSection() {
  const settings = await getSiteSettings();

  return (
    <section id="sobre" className="section">
      <div className="container">
        <div className="surface-card about-shell">
          <div className="about-content">
            <span className="section-kicker">{siteCopy.about.kicker}</span>
            <h2 className="section-title about-title">{settings.aboutTitle}</h2>
            <p className="section-copy">{settings.aboutText}</p>
            <AboutTimeline items={siteCopy.about.timeline} />
          </div>
          <div className="about-media">
            <Image
              src={settings.aboutImage}
              alt="Imagem da história da NGF Racing"
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
