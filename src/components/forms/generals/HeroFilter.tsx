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
import { cities, tripTypes } from "../../../mock";
import { Icon } from "@iconify-icon/react";

type Props = {
   defaultValue?: string;
   onChange?: (value: string, event: SelectChangeEvent<string>) => void;
};

export default function HeroFilter({ defaultValue = "", onChange }: Props) {
   const [value, setValue] = React.useState(defaultValue);

   const handleChange = (event: SelectChangeEvent<string>) => {
      const newValue = event.target.value;
      setValue(newValue);
      onChange?.(newValue, event);
   };

   return (
      <Box className="flex items-center gap-2 bg-white rounded-full overflow-hidden px-2 ps-4 py-2 my-4 shadow-sm">
         {/* AUTOCOMPLETE */}
         <Autocomplete
            id="country-select-demo"
            sx={{ width: 400, borderRadius: 30 }}
            options={cities}
            multiple
            getOptionLabel={(option: any) => option.name}
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
                              - {option.province}
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
                  label="Where do you want to go"
                  InputLabelProps={{
                     sx: {
                        "&.MuiInputLabel-shrink": {
                        },
                     },
                  }}
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
               minWidth: 140,
               "& .MuiOutlinedInput-root": {
                  "& fieldset": { border: "none" },
                  "&:hover fieldset": { border: "none" },
                  "&.Mui-focused fieldset": { border: "none" },
               },
            }}
         >
            <InputLabel
               sx={{
                  "&.MuiInputLabel-shrink": {
                  },
               }}
            >
               Type of Trip
            </InputLabel>
            <Select
               value={value}
               onChange={handleChange}
               displayEmpty
            >
               <MenuItem value="all">All</MenuItem>
               {tripTypes.map((trip) => (
                  <MenuItem value={trip.name}>{trip.label}</MenuItem>
               ))}
            </Select>
         </FormControl>

         <Button
            variant="contained"
            color="error"
            sx={{ padding: "0", aspectRatio: "1/1", borderRadius: 999 }}
         >
            <Icon icon={`solar:magnifer-line-duotone`} width={25} />
         </Button>
      </Box>
   );
}
