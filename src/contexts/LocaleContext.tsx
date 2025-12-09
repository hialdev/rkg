import React, { createContext, useContext, type ReactNode } from "react";
import {
   currentLocale,
   currentTranslations,
   translationCache,
   setLocale,
   type Locale,
} from "../stores/locale";
import { useStore } from "@nanostores/react";
import { doTranslate } from "../fetchers/webprofile";

interface LocaleContextType {
   locale: Locale;
   translations: Record<string, any>;
   setLocale: (locale: Locale) => void;
   t: (text: string) => Promise<string>;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider: React.FC<{ children: ReactNode }> = ({
   children,
}) => {
   const locale = useStore(currentLocale);
   const translations = useStore(currentTranslations);
   const cache = useStore(translationCache);

   const t = async (text: string): Promise<string> => {
      if (!text) return "";

      // EN langsung return asli
      if (locale === "en") return text;

      // 1. Check static dictionary
      const translationsDict = translations as Record<string, any>;
      if (translationsDict[text]) return translationsDict[text];

      // 2. Check dynamic cache
      const cacheStore = translationCache.get();
      if (cacheStore[text]) return cacheStore[text];

      // 3. Translate with API
      const translated = await doTranslate(text, locale);

      // 4. Save to cache
      translationCache.set({
         ...cacheStore,
         [text]: translated,
      });

      return translated;
   };

   return (
      <LocaleContext.Provider value={{ locale, translations, setLocale, t }}>
         {children}
      </LocaleContext.Provider>
   );
};

// Hook
export const useLocale = () => {
   const context = useContext(LocaleContext);

   if (!context) {
      const locale = currentLocale.get();
      const translations = currentTranslations.get();

      return {
         locale,
         translations,
         setLocale: (locale: Locale) => currentLocale.set(locale),
         t: async (text: string) => {
            if (!text) return "";
            if (locale === "en") return text;

            const cacheStore = translationCache.get();
            if (cacheStore[text]) return cacheStore[text];

            const translated = await doTranslate(text, locale);

            translationCache.set({
               ...cacheStore,
               [text]: translated,
            });

            return translated;
         },
      };
   }

   return context;
};
