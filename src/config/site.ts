import { env } from "@/env";

/**
 * Centralna konfiguracja witryny.
 * Jedyne źródło prawdy dla nazwy marki, adresu i danych kontaktowych —
 * używane w metadanych SEO, stopce, e-mailach transakcyjnych i JSON-LD.
 */
export const siteConfig = {
  name: "Aledeska",
  url: env.NEXT_PUBLIC_SITE_URL,
  description:
    "Ekologiczne deski do krojenia z litego drewna — dębowe i bukowe, sztorcowe, wykonane ręcznie w Polsce. Bez bambusa, plastiku i szkodliwych klejów.",
  contact: {
    email: "sklep@aledeska.pl",
    phone: "+48 668 682 819",
  },
  social: {
    facebook: "https://www.facebook.com/sklepaledeska/",
    instagram: "https://www.instagram.com/aledeska_pl/",
    tiktok: "https://www.tiktok.com/@aledeskapl",
  },
} as const;
