import React from "react";
import { Icon } from "@iconify-icon/react";
import { useLocale } from "../../../contexts/LocaleContext";
import { imageLists } from "../../../mock";

const WhyUsContent: React.FC = () => {
   const { translations } = useLocale();

   return (
      <section className="relative">
         <div className="absolute top-0 end-0 start-0 bottom-0 -z-10">
            <img
               src={imageLists[0].path}
               alt={imageLists[0].alt}
               className="block h-full w-full aspect-video object-cover"
            />
         </div>
         <div className="bg-stone-950/50 py-20">
            <div className="container mx-auto px-3">
               <h2 className="text-center text-4xl font-medium mb-10 text-white">
                  {translations.why?.title || "We make Trip easy and Unforgetable"}
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {translations.highlights?.map((why: any) => (
                     <div
                        key={why.title}
                        className="flex items-center gap-5 bg-white p-5 rounded-xl"
                     >
                        <div className="flex items-center justify-center aspect-square">
                           <Icon icon={why.icon} width={40} />
                        </div>
                        <div>
                           <h3 className="text-xl font-medium">{why.title}</h3>
                           <p>{why.description}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>
   );
};

export default WhyUsContent;
