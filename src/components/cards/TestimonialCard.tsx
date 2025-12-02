import { Icon } from "@iconify-icon/react";
import TestiImageSlider from "../sections/gallery/TestiImageSlider";
import { useEffect, useState } from "react";
import { getTestimonials, type Testimonial } from "../../fetchers";

export default function TestimonialCard() {
   const [testimonials, setTestimonials] = useState<Testimonial[]>()
   
   const fetchTesti = async () => {
      const testi = await getTestimonials();
      setTestimonials(testi.data.data.slice(0,4))
   }
   useEffect(() => {
      fetchTesti()
   }, [])
   return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 gap-y-10 sm:gap-y-5">
         {testimonials && testimonials.map((testi: Testimonial) => {
            let galleries = JSON.parse(testi.galleries ?? '[]')
            if (!Array.isArray(galleries)) galleries = galleries.split(',')
            let images = []
            images.push(testi.image, ...galleries)
            let parsedImages = images.map((image) => import.meta.env.PUBLIC_API_URL+'/'+image)
            return (
               <div key={testi.id} className="flex flex-col lg:flex-row items-start md:items-center gap-5">
                  <TestiImageSlider images={parsedImages} />
                  <div className="">
                     <h6 className="text-lg font-medium">{testi.name}</h6>
                     <div className="text-stone-800/50 italic">{testi.role}</div>
                     <div className="flex items-center gap-1 mb-4 mt-2">
                        {[...Array(5)].map((_, index) => (
                           <Icon
                              key={index}
                              icon={
                                 (testi.star && index < testi?.star) || 5
                                    ? "mdi:star"
                                    : "mdi:star-outline"
                              }
                              width={20}
                              className={
                                 (testi.star && index < testi?.star) || 5
                                    ? "text-yellow-400"
                                    : "text-stone-300"
                              }
                           />
                        ))}
                     </div>
                     <q>{testi.quote}</q>
                  </div>
               </div>
            );
         })}
      </div>
   );
}
