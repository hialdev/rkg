import React from "react";
import { Icon } from "@iconify-icon/react";
import type { eventTypes } from "../../mock";

interface EventTypeCardProps {
  eventType: typeof eventTypes[0];
}

const EventTypeCard: React.FC<EventTypeCardProps> = ({ eventType }) => {
  return (
    <div className="flex flex-col items-center p-10 rounded-xl group hover:bg-red-500 hover:text-white transition-all ease-in-out">
      <Icon 
        icon={eventType.icon_id} 
        className="text-yellow-500 group-hover:text-white transition-all ease-in-out" 
        width={90} 
      />
      <h4 className="text-xl font-bold text-center">{eventType.title}</h4>
    </div>
  );
};

export default EventTypeCard;
