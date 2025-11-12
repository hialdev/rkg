import React, { useState } from "react";
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

interface GalleryItem {
   id: number;
   media: string;
   title?: string;
   excerpt?: string;
   type?: "image" | "video";
}

interface GalleryMansoryProps {
   items: GalleryItem[];
}

const GalleryMansory: React.FC<GalleryMansoryProps> = ({ items }) => {
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
      <div className="container mx-auto">
         {/* Masonry Gallery */}
         <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
            {items.map((item, index) => (
               <div
                  key={item.id || index}
                  className="mb-4 break-inside-avoid group cursor-pointer"
                  onClick={() => handleOpen(index)}
               >
                  <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                     {item.type === "video" ? (
                        <div className="relative aspect-square bg-gray-200 rounded-xl flex items-center justify-center">
                           <video
                              src={item.media}
                              className="w-full h-full object-cover rounded-xl"
                              muted
                              loop
                              playsInline
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                              <div className="text-white">
                                 <h3 className="font-semibold text-sm">
                                    {item.title}
                                 </h3>
                              </div>
                           </div>
                           <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              Video
                           </div>
                        </div>
                     ) : (
                        <div className="relative">
                           <img
                              src={item.media}
                              alt={item.title}
                              className="w-full h-auto object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="text-white">
                                 <h3 className="font-semibold text-sm">
                                    {item.title}
                                 </h3>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            ))}
         </div>

         {/* Modal Gallery */}
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
                  borderRadius: 2,
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

               {/* Media Content */}
               {items[activeIndex]?.type === "video" ? (
                  <video
                     src={items[activeIndex]?.media}
                     autoPlay
                     controls
                     className="w-full h-full object-contain max-h-[90vh]"
                  />
               ) : (
                  <img
                     src={items[activeIndex]?.media}
                     alt={items[activeIndex]?.title}
                     className="w-full h-full object-contain"
                  />
               )}

               {/* Caption */}
               <div
                  style={{
                     position: "absolute",
                     bottom: 16,
                     left: 0,
                     right: 0,
                     textAlign: "center",
                     color: "white",
                     textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                     zIndex: 5,
                  }}
               >
                  <Typography variant="h6" component="h3" className="font-bold">
                     {items[activeIndex]?.title}
                  </Typography>
                  <Typography variant="body2" className="mt-2">
                     {items[activeIndex]?.excerpt}
                  </Typography>
               </div>
            </DialogContent>
         </Dialog>
      </div>
   );
};

export default GalleryMansory;
