// HeroFilter.tsx
import React, { useEffect, useMemo, useState } from "react";
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
import { tripTypes } from "../../../mock";
import { Icon } from "@iconify-icon/react";
import { useStore } from "@nanostores/react";
import {
   tripType,
   selectedLocations, // ✅
   setTripType,
   setSelectedLocations, // ✅
} from "../../../stores/search";
import { useLocale } from "../../../contexts/LocaleContext";
import { getLocations } from "../../../fetchers/webprofile";

interface HeroFilterProps {
   initialLocations?: string[]; // ✅ ganti dari initialCities
   initialTripType?: string;
}

export default function HeroFilter({
   initialLocations = [], // ✅
   initialTripType = "all",
}: HeroFilterProps) {
   const { translations } = useLocale();
   const currentTripType = useStore(tripType);
   const currentLocations = useStore(selectedLocations); // ✅

   const [value, setValue] = React.useState(currentTripType);
   const [initialized, setInitialized] = React.useState(false);
   const [locationOptions, setLocationOptions] = useState<
      { label: string; location: string; country: string }[]
   >([]);
   const [loading, setLoading] = useState(true);

   // Fetch locations
   useEffect(() => {
      const fetchLocations = async () => {
         try {
            const res = await getLocations();
            const apiLocations = res.data.data;

            const options = apiLocations.map((loc) => ({
               label: `${loc.location}, ${loc.country_}`,
               location: loc.location,
               country: loc.country_,
            }));
            setTripType(initialTripType)
            setLocationOptions(options);
         } catch (error) {
            console.error("Failed to fetch locations:", error);
         } finally {
            setLoading(false);
         }
      };
      fetchLocations();
   }, []);

   // Initialize from URL or props
   useEffect(() => {
      if (!initialized && !loading) {
         let locationsFromUrl: string[] = initialLocations;
         let tripTypeFromUrl: string = initialTripType;

         if (locationsFromUrl.length === 0 && typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            locationsFromUrl = params.get("cities")?.split(",").filter(Boolean) || [];
            tripTypeFromUrl = params.get("tripType") || "all";
         }

         setSelectedLocations(locationsFromUrl);
         setTripType(tripTypeFromUrl);
         setValue(tripTypeFromUrl);
         setInitialized(true);
      }
   }, [initialized, initialLocations, initialTripType, loading]);

   useEffect(() => {
      setValue(currentTripType);
   }, [currentTripType]);

   const handleChange = (event: SelectChangeEvent<string>) => {
      const newValue = event.target.value;
      setValue(newValue);
      setTripType(newValue);
   };

   const handleSearch = () => {
      const locationsParam = selectedLocations.get().join(",");
      const tripTypeParam = tripType.get();
      window.location.href = `/search?locations=${encodeURIComponent(locationsParam)}&tripType=${tripTypeParam}`;
   };

   const selectedOptions = useMemo(() => {
      return locationOptions.filter((opt) =>
         currentLocations.includes(opt.location)
      );
   }, [locationOptions, currentLocations]);

   if (!initialized || loading) {
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
         <Autocomplete
            sx={{ width: { xs: "100%", md: 400 }, borderRadius: 30 }}
            options={locationOptions}
            multiple
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.location === value.location}
            value={selectedOptions}
            onChange={(e, newValue) => {
               setSelectedLocations(newValue.map((opt) => opt.location));
            }}
            renderOption={(props, option) => {
               const { key, ...optionProps } = props;
               return (
                  <Box
                     key={key}
                     component="li"
                     {...optionProps}
                  >
                     <Box className="flex items-center gap-2">
                        <Icon icon="solar:map-point-linear" width={20} />
                        <Typography typography="body" className="whitespace-nowrap">
                           {option.location}
                        </Typography>
                        <Typography
                           typography="body2"
                           className="whitespace-nowrap text-stone-400"
                        >
                           {" "}– {option.country}
                        </Typography>
                     </Box>
                  </Box>
               );
            }}
            renderInput={(params) => (
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
               <MenuItem value="all">{translations.label?.all || "All"}</MenuItem>
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
            onClick={handleSearch}
         >
            <Icon icon="solar:magnifer-line-duotone" width={25} />
         </Button>
      </Box>
   );
}