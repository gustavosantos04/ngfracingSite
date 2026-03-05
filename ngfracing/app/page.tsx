import { AboutSection } from "@/components/site/AboutSection";
import { ContactSection } from "@/components/site/ContactSection";
import { FeaturedInventory } from "@/components/site/FeaturedInventory";
import { HeroSection } from "@/components/site/HeroSection";
import { PartsPreview } from "@/components/site/PartsPreview";
import { SectionReveal } from "@/components/site/SectionReveal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export default async function HomePage() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <main>
        <HeroSection />
        <SectionReveal>
          <AboutSection />
        </SectionReveal>
        <SectionReveal delay={0.04}>
          <FeaturedInventory />
        </SectionReveal>
        <SectionReveal delay={0.08}>
          <PartsPreview />
        </SectionReveal>
        <SectionReveal delay={0.12}>
          <ContactSection />
        </SectionReveal>
      </main>
      <SiteFooter />
    </div>
  );
}
