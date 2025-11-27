import ImageGalleryBlock from "./ImageGalleryBlock";
import SplitWidthSlider from "./SplitWidthSlider";
import GalleryMansory from "../../../components/cards/GalleryMansory";
import { galleryItems } from "../../../mock";
import { useLocale } from "../../../contexts/LocaleContext";
import { useEffect, useState } from "react";
import { getGalleries, type GalleryResponse } from "../../../fetchers";

export default function GalleryView() {
   const { translations } = useLocale();
   const [galleries, setGalleries] = useState<GalleryResponse>();

   const fetchGallery = async () => {
      const res = await getGalleries();
      setGalleries(res.data.data);
   };

   useEffect(() => {
      fetchGallery();
      console.log(galleries);
   }, []);

   return (
      <>
         <section className="bg-stone-100 py-10 px-5">
            <div className="container mx-auto">
               <h1 className="text-4xl font-medium mb-5 hidden">
                  {translations.gallery.title}
               </h1>
               <SplitWidthSlider items={galleries ? galleries.featured : []} />
            </div>
         </section>
         <section className="bg-stone-100 py-10 px-5">
            <ImageGalleryBlock title={translations.gallery?.title} />
         </section>
         <section className="bg-white py-10 px-5">
            <div className="container mx-auto">
               <h2 className="text-4xl font-medium py-8 text-center">
                  {translations.gallery?.title2}
               </h2>
               <GalleryMansory items={galleries ? galleries.all : []} />
            </div>
         </section>
      </>
   );
}
