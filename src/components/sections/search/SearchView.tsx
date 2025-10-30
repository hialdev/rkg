import HeroFilter from "../../forms/generals/HeroFilter";
import FilteredTrips from "./FilteredTrips";

export default function SearchView() {
   const queryParams = new URLSearchParams(window.location.search);

   const initialCities = queryParams.get("cities")?.split(",") || [];
   const initialTripType = queryParams.get("tripType") || "all";
   
   return (
      <>
         <section className="bg-stone-100 py-10 px-3">
            <HeroFilter
               initialCities={initialCities}
               initialTripType={initialTripType}
            />
         </section>
         <section className="container mx-auto py-15 px-3">
            <FilteredTrips
               initialCities={initialCities}
               initialTripType={initialTripType}
            />
         </section>
      </>
   );
}
