import React, { useEffect, useState } from "react";
import { useLocale } from "../../../contexts/LocaleContext";
import SearchView from "./SearchView";
import ImageGalleryBlock from "../gallery/ImageGalleryBlock";
import WhyUsContent from "./WhyUsContent";
import TestimonialBox from "../home/TestimonialBox";
import FAQBlock from "./FAQBlock";

const LocaleSearchContent: React.FC = () => {
   const [isClient, setIsClient] = useState(false);
   const { translations } = useLocale();

   useEffect(() => {
      setIsClient(true);
   }, []);

   if (!isClient) {
      return (
         <>
            <section className="container mx-auto py-20 px-4">
               
            </section>
         </>
      );
   }

   return (
      <>
         <SearchView />

         <section className="py-10 px-3">
            <ImageGalleryBlock />
         </section>

         <WhyUsContent />

         <section className="bg-orange-400 m-0">
            <div className="container mx-auto py-20 px-3">
               <h2 className="text-5xl font-medium mb-10">
                  {translations.testimonials?.title || "Testimonials"}
               </h2>
               <TestimonialBox />
            </div>
         </section>

         <section className="container mx-auto py-20">
            <h2 className="text-4xl font-medium mb-10">
               {translations.faq?.title || "Frequently Asked Question"}
            </h2>
            <FAQBlock />
         </section>
      </>
   );
};

export default LocaleSearchContent;
