import ImageGalleryBlock from "./ImageGalleryBlock";
import SplitWidthSlider from "./SplitWidthSlider";
import GalleryMansory from "../../../components/cards/GalleryMansory";
import { galleryItems } from "../../../mock";
import { useLocale } from "../../../contexts/LocaleContext";

export default function GalleryView() {
   const { translations } = useLocale();
   
   return (
      <>
         <section className="bg-stone-100 py-10 px-5">
            <div className="container mx-auto">
               <h1 className="text-4xl font-medium mb-5 hidden">{translations.gallery.title}</h1>
               <SplitWidthSlider />
            </div>
         </section>
         <section className="bg-stone-100 py-10 px-5">
            <ImageGalleryBlock title={translations.gallery?.title} />
         </section>
         <section className="bg-white py-10 px-5">
            <div className="container mx-auto">
               <h2 className="text-4xl font-medium py-8 text-center">{translations.gallery?.title2}</h2>
               <GalleryMansory items={galleryItems} />
            </div>
         </section>
      </>
   );
}
