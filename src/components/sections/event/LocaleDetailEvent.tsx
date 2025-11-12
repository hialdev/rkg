import type { ctgEvents } from "../../../mock";
import GalleryMansory from "../../cards/GalleryMansory";

export default function LocaleDetailEvent({
   eventData,
}: {
   eventData: (typeof ctgEvents)[0] | undefined;
}) {
   return (
      <>
         <img
            src={eventData?.image}
            alt={eventData?.title + `Hero Image`}
            className="block w-full object-cover max-h-[90vh] aspect-video"
         />
         <section className="bg-black text-white">
            <div className="container mx-auto py-20">
               <h1 className="text-5xl font-bold mb-10">{eventData?.title}</h1>
               <div
                  className="content"
                  dangerouslySetInnerHTML={
                     eventData?.content
                        ? { __html: eventData.content }
                        : undefined
                  }
               />
            </div>
         </section>

         <section className="bg-black text-white">
            <div className="container mx-auto pb-20">
               <h2 className="text-5xl font-semibold mb-10">Gallery</h2>
               <GalleryMansory items={eventData?.galleries ? eventData.galleries.filter(gallery => gallery).map((media, i) => ({id: i, media, title: eventData.title, excerpt: eventData.description})) : []}/>
            </div>
         </section>
      </>
   );
}
