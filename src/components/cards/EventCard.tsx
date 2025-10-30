import OfflineIcon from "../OfflineIcon";
import { formatDate } from "../../utils/parses/date";

interface Event {
   id: string | number;
   title: string;
   excerpt: string;
   company: string;
   created_at: string;
   image: string;
}

interface EventCardProps {
   event: Event;
}

export default function EventCard({ event }: EventCardProps) {
   return (
      <div>
         <div className="relative h-screen md:aspect-video md:h-auto overflow-hidden">
            <img
               src={event.image}
               alt={event.title + " Image"}
               width={1280}
               height={720}
               className="w-full h-full object-cover"
            />
            <div className="absolute top-0 end-0 start-0 bottom-0 flex flex-col justify-end bg-stone-950/50 p-10 text-white">
               <div>
                  <div className="text-sm font-medium mt-1">
                     {formatDate(event.created_at)}
                  </div>
                  <div className="pb-4">
                     <h3 className="text-2xl font-medium">{event.title}</h3>
                     <p className="text-sm mt-1">{event.excerpt}</p>
                  </div>
                  <hr className="w-20" />
                  <div className="flex items-center gap-2 mt-2">
                     <OfflineIcon name="company" size={20} />
                     <div className="font-medium leading-0 mt-1">{event.company}</div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
