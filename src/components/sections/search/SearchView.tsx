import HeroFilter from "../../forms/generals/HeroFilter";
import FilteredTrips from "./FilteredTrips";

export default function SearchView() {
   const queryParams = new URLSearchParams(window.location.search);
   let initialLocations = queryParams.get("locations")?.split(",") || [];
   let initialTripType = queryParams.get("tripType") || "all";

   let urlNow = window.location.pathname.split("/")
   if (urlNow.length > 2 && urlNow[1] == "services") {
      initialTripType = urlNow[2]
   }
   
   return (
      <>
         <section className="bg-stone-100 py-10 px-3">
            <HeroFilter
               initialLocations={initialLocations}
               initialTripType={initialTripType}
            />
         </section>
         <section className="container mx-auto py-15 px-3">
            <FilteredTrips
               initialLocations={initialLocations}
               initialTripType={initialTripType}
            />
         </section>
      </>
   );
}
