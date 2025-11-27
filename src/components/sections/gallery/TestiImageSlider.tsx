import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import {
   Dialog,
   DialogContent,
   DialogActions,
   IconButton,
} from "@mui/material";
import {
   Close as CloseIcon,
   ArrowBack as ArrowBackIcon,
   ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface TestiImageSliderProps {
   images: string[];
   altTexts?: string[];
}

const TestiImageSlider: React.FC<TestiImageSliderProps> = ({
   images = [],
   altTexts = [],
}) => {
   const [activeIndex, setActiveIndex] = useState(0);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [modalSwiper, setModalSwiper] = useState<any>(null);

   // Handle click on image to open modal
   const handleImageClick = (index: number) => {
      setActiveIndex(index);
      setIsModalOpen(true);
   };

   // Handle next image in modal
   const handleNext = () => {
      if (modalSwiper) {
         modalSwiper.slideNext();
      }
   };

   // Handle previous image in modal
   const handlePrev = () => {
      if (modalSwiper) {
         modalSwiper.slidePrev();
      }
   };

   // Close modal
   const handleClose = () => {
      setIsModalOpen(false);
   };

   // Keyboard navigation for modal
   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (!isModalOpen) return;

         if (e.key === "Escape") {
            handleClose();
         } else if (e.key === "ArrowRight") {
            handleNext();
         } else if (e.key === "ArrowLeft") {
            handlePrev();
         }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
   }, [isModalOpen]);

   if (images.length === 0) {
      return (
         <div className="w-full h-64 flex items-center justify-center bg-gray-20 rounded-lg">
            <p>No images available</p>
         </div>
      );
   }

   return (
      <div className="w-full md:aspect-3/4 max-w-[100em] md:max-w-[15em]">
         {/* Main slider - no arrows, portrait ratio, autoplay */}
         <Swiper
            modules={[Autoplay]}
            spaceBetween={10}
            slidesPerView={1}
            autoplay={{
               delay: 3000,
               disableOnInteraction: false,
            }}
            loop={true}
            className="w-full aspect-3/4 max-h-[15em] md:max-h-[17em] lg:max-h-[20em]"
         >
            {images.map((image, index) => (
               <SwiperSlide key={index} className="!flex !items-center !justify-center">
                  <div
                     className="cursor-pointer w-full h-full"
                     onClick={() => handleImageClick(index)}
                  >
                     <img
                        src={image}
                        alt={
                           altTexts[index] || `Testimonial image ${index + 1}`
                        }
                        className="block aspect-3/4 rounded-lg object-cover w-full h-full"
                     />
                  </div>
               </SwiperSlide>
            ))}
         </Swiper>

         {/* Modal for enlarged view - with arrows, black background, close button, original ratio */}
         <Dialog
            open={isModalOpen}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
               style: {
                  margin: 0,
                  background: "#000",
                  boxShadow: "none",
                  overflow: "hidden",
                  maxWidth: "90vw",
                  maxHeight: "90vh",
               },
            }}
         >
            <DialogContent className="p-0 relative" style={{ height: "80vh" }}>

               <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={0}
                  slidesPerView={1}
                  initialSlide={activeIndex}
                  onSwiper={setModalSwiper}
                  navigation={{
                     nextEl: '.swiper-button-next',
                     prevEl: '.swiper-button-prev',
                  }}
                  pagination={{ 
                     clickable: true,
                     type: 'bullets',
                     el: '.swiper-pagination'
                  }}
                  loop={true}
                  className="w-full h-full"
               >
                  {images.map((image, index) => (
                     <SwiperSlide key={index} className="!flex !items-center !justify-center">
                        <div className="w-full h-full flex items-center justify-center p-4">
                           <img
                              src={image}
                              alt={
                                 altTexts[index] || `Testimonial image ${index + 1}`
                              }
                              className="object-contain max-h-[70vh] max-w-full"
                           />
                        </div>
                     </SwiperSlide>
                  ))}
                  
                  {/* Navigation buttons */}
                  <div className="swiper-button-prev absolute p-3 left-4 z-10 !w-10 !h-10 !flex !items-center !justify-center !bg-white/80 !rounded-full !text-black !opacity-100 !hover:bg-white">
                     <ArrowBackIcon />
                  </div>
                  <div className="swiper-button-next absolute p-3 right-4 z-10 !w-10 !h-10 !flex !items-center !justify-center !bg-white/80 !rounded-full !text-black !opacity-100 !hover:bg-white">
                     <ArrowForwardIcon />
                  </div>
                  
                  {/* Pagination */}
                  <div className="swiper-pagination absolute bottom-4 left-1/2 transform -translate-x-1/2 !z-20"></div>
               </Swiper>
            </DialogContent>

            <DialogActions className="justify-center p-4 pb-10 bg-black text-white">
               <span>
                  {images.length} Images
               </span>
            </DialogActions>
         </Dialog>
      </div>
   );
};

export default TestiImageSlider;
