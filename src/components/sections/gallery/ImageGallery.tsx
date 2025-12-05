// src/components/ImageGallery.tsx
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
   Dialog,
   DialogContent,
   IconButton,
   useMediaQuery,
   useTheme,
   Typography,
} from "@mui/material";

import {
   Close as CloseIcon,
   ArrowBack,
   ArrowForward,
} from "@mui/icons-material";

interface ImageItem {
   image: string;
   title: string;
}

interface ImageGalleryProps {
   items: ImageItem[];
}

export default function ImageGallery({ items }: ImageGalleryProps) {
   const [open, setOpen] = useState(false);
   const [activeIndex, setActiveIndex] = useState(0);
   const theme = useTheme();
   const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

   const handleOpen = (index: number) => {
      setActiveIndex(index);
      setOpen(true);
   };

   const handleClose = () => setOpen(false);

   const handlePrev = () => {
      setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
   };

   const handleNext = () => {
      setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
   };

   return (
      <>
         {/* Thumbnail Gallery */}
         <div className="w-full">
            <Swiper
               modules={[Navigation, Pagination, Autoplay]}
               spaceBetween={16}
               slidesPerView={1}
               navigation
               autoplay
               pagination={{ clickable: true }}
               breakpoints={{
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 },
               }}
               className="pb-8 "
            >
               {items.map((item, index) => (
                  <SwiperSlide key={index}>
                     <div
                        className="cursor-pointer rounded-xl overflow-hidden my-10 hover:shadow-md transition-shadow"
                        onClick={() => handleOpen(index)}
                     >
                        <img
                           src={import.meta.env.PUBLIC_API_URL+'/'+item.image}
                           alt={item.title}
                           className="w-full h-48 object-cover"
                        />
                        
                     </div>
                  </SwiperSlide>
               ))}
            </Swiper>
         </div>

         {/* Zoom Modal */}
         <Dialog
            open={open}
            onClose={handleClose}
            fullScreen={fullScreen}
            maxWidth="md"
            fullWidth
            sx={{
               "& .MuiDialog-container": {
                  alignItems: "center",
               },
               "& .MuiPaper-root": {
                  margin: 0,
                  width: "100%",
                  maxWidth: "90vw",
                  height: "90vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#212121",
                  boxShadow: "none",
                  borderRadius:5,
               },
            }}
         >
            <DialogContent
               sx={{
                  position: "relative",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
               }}
            >
               {/* Close Button */}
               <IconButton
                  onClick={handleClose}
                  sx={{
                     position: "absolute",
                     top: 8,
                     right: 8,
                     color: "white",
                     backgroundColor: "rgba(0,0,0,0.5)",
                     "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                     zIndex: 10,
                  }}
               >
                  <CloseIcon />
               </IconButton>

               {/* Navigation Prev */}
               <IconButton
                  onClick={handlePrev}
                  sx={{
                     position: "absolute",
                     left: 16,
                     color: "white",
                     backgroundColor: "rgba(0,0,0,0.5)",
                     "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                     zIndex: 10,
                  }}
               >
                  <ArrowBack />
               </IconButton>

               {/* Navigation Next */}
               <IconButton
                  onClick={handleNext}
                  sx={{
                     position: "absolute",
                     right: 16,
                     color: "white",
                     backgroundColor: "rgba(0,0,0,0.5)",
                     "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                     zIndex: 10,
                  }}
               >
                  <ArrowForward />
               </IconButton>

               {/* Image */}
               <img
                  src={items[activeIndex]?.image ? import.meta.env.PUBLIC_API_URL+items[activeIndex]?.image : ""}
                  alt={items[activeIndex]?.title}
                  className="w-full h-full object-contain"
               />

               {/* Caption (opsional) */}
               <div
                  style={{
                     position: "absolute",
                     bottom: 16,
                     left: 0,
                     right: 0,
                     textAlign: "center",
                     color: "white",
                     textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                  }}
               >
                  <Typography variant="body2">
                     {items[activeIndex]?.title}
                  </Typography>
               </div>
            </DialogContent>
         </Dialog>
      </>
   );
}
