import { Box, type SxProps } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

type ImageSliderProps = {
   images: string[];
   height?: number | string;
   autoplayDelay?: number;
   className?: string;
   sx?: SxProps;
};

export default function ImageSlider({
   images,
   height = "100vh",
   autoplayDelay = 3000,
   className,
   sx,
}: ImageSliderProps) {
   return (
      <Box
         className={className}
         sx={{
            width: "100%",
            height: "100vh",
            mx: "auto",
            overflow: "hidden",
            ...sx,
         }}
      >
         <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: autoplayDelay }}
            loop
         >
            {images.map((img, index) => (
               <SwiperSlide key={index}>
                  <Box
                     component="img"
                     src={import.meta.env.PUBLIC_API_URL+'/'+img}
                     alt={`Image Heroes ke `+index}
                     sx={{
                        width: "100%",
                        height,
                        objectFit: "cover",
                     }}
                  />
               </SwiperSlide>
            ))}
         </Swiper>
      </Box>
   );
}
