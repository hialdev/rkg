import React, { useEffect, useState } from "react";
import { eventStats, eventTypes } from "../../../mock";
import EventTypeCard from "../../cards/EventTypeCard";
import EventStatCard from "../../cards/EventStatCard";
import { getSetting, type Setting } from "../../../fetchers";
type Stat = {
         projects_done: Setting,
         satisfactory_rate: Setting,
         customer_happy: Setting,
         team_expert: Setting,

         typeIcon: Setting,
         typeTitle: Setting,
         typeIcon2: Setting,
         typeTitle2: Setting,
         typeIcon3: Setting,
         typeTitle3: Setting,
         typeIcon4: Setting,
         typeTitle4: Setting,
      };
const EventStatistics: React.FC = () => {
   const [stat, setStat] = useState<Stat | null>()
   const fetchStat = async () => {
      const statProject = await getSetting("stat.project");
      const statHappy = await getSetting("stat.happy");
      const statExpert = await getSetting("stat.expert");
      const statSatisfactory = await getSetting("stat.satisfactory");

      const typeIcon = await getSetting("home.event-type.icon");
      const typeTitle = await getSetting("home.event-type.title");
      const typeIcon2 = await getSetting("home.event-type.icon2");
      const typeTitle2 = await getSetting("home.event-type.title2");
      const typeIcon3 = await getSetting("home.event-type.icon3");
      const typeTitle3 = await getSetting("home.event-type.title3");
      const typeIcon4 = await getSetting("home.event-type.icon4");
      const typeTitle4 = await getSetting("home.event-type.title4");

      const statData: Stat = {
         projects_done: statProject.data.data,
         satisfactory_rate: statSatisfactory.data.data,
         customer_happy: statHappy.data.data,
         team_expert: statExpert.data.data,

         typeIcon: typeIcon.data.data,
         typeTitle: typeTitle.data.data,
         typeIcon2: typeIcon2.data.data,
         typeTitle2: typeTitle2.data.data,
         typeIcon3: typeIcon3.data.data,
         typeTitle3: typeTitle3.data.data,
         typeIcon4: typeIcon4.data.data,
         typeTitle4: typeTitle4.data.data,
      };

      setStat(statData)
   };

   useEffect(() => {
      fetchStat();
   }, [])
   return (
      <>
         <section className="container mx-auto py-10">
            <div className="grid grid-cols-12">
               <div className="col-span-6 md:col-span-3">
                  <EventTypeCard eventType={{title:stat?.typeTitle.set_value ?? eventTypes[0].title, icon_id:stat?.typeIcon.set_value ?? eventTypes[0].icon_id, id:1}} />
               </div>
               <div className="col-span-6 md:col-span-3">
                  <EventTypeCard eventType={{title:stat?.typeTitle2.set_value ?? eventTypes[1].title, icon_id:stat?.typeIcon2.set_value ?? eventTypes[1].icon_id, id:1}} />
               </div>
               <div className="col-span-6 md:col-span-3">
                  <EventTypeCard eventType={{title:stat?.typeTitle3.set_value ?? eventTypes[2].title, icon_id:stat?.typeIcon3.set_value ?? eventTypes[2].icon_id, id:1}} />
               </div>
               <div className="col-span-6 md:col-span-3">
                  <EventTypeCard eventType={{title:stat?.typeTitle4.set_value ?? eventTypes[3].title, icon_id:stat?.typeIcon4.set_value ?? eventTypes[3].icon_id, id:1}} />
               </div>
            </div>
         </section>
         <section className="py-20 bg-stone-900">
            <div className="container mx-auto grid grid-cols-12 gap-5">
               <div className="col-span-6 md:col-span-3">
                  <EventStatCard eventStat={{title:eventStats[0].title, unit_count:eventStats[0].unit_count, icon_id:eventStats[0].icon_id, id:eventStats[0].id, count: Number(stat?.projects_done.set_value) ?? 100}} />
               </div>
               <div className="col-span-6 md:col-span-3">
                  <EventStatCard eventStat={{title:eventStats[1].title, unit_count:eventStats[1].unit_count, icon_id:eventStats[1].icon_id, id:eventStats[1].id, count: Number(stat?.satisfactory_rate.set_value) ?? 100}} />
               </div>
               <div className="col-span-6 md:col-span-3">
                  <EventStatCard eventStat={{title:eventStats[2].title, unit_count:eventStats[2].unit_count, icon_id:eventStats[2].icon_id, id:eventStats[2].id, count: Number(stat?.customer_happy.set_value) ?? 100}} />
               </div>
               <div className="col-span-6 md:col-span-3">
                  <EventStatCard eventStat={{title:eventStats[3].title, unit_count:eventStats[3].unit_count, icon_id:eventStats[3].icon_id, id:eventStats[3].id, count: Number(stat?.team_expert.set_value) ?? 100}} />
               </div>
            </div>
         </section>
      </>
   );
};

export default EventStatistics;
