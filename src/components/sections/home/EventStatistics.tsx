import React from "react";
import { eventStats, eventTypes } from "../../../mock";
import EventTypeCard from "../../cards/EventTypeCard";
import EventStatCard from "../../cards/EventStatCard";

const EventStatistics: React.FC = () => {
  return (
    <>
      <section className="container mx-auto py-10">
        <div className="grid grid-cols-12">
          {eventTypes.map((et) => (
            <div key={et.id} className="col-span-6 md:col-span-3">
              <EventTypeCard eventType={et} />
            </div>
          ))}
        </div>
      </section>
      <section className="py-20 bg-stone-900">
        <div className="container mx-auto grid grid-cols-12 gap-5">
          {eventStats.map((et) => (
            <div key={et.id} className="col-span-6 md:col-span-3">
              <EventStatCard eventStat={et} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default EventStatistics;
