import { atom } from "nanostores";
import { persistentAtom } from "@nanostores/persistent";
import { en } from "../mock/en";
import { id } from "../mock/id";

export type Locale = "en" | "id";

/**
 * Current active locale.
 * Auto-saved to localStorage.
 */
export const currentLocale = persistentAtom<Locale>("locale", "en", {
   encode: (value) => value,
   decode: (value) => (value === "en" || value === "id" ? value : "en"),
});

/**
 * Static dictionary for UI texts.
 * Example: nav.home, cta.seeDetail, etc.
 */
export const currentTranslations = atom(en);

/**
 * Dynamic translation cache (hasil doTranslate API)
 * Format:
 * {
 *   "Hello World": "Halo Dunia",
 *   "Our Service": "Layanan Kami"
 * }
 */
export const translationCache = persistentAtom<Record<string, string>>(
   "translation-cache",
   {},
   {
      encode: (value) => JSON.stringify(value),
      decode: (value) => JSON.parse(value),
   }
);

// When locale changes, update dictionary + HTML lang
currentLocale.subscribe((locale) => {
   currentTranslations.set(locale === "en" ? en : id);

   if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
   }
});

/**
 * Helper function to change locale
 */
export function setLocale(locale: Locale) {
   currentLocale.set(locale);
}

// Initialize browser preference (only if nothing saved yet)
if (!currentLocale.get() && typeof window !== "undefined") {
   const browserLang = navigator.language.startsWith("id") ? "id" : "en";
   currentLocale.set(browserLang as Locale);
}
