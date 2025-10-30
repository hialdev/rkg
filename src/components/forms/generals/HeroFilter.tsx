import React from "react";
import {
   Autocomplete,
   Box,
   Button,
   FormControl,
   InputLabel,
   MenuItem,
   Select,
   TextField,
   Typography,
   type SelectChangeEvent,
} from "@mui/material";
import { cities, countries, tripTypes } from "../../../mock";
import { Icon } from "@iconify-icon/react";
import { useStore } from "@nanostores/react";
import {
   tripType,
   selectedCityIds,
   setTripType,
   setSelectedCities,
} from "../../../stores/search";
import { useLocale } from "../../../contexts/LocaleContext";

interface HeroFilterProps {
   initialCities?: string[];
   initialTripType?: string;
}

export default function HeroFilter({
   initialCities = [],
   initialTripType = "all",
}: HeroFilterProps) {
   const { translations } = useLocale();
   const currentTripType = useStore(tripType);
   const currentCities = useStore(selectedCityIds);

   const [value, setValue] = React.useState(currentTripType);
   const [initialized, setInitialized] = React.useState(false);

   React.useEffect(() => {
      if (!initialized) {
         let citiesFromUrl: string[] = initialCities;
         let tripTypeFromUrl: string = initialTripType;

         // Jika props kosong, fallback ke query string
         if (citiesFromUrl.length === 0 && typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            citiesFromUrl =
               params.get("cities")?.split(",").filter(Boolean) || [];
            tripTypeFromUrl = params.get("tripType") || "all";
         }

         console.log("HeroFilter init:");
         console.log("citiesFromUrl:", citiesFromUrl);
         console.log("tripTypeFromUrl:", tripTypeFromUrl);

         const numericCities = citiesFromUrl
            .map((id) => {
               const num = Number(id);
               if (isNaN(num)) console.warn("Invalid city id:", id);
               return num;
            })
            .filter((id) => id > 0);

         setSelectedCities(numericCities);
         setTripType(tripTypeFromUrl);
         setValue(tripTypeFromUrl);
         setInitialized(true);
      }
   }, [initialized, initialCities, initialTripType]);

   React.useEffect(() => {
      setValue(currentTripType);
   }, [currentTripType]);

   const handleChange = (event: SelectChangeEvent<string>) => {
      const newValue = event.target.value;
      setValue(newValue);
      setTripType(newValue);
   };

   const handleSearch = () => {
      const citiesParam = selectedCityIds.get().join(",");
      const tripTypeParam = tripType.get();
      window.location.href = `/search?cities=${citiesParam}&tripType=${tripTypeParam}`;
   };

   if (!initialized) {
      return (
         <Box className="flex flex-wrap w-full max-w-screen md:max-w-[auto] md:w-auto items-center gap-2 bg-white rounded-md md:rounded-full overflow-hidden md:px-2 ps-4 py-10 md:py-2 md:mx-20 md:my-4 shadow-sm">
            <div className="w-full md:w-[400px] h-12 bg-gray-100 rounded-full animate-pulse"></div>
            <div className="w-32 h-12 bg-gray-100 rounded-full animate-pulse"></div>
            <div className="w-12 h-12 bg-gray-100 rounded-full animate-pulse"></div>
         </Box>
      );
   }

   return (
      <Box className="flex flex-wrap w-full max-w-screen md:max-w-fit md:mx-auto md:w-auto items-center gap-2 bg-white rounded-md md:rounded-full overflow-hidden md:px-2 ps-4 py-10 md:py-2 md:my-4 shadow-sm">
         {/* AUTOCOMPLETE */}
         <Autocomplete
            id="country-select-demo"
            sx={{ width: { xs: "100%", md: 400 }, borderRadius: 30 }}
            options={cities.map((city) => ({
               ...city,
               countryName:
                  countries.find((c) => c.id === city.country_id)?.name || "",
            }))}
            multiple
            getOptionLabel={(option: any) =>
               `${option.name}, ${option.countryName}`
            }
            filterOptions={(options, { inputValue }) => {
               const input = inputValue.toLowerCase();
               return options.filter(
                  (option) =>
                     option.name.toLowerCase().includes(input) ||
                     option.countryName.toLowerCase().includes(input)
               );
            }}
            value={cities
               .filter((c) => currentCities.includes(c.id))
               .map((city) => ({
                  ...city,
                  countryName:
                     countries.find((c) => c.id === city.country_id)?.name ||
                     "",
               }))}
            onChange={(e, newValue) =>
               setSelectedCities(newValue.map((c) => c.id))
            }
            renderOption={(props: any, option: any) => {
               const { key, ...optionProps } = props;
               return (
                  <Box
                     key={key}
                     component="li"
                     sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                     {...optionProps}
                  >
                     <Box>
                        <Box className="flex items-center gap-2">
                           <Icon icon={`solar:map-point-linear`} width={20} />
                           <Typography
                              typography={`body`}
                              className="whitespace-nowrap"
                           >
                              {option.name}
                           </Typography>
                           <Typography
                              typography={`body2`}
                              className="whitespace-nowrap text-stone-400"
                           >
                              {" "}
                              - {option.countryName}
                           </Typography>
                        </Box>
                        <Typography
                           typography={`body2`}
                           className="italic text-stone-600 py-2"
                        >
                           {option.description}
                        </Typography>
                     </Box>
                  </Box>
               );
            }}
            renderInput={(params: any) => (
               <TextField
                  {...params}
                  label={translations.filter?.title}
                  InputLabelProps={{ sx: { "&.MuiInputLabel-shrink": {} } }}
                  InputProps={{
                     ...params.InputProps,
                     sx: {
                        "& fieldset": { border: "none" },
                        "&:hover fieldset": { border: "none" },
                        "&.Mui-focused fieldset": { border: "none" },
                     },
                  }}
               />
            )}
         />

         {/* SELECT */}
         <FormControl
            variant="outlined"
            sx={{
               m: 1,
               minWidth: { xs: "70%", md: 140 },
               "& .MuiOutlinedInput-root": {
                  "& fieldset": { border: "none" },
                  "&:hover fieldset": { border: "none" },
                  "&.Mui-focused fieldset": { border: "none" },
               },
            }}
         >
            <InputLabel sx={{ "&.MuiInputLabel-shrink": {} }}>
               {translations.label?.typeTrip || "Type Trip"}
            </InputLabel>
            <Select value={value} onChange={handleChange} displayEmpty>
               <MenuItem value="all">
                  {translations.label?.all || "All"}
               </MenuItem>
               {tripTypes.map((trip) => (
                  <MenuItem key={trip.name} value={trip.name}>
                     {trip.label}
                  </MenuItem>
               ))}
            </Select>
         </FormControl>

         <Button
            variant="contained"
            color="error"
            sx={{ padding: "0", aspectRatio: "1/1", borderRadius: 99 }}
            onClick={handleSearch} // redirect ke /search
         >
            <Icon icon={`solar:magnifer-line-duotone`} width={25} />
         </Button>
      </Box>
   );
}
