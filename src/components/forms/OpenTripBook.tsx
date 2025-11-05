import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
   TextField,
   Button,
   Box,
   Typography,
   Chip,
   FormControl,
   FormHelperText,
} from "@mui/material";
import dayjs, { type Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import localeData from "dayjs/plugin/localeData";

dayjs.extend(utc);
dayjs.extend(localeData);

interface OpenTripBookProps {
   tripData: {
      id: number;
      title: string;
      slug: string;
      description: string;
      city_id: number;
      type: string;
      duration: string;
      price: number;
      image: any;
      images: any[];
      min_people: number;
      meet_point: string;
      gmap_link: string;
      best_season: string;
      destinations: any[];
      content: string;
      open_dates: { from_date: string; to_date: string }[];
      itinerary: any[];
      testimonials: any[];
   };
}

const OpenTripBook = ({ tripData }: OpenTripBookProps) => {
   // Define the Zod schema for form validation
   const schema = z.object({
      openDate: z.string().min(1, "Open date is required"),
      additionalInfo: z.string().optional(),
   });

   type FormData = z.infer<typeof schema>;

   const {
      handleSubmit,
      formState: { errors },
      setValue,
      register,
      watch,
   } = useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: {
         additionalInfo: "",
      },
   });

   const [selectedDate, setSelectedDate] = useState<string | null>(null);

   const handleDateSelect = (dateRange: {
      from_date: string;
      to_date: string;
   }) => {
      const dateLabel = `${dayjs(dateRange.from_date).format(
         "DD MMM YYYY"
      )} - ${dayjs(dateRange.to_date).format("DD MMM YYYY")}`;
      setSelectedDate(dateLabel);
      setValue("openDate", JSON.stringify(dateRange));
   };

   const onSubmit = (data: FormData) => {
      console.log(data);
   };

   return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
         <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            className="w-full p-6 bg-white rounded-2xl shadow-md border border-gray-200"
         >
            <Typography
               variant="h6"
               component="h2"
               className="mb-6 text-center"
            >
               Book Open Trip: {tripData.title}
            </Typography>

            <FormControl fullWidth className="mb-4" error={!!errors.openDate}>
               <Typography variant="body2" sx={{mb:1}}>
                  Available Dates
               </Typography>
               <Box className="flex flex-wrap gap-2 mb-2">
                  {tripData.open_dates.map((dateRange, index) => {
                     const isSelected =
                        selectedDate ===
                        `${dayjs(dateRange.from_date).format(
                           "DD MMM YYYY"
                        )} - ${dayjs(dateRange.to_date).format("DD MMM YYYY")}`;
                     return (
                        <Chip
                           key={index}
                           label={`${dayjs(dateRange.from_date).format(
                              "DD MMM YYYY"
                           )} - ${dayjs(dateRange.to_date).format(
                              "DD MMM YYYY"
                           )}`}
                           onClick={() => handleDateSelect(dateRange)}
                           variant={isSelected ? "filled" : "outlined"}
                           color={isSelected ? "primary" : "default"}
                           className="cursor-pointer"
                        />
                     );
                  })}
               </Box>
               {errors.openDate && (
                  <FormHelperText>{errors.openDate.message}</FormHelperText>
               )}
            </FormControl>

            <TextField
               fullWidth
               label="Additional Information"
               multiline
               rows={4}
               variant="outlined"
               {...register("additionalInfo")}
               error={!!errors.additionalInfo}
               helperText={errors.additionalInfo?.message}
               className="mb-4"
            />

            <button
               type="submit"
               className="bg-linear-to-bl from-emerald-300 to-cyan-700 px-6 text-white font-medium rounded-full mt-5 py-3"
            >
               Book Now
            </button>
         </Box>
      </LocalizationProvider>
   );
};

export default OpenTripBook;
