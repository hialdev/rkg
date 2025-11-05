import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import type { destinations } from "../../../mock";

type Destination = (typeof destinations)[0];
interface DestinationSliderProps {
   destinations: Destination[];
}

const DestinationSlider: React.FC<DestinationSliderProps> = ({
   destinations,
}) => {
   const [selectedDestination, setSelectedDestination] =
      useState<Destination | null>(null);
   const [isModalOpen, setIsModalOpen] = useState(false);

   const handleDestinationClick = (destination: Destination) => {
      setSelectedDestination(destination);
      setIsModalOpen(true);
   };

   const handleCloseModal = () => {
      setIsModalOpen(false);
      setSelectedDestination(null);
   };

   if (destinations.length === 0) {
      return (
         <div className="w-full h-64 flex items-center justify-center bg-gray-200 rounded-lg">
            <p>No destinations available</p>
         </div>
      );
   }

   return (
      <div className="w-full">
         {/* Destination slider */}
         <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            breakpoints={{
               640: {
                  slidesPerView: 1,
               },
               768: {
                  slidesPerView: 2,
               },
               1024: {
                  slidesPerView: 3,
               },
            }}
            className="w-full"
         >
            {destinations.map((destination) => (
               <SwiperSlide key={destination.id}>
                  <div
                     className="bg-gradient-to-br from-orange-100 to-orange-300 p-5 rounded-2xl cursor-pointer"
                     onClick={() => handleDestinationClick(destination)}
                  >
                     <div className="flex items-center gap-3 justify-between mb-4 border-b-2 pb-4">
                        <h3 className="text-2xl font-medium text-stone-900">
                           {destination.title}
                        </h3>
                     </div>
                     <div className="">
                        <img
                           src={destination.image}
                           alt={destination.title}
                           className="aspect-video rounded-xl w-full object-cover"
                        />
                     </div>
                  </div>
               </SwiperSlide>
            ))}
         </Swiper>

         {/* Modal for destination details */}
         <Dialog
            open={isModalOpen}
            onClose={handleCloseModal}
            maxWidth="md"
            fullWidth
            PaperProps={{
               style: {
                  margin: 0,
                  background: "white",
                  boxShadow: "none",
                  overflow: "hidden",
                  maxWidth: "90vw",
                  maxHeight: "90vh",
                  borderRadius: 20,
               },
            }}
         >
            <DialogContent className="p-0 relative">
               <IconButton
                  aria-label="close"
                  onClick={handleCloseModal}
                  className="absolute top-0 end-0 z-20 bg-stone-100 hover:bg-white text-gray-800 rounded-full"
                  style={{ width: 40, height: 40, zIndex: 20 }}
               >
                  <CloseIcon />
               </IconButton>

               {selectedDestination && (
                  <div className="flex flex-col md:flex-row gap-5 items-center">
                     <div className="">
                        <img
                           src={selectedDestination.image}
                           alt={selectedDestination.title}
                           className="w-full rounded-2xl mt-4 object-cover"
                        />
                     </div>

                     <div className="p-6">
                        <h2 className="text-xl font-medium text-stone-900 mb-2">
                           {selectedDestination.title}
                        </h2>
                        <div className="prose prose-stone max-w-none">
                           <p className="text-stone-700">
                              {selectedDestination.description}
                           </p>
                        </div>
                     </div>
                  </div>
               )}
            </DialogContent>
         </Dialog>
      </div>
   );
};

export default DestinationSlider;
