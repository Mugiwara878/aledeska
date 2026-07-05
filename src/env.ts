import { z } from "zod";

/**
 * Schemat wszystkich zmiennych środowiskowych aplikacji.
 *
 * Zmienne z prefiksem NEXT_PUBLIC_ trafiają do przeglądarki (są jawne).
 * Wszystkie pozostałe istnieją WYŁĄCZNIE na serwerze.
 * Każda nowa zmienna w projekcie MUSI zostać dopisana tutaj
 * oraz do pliku .env.example.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  BASELINKER_API_TOKEN: z.string().min(1),
});

const parsed = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  BASELINKER_API_TOKEN: process.env.BASELINKER_API_TOKEN,
});

if (!parsed.success) {
  console.error("❌ Nieprawidłowe zmienne środowiskowe:", parsed.error.flatten().fieldErrors);
  throw new Error("Nieprawidłowa konfiguracja środowiska — sprawdź plik .env.local");
}

export const env = parsed.data;
