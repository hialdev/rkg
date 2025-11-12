import TestiImageSlider from "../gallery/TestiImageSlider";
import DestinationSlider from "../gallery/DestinationSlider";
import FAQBlock from "../search/FAQBlock";
import { Icon } from "@iconify-icon/react";

export default function TripSection({ tripData }: { tripData: any }) {
   return (
      <>
         {tripData && (
            <div>
               <section className="pb-20">
                  <h2 className="text-4xl font-bold text-red-600 mb-10">
                     Testimonials
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 gap-y-10 sm:gap-y-5">
                     {tripData.testimonials.map((testi: any) => {
                        return (
                           <div className="flex flex-col lg:flex-row items-start md:items-center gap-5">
                              <TestiImageSlider
                                 images={testi.images}
                              />
                              <div className="">
                                 <h6 className="text-lg font-medium">
                                    {testi.name}
                                 </h6>
                                 <div className="text-stone-400 italic">
                                    {testi.role}
                                 </div>
                                 <div className="flex items-center gap-1 mb-4 mt-2">
                                    {[...Array(5)].map((_, index) => (
                                       <Icon
                                          icon={
                                             index < testi.star
                                                ? "mdi:star"
                                                : "mdi:star-outline"
                                          }
                                          width={20}
                                          className={
                                             index < testi.star
                                                ? "text-yellow-400"
                                                : "text-stone-300"
                                          }
                                       />
                                    ))}
                                 </div>
                                 <q>{testi.review}</q>
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </section>

               <section className="py-10">
                  <iframe
                     src={tripData.gmap_link}
                     frameBorder="0"
                     style={{ width: "100%", height: "25em" }}
                     allowFullScreen
                     loading="lazy"
                  ></iframe>
               </section>

               <section className="py-10">
                  <h2 className="text-4xl font-bold text-red-600 mb-10">
                     Destination
                  </h2>
                  <DestinationSlider
                     destinations={tripData.destinations}
                  />
               </section>

               <section className="py-10">
                  <h2 className="text-4xl mb-10 text-stone-900 font-bold underline decoration-yellow-400 decoration-12 underline-offset-3">
                     FAQ
                  </h2>
                  <FAQBlock/>
               </section>
            </div>
         )}
      </>
   );
}
