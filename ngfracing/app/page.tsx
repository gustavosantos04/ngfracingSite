import { AboutSection } from "@/components/site/AboutSection";
import { ContactSection } from "@/components/site/ContactSection";
import { FeaturedInventory } from "@/components/site/FeaturedInventory";
import { HeroSection } from "@/components/site/HeroSection";
import { PartsPreview } from "@/components/site/PartsPreview";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export default async function HomePage() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <main>
        <HeroSection />
        <AboutSection />
        <FeaturedInventory />
        <PartsPreview />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
