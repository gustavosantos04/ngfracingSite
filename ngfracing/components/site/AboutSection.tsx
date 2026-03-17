import Image from "next/image";
import { AboutTimeline } from "@/components/site/AboutTimeline";
import { getSiteSettings } from "@/lib/data";
import { sharedImageBlurDataUrl } from "@/lib/images";
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
            <div className="about-media-frame">
              <Image
                src={settings.aboutImage}
                alt="Imagem da histÃ³ria da NGF Racing"
                fill
                sizes="(max-width: 900px) 100vw, 40vw"
                placeholder="blur"
                blurDataURL={sharedImageBlurDataUrl}
                className="about-media-image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
