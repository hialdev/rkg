import React from "react";
import type { teams } from "../../mock";
import type { Team } from "../../fetchers";

interface TeamCardProps {
   team: Team;
}

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
   return (
      <div className="relative group rounded-2xl overflow-hidden">
         <img
            src={import.meta.env.PUBLIC_API_URL+'/'+team.image}
            alt={`Image Team ${team.name}`}
            className="rounded-2xl bg-stone-200 grayscale group-hover:grayscale-0 object-cover aspect-[2/3] group-hover:scale-90 w-full group-hover:-rotate-6"
            width={354}
            height={472}
         />
         <div className="absolute top-0 end-0 start-0 bottom-0 group-focus:hidden flex group-hover:hidden flex-col justify-end p-5">
            <div className="flex flex-col gap-2 mb-4">
               <h3 className="leading-[2.5em]">
                  <span className="inline px-3 py-1 bg-white rounded text-stone-900 text-2xl font-medium">
                     {team.name}
                  </span>
               </h3>
            </div>
            <div className="flex self-start items-center gap-3 px-3 py-1 bg-white rounded-full text-stone-800">
               <span className="bg-stone-900 w-1 h-1 rounded-full"></span>
               <h4 className="text-lg font-medium text-stone-800">
                  {team.role}
               </h4>
            </div>
         </div>

         {/* Hover */}
         <div className="hidden group-hover:flex group-focus:flex absolute top-0 end-0 start-0 bottom-0 z-10 bg-transparent flex-col justify-end">
            <div className="bg-stone-800 p-7 rounded-xl text-white">
               <div
                  className="bg-stone-800 rounded-tl-xl text-white p-7 pt-10 max-w-[90%] -ms-7 -mt-15"
                  style={{
                     clipPath:
                        "polygon(0% 0%, 75% 0%, 100% 60%, 100% 100%, 0% 100%)",
                  }}
               >
                  <h3 className="text-white text-xl font-medium">
                     {team.name}
                  </h3>
                  <div className="flex items-center gap-3">
                     <span className="bg-white w-1 h-1 rounded-full"></span>
                     <h4 className="font-medium text-white">{team.role}</h4>
                  </div>
               </div>
               <div className="text-sm">{team.summary}</div>
            </div>
         </div>
      </div>
   );
};

export default TeamCard;
