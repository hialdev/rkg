import React, { useState } from "react";
import {
   Box,
   Tabs,
   Tab,
   Typography,
   Button,
   Paper,
   Container,
} from "@mui/material";
import { stepEvents } from "../../../mock";

interface StepEventItem {
   id: string;
   title: string;
   description: string;
   content: string; // HTML content
}

interface StepEventProps {
   events: StepEventItem[];
}

const StepEvent: React.FC<StepEventProps> = ({ events }) => {
   // Handle empty events array
   if (events.length === 0 || !events) {
      events = stepEvents;
   }

   const [activeTab, setActiveTab] = useState<string>(
      events.length > 0 ? events[0]?.id || "" : ""
   );

   const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
      setActiveTab(newValue);
   };

   const activeEvent = events.find((event) => event.id === activeTab);

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
                        <div className={"p-4 rounded-xl  w-full text-start mb-3" + (activeTab === event.id ? " bg-yellow-400 text-black" : " bg-stone-500 text-white")}>
                           <h4 className="text-lg font-bold capitalize">Step {i+1} - {event.title}</h4>
                           <div className="capitalize">{event.description}</div>
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
                  <img src="https://placehold.co/720x480?text=StepEventImage" alt="Thumbnail step" className="block w-full mb-5 aspect-video rounded-2xl object-cover" />
                  <Typography typography={`h5`} fontWeight={`bold`} sx={{color: "white"}}>{activeEvent.title}</Typography>
                  <Box
                     sx={{ flexGrow: 1, mb: 3 }}
                     dangerouslySetInnerHTML={{
                        __html: activeEvent.content,
                     }}
                  />
                  <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                     <button
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
