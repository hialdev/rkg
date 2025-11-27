// stores/search.ts
import { atom } from "nanostores";

export const tripType = atom("all");
export const selectedLocations = atom<string[]>([]); // ✅ Ganti dari selectedCityIds

export function setTripType(type: string) {
   tripType.set(type);
}

export function setSelectedLocations(locations: string[]) {
   selectedLocations.set(locations);
}

export function resetSearch() {
   tripType.set("all");
   selectedLocations.set([]);
}
