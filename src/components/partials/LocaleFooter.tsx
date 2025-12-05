import React, { useEffect, useState } from "react";
import { useLocale } from "../../contexts/LocaleContext";
import LogoRKG from "../../assets/rkgtour.webp";
import { getSetting } from "../../fetchers";
import { menuPaths } from "../../config/menu";

interface FooterType {
   sales?: string;
   admin?: string;
   gmap?: string;
   logo?: string;
}
const LocaleFooter: React.FC = () => {
   const { translations } = useLocale();
   const [footer, setFooter] = useState<FooterType>();

   const fetchFooter = async () => {
      const resSales = await getSetting("com.sales");
      const resAdmin = await getSetting("com.admin");
      const resGmap = await getSetting("com.gmap");
      const resLogo = await getSetting("dash.logo");

      const footerData = {
         sales: resSales.data.data.set_value,
         admin: resAdmin.data.data.set_value,
         logo: resLogo.data.data.set_value ? import.meta.env.PUBLIC_API_URL +'/'+ resLogo.data.data.set_value : LogoRKG.src,
         gmap: resGmap.data.data.set_value,
      };

      setFooter(footerData);
   };
   useEffect(() => {fetchFooter()}, []);

   return (
      <footer className="bg-slate-600 text-white py-20 px-3">
         <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between gap-10">
               <div className="w-full md:max-w-[40%]">
                  <img
                     src={footer?.logo || LogoRKG.src}
                     alt={`Footer logo RKG`}
                     className="mb-5 max-w-[12em] max-h-[8em] object-left object-contain brightness-0 invert"
                  />
                  <div>
                     {translations.footer?.description ||
                        "RKG Tour and Travel is a professional travel agency and event organizer, dedicated to creating unforgettable journeys and seamless experiences."}
                  </div>
                  {/* <div className="font-medium text-lg mt-5 mb-3">
                     {translations.footer?.paymentTitle || "Payment Methods"}
                  </div>
                  <div className="grid grid-cols-10">
                     <div className="flex items-center justify-center max-h-[2em] p-1 rounded-md bg-white">
                        <img
                           src={`https://placehold.co/200x300`}
                           alt={`image payment methods`}
                           className="object-contain h-full w-full max-h-[2em]"
                        />
                     </div>
                  </div> */}
               </div>
               <div className="mb-10">
                  <h4 className="text-xl font-medium mb-5 text-white">
                     {translations.nav.services}
                  </h4>
                  <nav className="flex flex-col gap-2">
                     <a href={menuPaths.home+"/search"} className="text-white">
                        {translations.services.items[0]?.title || "Travel"}
                     </a>
                     <a href={menuPaths.service.event_organizer} className="text-white">
                        {translations.services.items[2]?.title || "Event"}
                     </a>
                  </nav>
               </div>

               <div>
                  <h4 className="text-xl font-medium mb-5 text-white">
                     {translations.footer?.aboutTitle ||
                        "About RKG Tour & Travel"}
                  </h4>
                  <nav className="flex flex-col gap-2">
                     <a href={menuPaths.about} className="text-white">
                        {translations.nav.about}
                     </a>
                     <a href={menuPaths.home+"#contact"} className="text-white">
                        {translations.nav.contact}
                     </a>
                     <a href={menuPaths.service.open_trip+"#faq"} className="text-white">
                        {translations.nav.faq || "FAQ"}
                     </a>
                  </nav>
               </div>
               <div>
                  <div className="mb-10">
                     <h4 className="text-xl font-medium mb-5 text-white">
                        {translations.footer?.contactTitle || "Contact Us"}
                     </h4>
                     <nav className="flex flex-col gap-2">
                        <a href={`mailto:${footer?.sales}`} className="text-white">
                           Email : {footer?.sales}
                        </a>
                        <a href={`https://wa.me/${footer?.admin}`} className="text-white">
                           Admin : {footer?.admin}
                        </a>
                     </nav>
                  </div>
                  <div>
                     <h4 className="text-xl font-medium mb-5 text-white">
                        {translations.footer?.locationTitle || "Our Location"}
                     </h4>
                     <div>
                        <iframe
                           src={footer?.gmap ?? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126934.52524919015!2d106.68412931640627!3d-6.17038599999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f51beef3a83d%3A0xf33dc651dadbb47d!2sMerdeka%20Palace!5e0!3m2!1sen!2sid!4v1761405139540!5m2!1sen!2sid"}
                           className="max-w-[20em]"
                           style={{ border: 0 }}
                           allowFullScreen
                           loading="lazy"
                           referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </footer>
   );
};

export default LocaleFooter;
