import { getSiteSettings } from "@/lib/data";
import type { PublicSiteSettings } from "@/lib/types";
import { SiteHeaderClient } from "@/components/site/SiteHeaderClient";

export async function SiteHeader() {
  const settings = await getSiteSettings();
  const headerSettings: Pick<PublicSiteSettings, "phoneWhatsapp"> = {
    phoneWhatsapp: settings.phoneWhatsapp
  };

  return <SiteHeaderClient settings={headerSettings} />;
}
