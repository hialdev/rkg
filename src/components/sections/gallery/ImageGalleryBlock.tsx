import { useLocale } from "../../../contexts/LocaleContext";
import { getGalleries, type GalleryResponse } from "../../../fetchers";
import ImageGallery from "./ImageGallery";
import { useEffect, useState } from "react";

export default function ImageGalleryBlock({title}: {title?: string}){
   const { translations } = useLocale();
   const [galleries, setGalleries] = useState<GalleryResponse>()
   
   const fetchGallery = async () => {
      const res = await getGalleries()
      setGalleries(res.data.data)
   }

   useEffect(() => {
      fetchGallery()
      console.log(galleries)
   }, [])

   return (
      <div className="container mx-auto">
         <h2 className="text-4xl font-medium">{title || translations.gallery.title}</h2>
         <ImageGallery items={galleries? galleries.sliders : []} />
      </div>
   )
}
