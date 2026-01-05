import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
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

   // Check if trip uses open dates or manual date range
   const useOpenDates = tripData.use_open_dates ?? true;

   // Define the Zod schema for form validation
   const schema = z.object({
      openDate: useOpenDates
         ? z.string().min(1, "Open date is required")
         : z.string().optional(),
      fromDate: !useOpenDates
         ? z.string().min(1, "From date is required")
         : z.string().optional(),
      toDate: !useOpenDates
         ? z.string().min(1, "To date is required")
         : z.string().optional(),
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
   const [fromDate, setFromDate] = useState<Dayjs | null>(null);
   const [toDate, setToDate] = useState<Dayjs | null>(null);

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
         let dateInfo = "";
         if (useOpenDates) {
            dateInfo = `Selected date : ${data.openDate}`;
         } else {
            dateInfo = `From: ${data.fromDate}\nTo: ${data.toDate}`;
         }

         const message = `
         Hello, I'm interested for take this ${tripData.title} Trip, !

         ${dateInfo}
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

            {useOpenDates ? (
               <FormControl
                  fullWidth
                  className="mb-4"
                  error={!!errors.openDate}
               >
                  <Typography variant="body2" sx={{ mb: 1 }}>
                     {translations.label.available_dates}
                  </Typography>

                  <Box className="flex flex-wrap gap-2 mb-2">
                     {(() => {
                        const dates =
                           typeof tripData.open_dates === "string"
                              ? JSON.parse(tripData.open_dates)
                              : tripData.open_dates;

                        return Array.isArray(dates)
                           ? dates.map((dateRange: any, index: number) => {
                                const isSelected =
                                   selectedDate ===
                                   `${dayjs(dateRange.from_date).format(
                                      "DD MMM YYYY"
                                   )} - ${dayjs(dateRange.to_date).format(
                                      "DD MMM YYYY"
                                   )}`;
                                return (
                                   <Chip
                                      key={index}
                                      label={`${dayjs(
                                         dateRange.from_date
                                      ).format("DD MMM YYYY")} - ${dayjs(
                                         dateRange.to_date
                                      ).format("DD MMM YYYY")}`}
                                      onClick={() =>
                                         handleDateSelect(dateRange)
                                      }
                                      variant={
                                         isSelected ? "filled" : "outlined"
                                      }
                                      color={isSelected ? "primary" : "default"}
                                      className="cursor-pointer"
                                   />
                                );
                             })
                           : null;
                     })()}
                  </Box>
                  {errors.openDate && (
                     <FormHelperText>{errors.openDate.message}</FormHelperText>
                  )}
               </FormControl>
            ) : (
               <>
                  <Box className="mb-4">
                     <DatePicker
                        label="From Date"
                        value={fromDate}
                        onChange={(newValue) => {
                           setFromDate(newValue);
                           setValue(
                              "fromDate",
                              newValue?.format("YYYY-MM-DD") || ""
                           );
                        }}
                        slotProps={{
                           textField: {
                              fullWidth: true,
                              error: !!errors.fromDate,
                              helperText: errors.fromDate?.message,
                           },
                        }}
                     />
                  </Box>
                  <Box className="mb-4">
                     <DatePicker
                        label="To Date"
                        value={toDate}
                        onChange={(newValue) => {
                           setToDate(newValue);
                           setValue(
                              "toDate",
                              newValue?.format("YYYY-MM-DD") || ""
                           );
                        }}
                        slotProps={{
                           textField: {
                              fullWidth: true,
                              error: !!errors.toDate,
                              helperText: errors.toDate?.message,
                           },
                        }}
                     />
                  </Box>
               </>
            )}

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
