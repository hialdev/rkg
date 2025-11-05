import React, { useState, useEffect, useRef } from "react";

interface GalleryProgressBarProps {
   images: string[];
   altTexts?: string[];
}

const GalleryProgressBar: React.FC<GalleryProgressBarProps> = ({
   images = [],
   altTexts = [],
}) => {
   const [activeIndex, setActiveIndex] = useState(0);
   const [progress, setProgress] = useState(0);
   const timerRef = useRef<NodeJS.Timeout | null>(null);

   // Handle slide change
   const handleSlideChange = (index: number) => {
      setActiveIndex(index);
      setProgress(0);
   };

   // Reset progress when active index changes
   useEffect(() => {
      setProgress(0);

      if (timerRef.current) {
         clearInterval(timerRef.current);
      }

      // Create a new timer for progress
      timerRef.current = setInterval(() => {
         setProgress((prev) => {
            if (prev >= 100) {
               if (timerRef.current) {
                  clearInterval(timerRef.current);
               }
               // Move to next image when progress completes
               setActiveIndex((prevIndex) => {
                  const nextIndex = (prevIndex + 1) % images.length;
                  return nextIndex;
               });
               return 0; // Reset progress to 0 for the next image
            }
            return prev + 2; // Adjust speed of progress
         });
      }, 50); // Update every 50ms for smooth progress

      return () => {
         if (timerRef.current) {
            clearInterval(timerRef.current);
         }
      };
   }, [activeIndex, images.length]);

   // Clean up timer on unmount
   useEffect(() => {
      return () => {
         if (timerRef.current) {
            clearInterval(timerRef.current);
         }
      };
   }, []);

   if (images.length === 0) {
      return (
         <div className="w-full h-64 flex items-center justify-center bg-gray-200 rounded-lg">
            <p>No images available</p>
         </div>
      );
   }

   return (
      <div className="relative w-full mx-auto">
         {/* Main image display */}
         <div className="relative w-full aspect-video bg-gray-200 rounded-lg overflow-hidden">
            <img
               src={images[activeIndex]}
               alt={altTexts[activeIndex] || `Gallery image ${activeIndex + 1}`}
               className="w-full h-full object-cover"
            />

            {/* Progress bar in bottom left corner */}
            <div className="absolute bottom-4 left-4 w-24 h-1.5 bg-gray-600 rounded-full overflow-hidden">
               <div
                  className="h-full bg-white transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
               />
            </div>
         </div>

         {/* Thumbnail gallery */}
         <div
            className="mt-4 flex overflow-x-auto space-x-3 px-1 py-2 hide-scrollbar"
            style={{
               scrollbarWidth: "none",
               msOverflowStyle: "none",
               WebkitOverflowScrolling: "touch",
            }}
         >
            {images.map((image, index) => (
               <button
                  key={index}
                  onClick={() => handleSlideChange(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                     index === activeIndex
                        ? "border-red-500 scale-105"
                        : "border-gray-300 hover:border-gray-400"
                  }`}
               >
                  <img
                     src={image}
                     alt={altTexts[index] || `Thumbnail ${index + 1}`}
                     className="w-full h-full object-cover"
                  />
               </button>
            ))}
         </div>
      </div>
   );
};

export default GalleryProgressBar;
