import { atom } from "nanostores";

export const tripType = atom("all"); // string
export const selectedCityIds = atom<number[]>([]); // array of city.id

export function setTripType(type: string) {
   tripType.set(type);
}

export function setSelectedCities(cityIds: number[]) {
   selectedCityIds.set(cityIds);
}

export function resetSearch() {
   tripType.set("all");
   selectedCityIds.set([]);
}
