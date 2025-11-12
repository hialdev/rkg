import React, { useState } from "react";
import { Tabs, Tab, Typography, Box, Paper } from "@mui/material";
import { Icon } from "@iconify-icon/react";

interface Activity {
   time: string;
   description: string;
}

interface DayItinerary {
   day: number;
   activities: Activity[];
}

interface ItineraryPathProps {
   itinerary: DayItinerary[];
}

const ItineraryPath: React.FC<ItineraryPathProps> = ({ itinerary }) => {
   const [activeTab, setActiveTab] = useState(0);

   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
      setActiveTab(newValue);
   };

   return (
      <Box className="w-full">
         <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            className=""
         >
            {itinerary.map((dayItinerary) => (
               <Tab
                  key={dayItinerary.day}
                  label={`Day ${dayItinerary.day}`}
                  className="font-bold"
               />
            ))}
         </Tabs>

         {itinerary.map((dayItinerary, index) => (
            <TabPanel key={index} value={activeTab} index={index}>
               <Paper elevation={2} className="p-4 bg-white">
                  {dayItinerary.activities.map((activity, activityIndex) => (
                     <Box
                        key={activityIndex}
                        className="flex items-start gap-3 mb-3 last:mb-0"
                     >
                        <Icon
                           icon="mdi:access-time"
                           className="text-red-600 mt-1 flex-shrink-0"
                           width="20"
                           height="20"
                        />
                        <Box>
                           <Typography
                              variant="subtitle1"
                              className="font-medium"
                           >
                              {activity.time}
                           </Typography>
                           <Typography
                              variant="body2"
                              className="text-gray-700"
                           >
                              {activity.description}
                           </Typography>
                        </Box>
                     </Box>
                  ))}
               </Paper>
            </TabPanel>
         ))}
      </Box>
   );
};

// TabPanel component to manage tab content visibility
const TabPanel: React.FC<{
   children: React.ReactNode;
   value: number;
   index: number;
}> = ({ children, value, index }) => {
   return (
      <div role="tabpanel" hidden={value !== index}>
         {value === index && <Box>{children}</Box>}
      </div>
   );
};

export default ItineraryPath;
