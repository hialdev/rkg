import React, { useEffect } from "react";
import { useLocale } from "../../contexts/LocaleContext";
import { Icon } from "@iconify-icon/react";
import { currentLocale } from "../../stores/locale";
import { useStore } from "@nanostores/react";

const SwitchLang: React.FC = () => {
   const { setLocale } = useLocale();
   const locale = useStore(currentLocale);

   const handleChangeLocale = (newLocale: "en" | "id") => {
      setLocale(newLocale);
      // Update HTML lang attribute
      document.documentElement.lang = newLocale;
      window.location.reload();
   }

   return (
      <div className="flex bg-gray-200 rounded-full p-1 w-16 h-8 relative">
         {/* US Flag Button */}
         <button
            onClick={() => handleChangeLocale("en")}
            className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 focus:outline-none mr-2 ${
               locale === "en"
                  ? "bg-white shadow-md scale-110" // Active state: white background, shadow, scale
                  : "opacity-70 hover:opacity-100" // Inactive state: lower opacity
            }`}
            aria-label="Switch to English"
         >
            <Icon
               icon="twemoji:flag-united-states"
               width="20"
               height="12"
               className="rounded-sm"
            />
         </button>
         <button
            onClick={() => {
               handleChangeLocale("id");
            }}
            className={`flex bg-red-20 items-center justify-center w-6 h-6 rounded-full transition-all duration-300 focus:outline-none ${
               locale === "id"
                  ? "bg-white shadow-md scale-110" // Active state: white background, shadow, scale
                  : "opacity-70 hover:opacity-100" // Inactive state: lower opacity
            }`}
            aria-label="Switch to Indonesian"
         >
            <Icon
               icon="twemoji:flag-indonesia"
               width="20"
               height="12"
               className="rounded-sm"
            />
         </button>
      </div>
   );
};

export default SwitchLang;
