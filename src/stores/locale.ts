import { atom, map } from "nanostores";
import { persistentAtom } from "@nanostores/persistent";
import { en } from "../mock/en";
import { id } from "../mock/id";

export type Locale = "en" | "id";

// Use persistent atom for locale to automatically sync with localStorage
export const currentLocale = persistentAtom<Locale>("locale", "en", {
  encode: (value) => value,
  decode: (value) => {
    // Validate the locale value from storage
    if (value === "en" || value === "id") {
      return value;
    }
    // Default to "en" if invalid value is found
    return "en";
  }
});

// Create a reactive translations atom that updates when locale changes
export const currentTranslations = atom(en);

// Subscribe to locale changes to update translations and HTML lang attribute
currentLocale.subscribe((locale) => {
  // Update translations based on locale
  const translations = locale === "en" ? en : id;
  currentTranslations.set(translations);
  
  // Update the HTML lang attribute
  if (typeof document !== "undefined") {
    document.documentElement.lang = locale;
  }
});

export function setLocale(locale: Locale) {
  currentLocale.set(locale);
}

// Initialize locale from browser preference if not set
if (!currentLocale.get()) {
  if (typeof window !== "undefined") {
    // Try to detect browser language
    const browserLang = navigator.language.startsWith("id") ? "id" : "en";
    currentLocale.set(browserLang as Locale);
  }
}
