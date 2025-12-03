import React, { useEffect, useState } from "react";
import {
   Box,
   Tabs,
   Tab,
   Typography,
   Button,
   Paper,
   Container,
} from "@mui/material";
import { getSetting, type EventPlan } from "../../../fetchers";

interface StepEventProps {
   events: EventPlan[];
}

const StepEvent: React.FC<StepEventProps> = ({ events }) => {
   const [activeTab, setActiveTab] = useState<string>(
      events.length > 0 ? events[0]?.id || "" : ""
   );
   const [whatsapp, setWhatsapp] = useState("6289671052050");

   const fetchWhatsapp = async () => {
      const res = await getSetting("com.whatsapp");
      setWhatsapp(
         res.data.data.set_value ? res.data.data.set_value : "6289671052050"
      );
   };

   useEffect(() => {
      fetchWhatsapp();
   }, []);

   const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
      setActiveTab(newValue);
   };

   const activeEvent = events.find((event) => event.id === activeTab);

   const sendMessage = () => {
      const message = `
         Hello, I'm interested for Event Organizer service ! Please give me more information..📩
      `;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodedMessage}`;

      window.open(whatsappUrl, "_blank");
   };

   return (
      <Box
         sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
         }}
      >
         {/* Left Column - Tabs */}
         <Box sx={{ width: { xs: "100%", md: "40%" } }}>
            <Tabs
               orientation="vertical"
               variant="scrollable"
               value={activeTab}
               onChange={handleTabChange}
               sx={{
                  border: "none",
                  "& .MuiTabs-flexContainer": {
                     flexDirection: "column",
                  },
                  "& .MuiTabs-indicator": {
                     display: "none",
                  },
               }}
            >
               {events.map((event, i) => (
                  <Tab
                     key={event.id}
                     value={event.id}
                     label={
                        <div
                           className={
                              "p-4 rounded-xl  w-full text-start mb-3" +
                              (activeTab === event.id
                                 ? " bg-yellow-400 text-black"
                                 : " bg-stone-500 text-white")
                           }
                        >
                           <h4 className="text-lg font-bold capitalize">
                              Step {i + 1} - {event.title}
                           </h4>
                           <div className="capitalize">{event.subtitle}</div>
                        </div>
                     }
                     sx={{
                        minHeight: "auto",
                        alignItems: "flex-start",
                        padding: 0,
                        margin: 0,
                     }}
                  />
               ))}
            </Tabs>
         </Box>

         {/* Right Column - Content */}
         <Box
            sx={{
               width: "100%",
               display: "flex",
               flexDirection: "column",
            }}
         >
            {activeEvent && (
               <Paper
                  sx={{
                     height: "100%",
                     display: "flex",
                     flexDirection: "column",
                     backgroundColor: "black",
                     color: "white",
                  }}
               >
                  <img
                     src={
                        activeEvent.image
                           ? import.meta.env.PUBLIC_API_URL +
                             "/" +
                             activeEvent.image
                           : "https://placehold.co/720x480?text=StepEventImage"
                     }
                     alt="Thumbnail step"
                     className={
                        (activeEvent.image ? "block" : "hidden") +
                        " w-full mb-5 aspect-video rounded-2xl object-cover"
                     }
                  />
                  <Typography
                     typography={`h5`}
                     fontWeight={`bold`}
                     sx={{ color: "white" }}
                  >
                     {activeEvent.title}
                  </Typography>
                  <Box
                     sx={{ flexGrow: 1, mb: 3 }}
                     dangerouslySetInnerHTML={{
                        __html: activeEvent.content ?? "",
                     }}
                  />
                  <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                     <button
                        onClick={sendMessage}
                        className="w-full border-4 border-yellow-500 rounded-full px-6 py-3 hover:bg-yellow-500 hover:text-black cursor-pointer font-medium"
                     >
                        Talk to Us
                     </button>
                  </Box>
               </Paper>
            )}
         </Box>
      </Box>
   );
};

export default StepEvent;
