import Link from "next/link";
import { HeroParallaxMedia } from "@/components/site/HeroParallaxMedia";
import { getSiteSettings } from "@/lib/data";
import { siteCopy } from "@/lib/siteContent";

export async function HeroSection() {
  const settings = await getSiteSettings();

  return (
    <section
      id="home"
      className="section hero-section"
      style={{
        minHeight: "calc(100vh - 78px)"
      }}
    >
      <HeroParallaxMedia imageUrl={settings.heroBgImage} />
      <div className="container">
        <div className="hero-content" style={{ width: "min(760px, 100%)", padding: "36px 0" }}>
          <span className="section-kicker">{siteCopy.hero.kicker}</span>
          <h1
            style={{
              margin: "0 0 18px",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.4rem, 6vw, 5rem)",
              lineHeight: 1.05
            }}
          >
            {settings.heroTitle}
          </h1>
          <p
            style={{
              margin: "0 0 28px",
              maxWidth: 640,
              color: "rgba(255,255,255,0.84)",
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              lineHeight: 1.7
            }}
          >
            {settings.heroSubtitle}
          </p>
          <div className="inline-actions">
            <Link href={settings.heroPrimaryCtaHref} className="button-primary">
              {settings.heroPrimaryCtaLabel}
            </Link>
            <a href={settings.heroSecondaryCtaHref} className="button-secondary">
              {settings.heroSecondaryCtaLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
