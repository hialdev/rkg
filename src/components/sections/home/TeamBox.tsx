import React, { useEffect, useState } from "react";
import { teams } from "../../../mock";
import TeamCard from "../../cards/TeamCard";
import { getTeams, type Team } from "../../../fetchers";

const TeamBox: React.FC = () => {
   const [teams, setTeams] = useState<Team[] | []>([])
   const fetchTeams = async () => {
      const res = await getTeams()
      setTeams(res.data.data)
   }
   useEffect(() => {
      fetchTeams()
   }, [])
   return (
      <div className="grid grid-cols-12 gap-5">
         {teams.map((team) => (
            <div
               key={team.id}
               className="col-span-12 sm:col-span-6 md:col-span-3"
            >
               <TeamCard team={team} />
            </div>
         ))}
      </div>
   );
};

export default TeamBox;
