import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { testimonials } from "../../../mock";
import { Icon } from "@iconify-icon/react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Slide } from "@mui/material";

export default function TestimonialBox() {
   const [selected, setSelected] = useState<(typeof testimonials)[0] | null>(
      null
   );

   const prevRef = useRef(null);
   const nextRef = useRef(null);

   return (
      <div className="relative">
         {/* Arrows */}
         <button
            ref={prevRef}
            className="absolute flex items-center justify-center cursor-pointer z-20 left-0 top-1/2 -translate-y-1/2 bg-white text-stone-700 shadow-md p-3 -ms-8 rounded-full hover:bg-stone-200 disabled:text-stone-500 disabled:cursor-auto"
         >
            <Icon icon="mdi:arrow-left" width={20} />
         </button>

         <button
            ref={nextRef}
            className="absolute flex items-center justify-center cursor-pointer z-20 right-0 top-1/2 -translate-y-1/2 bg-white text-stone-700 shadow-md p-3 -me-8 rounded-full hover:bg-stone-200 disabled:text-stone-500 disabled:cursor-auto"
         >
            <Icon icon="mdi:arrow-right" width={20} />
         </button>

         <Swiper
            modules={[Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
               768: { slidesPerView: 2 },
               1024: { slidesPerView: 3 },
            }}
            onInit={(swiper: any) => {
               swiper.params.navigation.prevEl = prevRef.current;
               swiper.params.navigation.nextEl = nextRef.current;
               swiper.navigation.init();
               swiper.navigation.update();
            }}
         >
            {testimonials.map((item) => (
               <SwiperSlide key={item.id}>
                  <div className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-4 h-full">
                     <div className="mt-auto flex items-center gap-3">
                        <img src={item.from_logo} className="h-6 opacity-70" />
                        <div>
                           <h4 className="font-semibold text-stone-900">
                              {item.name}
                           </h4>
                           <p className="text-xs text-stone-500">
                              {item.from_name}
                           </p>
                        </div>
                     </div>
                     
                     <div className="flex">
                        {Array(item.stars)
                           .fill(null)
                           .map((_, i) => (
                              <span key={i} className="text-yellow-500 text-lg">
                                 ★
                              </span>
                           ))}
                     </div>

                     <p className="text-stone-700 line-clamp-5">{item.quote}</p>

                     <button
                        onClick={() => setSelected(item)}
                        className="text-stone-500 text-start font-medium cursor-pointer hover:text-orange-500"
                     >
                        Read More
                     </button>
                  </div>
               </SwiperSlide>
            ))}
         </Swiper>

         {/* ✅ MUI Modal */}
         <Modal
            open={!!selected}
            onClose={() => setSelected(null)}
            closeAfterTransition
         >
            <Slide
               in={!!selected}
               direction="up"
               mountOnEnter
               unmountOnExit
               timeout={{
                  enter: 400,
                  exit: 300,
               }}
               easing={{
                  enter: "cubic-bezier(0.0, 0.0, 0.2, 1)",
                  exit: "cubic-bezier(0.4, 0.0, 1, 1)",
               }}
            >
               <Box className="bg-white rounded-xl p-6 outline-none relative w-[90%] md:w-[600px] mx-auto mt-[10vh]">
                  <button
                     onClick={() => setSelected(null)}
                     className="absolute top-3 right-3 cursor-pointer bg-stone-100 p-2 flex items-center justify-center rounded-full text-stone-500 hover:text-stone-800"
                  >
                     <Icon icon="mdi:close" width={20} />
                  </button>

                  <div className="flex gap-3 mb-4">
                     <img
                        src={selected?.from_logo}
                        className="h-6 opacity-70"
                     />
                     <h4 className="font-semibold text-lg">{selected?.name}</h4>
                  </div>

                  <p className="text-stone-700 leading-relaxed">
                     {selected?.quote}
                  </p>

                  <div className="flex mt-4">
                     {Array(selected?.stars ?? 0)
                        .fill(null)
                        .map((_, i) => (
                           <span key={i} className="text-yellow-500 text-xl">
                              ★
                           </span>
                        ))}
                  </div>

                  <p className="mt-2 text-xs text-stone-500">
                     Source: {selected?.from_name}
                  </p>
               </Box>
            </Slide>
         </Modal>
      </div>
   );
}
