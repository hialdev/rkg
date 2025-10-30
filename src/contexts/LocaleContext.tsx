import React, { createContext, useContext, type ReactNode, useEffect } from "react";
import { currentLocale, currentTranslations, setLocale, type Locale } from "../stores/locale";
import { useStore } from "@nanostores/react";

// Create context
interface LocaleContextType {
   locale: Locale;
   translations: any;
   setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Provider component that uses nanostore persistent
export const LocaleProvider: React.FC<{ children: ReactNode }> = ({
   children,
}) => {
   // Get values from nanostore
   const locale = useStore(currentLocale);
   const translations = useStore(currentTranslations);

   return (
      <LocaleContext.Provider value={{ locale, translations, setLocale }}>
         {children}
      </LocaleContext.Provider>
   );
};

// Custom hook to use locale context
export const useLocale = () => {
   const context = useContext(LocaleContext);
   if (!context) {
      // Return nanostore values during SSR
      const locale = currentLocale.get();
      const translations = currentTranslations.get();
      return {
         locale: locale,
         translations: translations,
         setLocale: (locale: Locale) => {
            // Update nanostore directly
            currentLocale.set(locale);
         },
      };
   }
   return context;
};
