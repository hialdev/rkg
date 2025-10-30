import { galleries } from "../../../mock";
import { useLocale } from "../../../contexts/LocaleContext";
import ImageGallery from "./ImageGallery";

interface TripItem {
   image: string;
   title: string;
   excerpt: string;
}

export default function ImageGalleryBlock({title}: {title?: string}){
   const { translations } = useLocale();
   
   // Transform galleries data to match TripItem interface for backward compatibility
   const transformedGalleries = galleries.map(({ media, ...rest }) => ({
      ...rest,
      image: media
   })) as unknown as TripItem[];

   return (
      <div className="container mx-auto">
         <h2 className="text-4xl font-medium">{title || translations.gallery.title}</h2>
         <ImageGallery items={transformedGalleries} />
      </div>
   )
}
