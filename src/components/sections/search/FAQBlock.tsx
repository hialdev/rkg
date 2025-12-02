import React, { useEffect, useState } from "react";
import { useLocale } from "../../../contexts/LocaleContext";
import { type Faq, getFaqs } from "../../../fetchers";

const FAQBlock: React.FC = () => {
   const { translations } = useLocale();
   const [openIndex, setOpenIndex] = useState<number | null>(null);
   const [faqs, setFaqs] = useState<Faq[]>([]);
   const fetchFaqs = async () => {
      const res = await getFaqs();
      setFaqs(res.data.data);
   };
   useEffect(() => {fetchFaqs()}, []);

   const toggleFAQ = (index: number) => {
      setOpenIndex(openIndex === index ? null : index);
   };

   return (
      <div className="space-y-4">
         {faqs.map((faq, index) => (
            <div
               key={faq.id}
               className="bg-white rounded-lg shadow-md overflow-hidden"
            >
               <button
                  className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFAQ(index)}
               >
                  <span className="font-medium text-lg">{faq.title}</span>
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
                     <div dangerouslySetInnerHTML={{ __html: faq.content ?? "" }}></div>
                  </div>
               )}
            </div>
         ))}
      </div>
   );
};

export default FAQBlock;
