import TestiImageSlider from "../gallery/TestiImageSlider";
import DestinationSlider from "../gallery/DestinationSlider";
import FAQBlock from "../search/FAQBlock";
import { Icon } from "@iconify-icon/react";
import TestimonialCard from "../../cards/TestimonialCard";

export default function TripSection({ tripData }: { tripData: any }) {
   return (
      <>
         {tripData && (
            <div>
               <section className="pb-20">
                  <h2 className="text-4xl font-bold text-red-600 mb-10">
                     Testimonials
                  </h2>
                  <TestimonialCard />
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
