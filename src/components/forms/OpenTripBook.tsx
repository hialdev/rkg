import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
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
import { useLocale } from "../../contexts/LocaleContext";
import { getSetting, type Trip } from "../../fetchers";

dayjs.extend(utc);
dayjs.extend(localeData);

interface OpenTripBookProps {
   tripData: Trip;
}

const OpenTripBook = ({ tripData }: OpenTripBookProps) => {
   const { translations } = useLocale();
   const [whatsapp, setWhatsapp] = useState("6289671052050");
   const fetchWhatsapp = async () => {
      const res = await getSetting("com.whatsapp");
      setWhatsapp(
         res.data.data.set_value ? res.data.data.set_value : "6289671052050"
      );
   };

   useEffect(() => {
      fetchWhatsapp();
   }, []);

   // Define the Zod schema for form validation
   const schema = z.object({
      openDate: z
         .string()
         .min(
            1,
            translations?.validation?.open_date_required ||
               "Open date is required"
         ),
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
      const sendMessage = () => {
         const message = `
         Hello, I'm interested for take this ${tripData.title} Trip, !

         Selected date : ${data.openDate}
         Additional information : 
         ${data.additionalInfo ?? "-"}

         Link:
         ${window.location.href}
               `.trim();

         const encodedMessage = encodeURIComponent(message);
         const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodedMessage}`;

         window.open(whatsappUrl, "_blank");
      };

      sendMessage();
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
               sx={{ mb: 3, textAlign: "center" }}
            >
               {translations.label.book} {translations.label.open_trip}:{" "}
               {tripData.title}
            </Typography>

            <FormControl fullWidth className="mb-4" error={!!errors.openDate}>
               <Typography variant="body2" sx={{ mb: 1 }}>
                  {translations.label.available_dates}
               </Typography>
               <Box className="flex flex-wrap gap-2 mb-2">
                  {tripData.open_dates.map((dateRange: any, index: number) => {
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
               label={translations.label.additional_info}
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
               {translations.contact.send}
            </button>
         </Box>
      </LocalizationProvider>
   );
};

export default OpenTripBook;
