import React, { useEffect, useRef, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { getGalleries } from "../../../fetchers";

type Item = {
   image: string;
   title?: string;
};

type Props = {
   items?: Item[];
   gap?: number;
   height?: number;
};

const DEFAULT_ITEMS: Item[] = new Array(6).fill(0).map((_, i) => ({
   image: `https://picsum.photos/seed/${i + 1}/1600/900`,
   title: `${String(i + 1).padStart(3, "0")}`, // Format as 001, 002, etc.
}));

// Helper function to properly encode URLs with special characters
const encodeImageUrl = (baseUrl: string, imagePath: string): string => {
   // Split the path and encode each part separately to handle special characters like ()
   const encodedPath = imagePath
      .split("/")
      .map((part) => encodeURIComponent(part))
      .join("/");
   return `${baseUrl}/${encodedPath}`;
};

export default function SplitWidthSlider({
   items = DEFAULT_ITEMS,
   gap = 16,
   height = 520,
}: Props) {
   const containerRef = useRef<HTMLDivElement | null>(null);
   const prevRef = useRef<HTMLButtonElement | null>(null);
   const nextRef = useRef<HTMLButtonElement | null>(null);

   const [containerWidth, setContainerWidth] = useState<number>(0);
   const [hovered, setHovered] = useState<number | null>(null);
   const [isMobile, setIsMobile] = useState<boolean>(false);

   useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      const checkScreenSize = () => {
         setIsMobile(window.innerWidth < 768); // md breakpoint
      };

      checkScreenSize();

      const resize = () => {
         setContainerWidth(el.clientWidth);
         checkScreenSize();
      };

      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);
      window.addEventListener("resize", checkScreenSize);

      return () => {
         ro.disconnect();
         window.removeEventListener("resize", checkScreenSize);
      };
   }, []);

   // For mobile view, we don't use hover effects and show regular slider
   if (isMobile) {
      return (
         <Box
            ref={containerRef}
            sx={{ width: "100%", height }}
            className="relative"
         >
            <button
               ref={prevRef}
               type="button"
               aria-label="Previous"
               className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white text-black focus:outline-none shadow-lg hover:shadow-xl transition-shadow"
               style={{
                  border: "none",
                  WebkitTapHighlightColor: "transparent",
               }}
            >
               <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
               >
                  <path
                     d="M15 18L9 12L15 6"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  />
               </svg>
            </button>

            <button
               ref={nextRef}
               type="button"
               aria-label="Next"
               className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white text-black focus:outline-none shadow-lg hover:shadow-xl transition-shadow"
               style={{
                  border: "none",
                  WebkitTapHighlightColor: "transparent",
               }}
            >
               <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
               >
                  <path
                     d="M9 18L15 12L9 6"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  />
               </svg>
            </button>

            <Swiper
               modules={[Navigation, FreeMode]}
               navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
               }}
               slidesPerView="auto"
               spaceBetween={gap}
               className="h-full"
               freeMode={true}
               grabCursor={true}
            >
               {items.map((item, idx) => (
                  <SwiperSlide
                     key={idx}
                     className="!w-auto"
                     style={{
                        height: "100%",
                        transition: "width 300ms ease",
                     }}
                  >
                     <Paper
                        elevation={3}
                        className={`h-full overflow-hidden flex items-center justify-center relative`}
                        sx={{
                           display: "flex",
                           alignItems: "stretch",
                           justifyContent: "center",
                           height: "100%",
                        }}
                     >
                        <div
                           className={`w-full h-full bg-center bg-cover transition-all duration-300`}
                           style={{
                              backgroundImage: `url("${encodeImageUrl(
                                 import.meta.env.PUBLIC_API_URL,
                                 item.image
                              )}")`,
                              aspectRatio: "4 / 3", // Default aspect ratio for mobile
                              display: "block",
                           }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute left-3 bottom-3 text-white">
                           <Typography
                              variant="subtitle2"
                              sx={{ color: "#fff", fontWeight: "bold" }}
                           >
                              {item.title}
                           </Typography>
                        </div>
                     </Paper>
                  </SwiperSlide>
               ))}
            </Swiper>
         </Box>
      );
   }

   // For desktop view, we use the split width functionality
   const baseWidth =
      containerWidth > 0 ? Math.max((containerWidth - gap * 5) / 6, 80) : 120; // 6 items
   const shrinkWidth = 64; // approximately 4em

   const slideWidthStyle = (index: number) => {
      if (hovered === null) {
         return { width: `${baseWidth}px` };
      }
      if (hovered === index) {
         // Calculate width based on 16:9 aspect ratio using container height
         const calculatedWidth = height * (16 / 9);
         // Ensure the expanded width doesn't exceed available space
         const availableSpace = containerWidth - 5 * shrinkWidth - 5 * gap;
         const finalWidth = Math.min(calculatedWidth, availableSpace);
         return { width: `${finalWidth}px` };
      }
      return { width: `${shrinkWidth}px` };
   };

   return (
      <Box
         ref={containerRef}
         sx={{ width: "100%", height }}
         className="relative"
      >
         <button
            ref={prevRef}
            type="button"
            aria-label="Previous"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white text-black focus:outline-none shadow-lg hover:shadow-xl transition-shadow"
            style={{ border: "none", WebkitTapHighlightColor: "transparent" }}
         >
            <svg
               width="18"
               height="18"
               viewBox="0 0 24 24"
               fill="none"
               xmlns="http://www.w3.org/2000/svg"
            >
               <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
               />
            </svg>
         </button>

         <button
            ref={nextRef}
            type="button"
            aria-label="Next"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white text-black focus:outline-none shadow-lg hover:shadow-xl transition-shadow"
            style={{ border: "none", WebkitTapHighlightColor: "transparent" }}
         >
            <svg
               width="18"
               height="18"
               viewBox="0 0 24 24"
               fill="none"
               xmlns="http://www.w3.org/2000/svg"
            >
               <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
               />
            </svg>
         </button>

         <Swiper
            modules={[Navigation, FreeMode]}
            navigation={{
               prevEl: prevRef.current,
               nextEl: nextRef.current,
            }}
            slidesPerView="auto"
            spaceBetween={gap}
            className="h-full"
            freeMode={true}
            grabCursor={true}
         >
            {items.map((item, idx) => (
               <SwiperSlide
                  key={idx}
                  style={{
                     ...slideWidthStyle(idx),
                     height: "100%",
                     transition: "width 300ms ease",
                  }}
                  onMouseEnter={() => setHovered(idx)}
                  onMouseLeave={() => setHovered(null)}
               >
                  <Paper
                     elevation={3}
                     className={`h-full overflow-hidden flex items-center justify-center relative`}
                     sx={{
                        display: "flex",
                        alignItems: "stretch",
                        justifyContent: "center",
                        height: "100%",
                     }}
                  >
                     <div
                        className={`w-full h-full bg-center bg-cover transition-all duration-300`}
                        style={{
                           backgroundImage: `url("${encodeImageUrl(
                              import.meta.env.PUBLIC_API_URL,
                              item.image
                           )}")`,
                           aspectRatio: hovered === idx ? "16 / 9" : undefined,
                           display: "block",
                        }}
                     />
                     <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <div className="p-5 h-full flex flex-col items-center justify-center">
                           <div className="font-medium text-center text-2xl text-white">
                              {item.title}
                           </div>
                        </div>
                     </div>
                     <div className="absolute left-3 bottom-3 text-white z-10">
                        <Typography
                           variant="subtitle2"
                           sx={{ color: "#fff", fontWeight: "bold" }}
                        >
                           00{idx + 1}
                        </Typography>
                     </div>
                  </Paper>
               </SwiperSlide>
            ))}
         </Swiper>
      </Box>
   );
}
