import React from "react";
import { teams } from "../../../mock";
import TeamCard from "../../cards/TeamCard";

const TeamBox: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-5">
      {teams.map((team) => (
        <div key={team.id} className="col-span-12 sm:col-span-6 md:col-span-3">
          <TeamCard team={team} />
        </div>
      ))}
    </div>
  );
};

export default TeamBox;
