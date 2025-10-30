import React, { useState } from "react";
import { useLocale } from "../../../contexts/LocaleContext";

const FAQBlock: React.FC = () => {
   const { translations } = useLocale();
   const [openIndex, setOpenIndex] = useState<number | null>(null);

   // FAQ data would come from locale-specific content
   const faqs = [
      {
         question: translations.services.items[0].title,
         answer: translations.services.items[0].description,
      },
      {
         question: translations.services.items[1].title,
         answer: translations.services.items[1].description,
      },
   ];

   const toggleFAQ = (index: number) => {
      setOpenIndex(openIndex === index ? null : index);
   };

   return (
      <div className="space-y-4">
         {faqs.map((faq, index) => (
            <div
               key={index}
               className="bg-white rounded-lg shadow-md overflow-hidden"
            >
               <button
                  className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFAQ(index)}
               >
                  <span className="font-medium text-lg">{faq.question}</span>
                  <svg
                     className={`w-5 h-5 transition-transform ${
                        openIndex === index ? "rotate-180" : ""
                     }`}
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                     ></path>
                  </svg>
               </button>
               {openIndex === index && (
                  <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                     <p className="text-gray-600">{faq.answer}</p>
                  </div>
               )}
            </div>
         ))}
      </div>
   );
};

export default FAQBlock;
