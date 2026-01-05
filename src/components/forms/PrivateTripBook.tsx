import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField, Button, Box, Typography } from "@mui/material";
import dayjs, { type Dayjs } from "dayjs";
import { useLocale } from "../../contexts/LocaleContext";
import { getSetting, type Trip } from "../../fetchers";

interface Props {
   tripData?: Trip;
}
const PrivateTripBook = ({ tripData }: Props) => {
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
      startDate: z
         .string()
         .min(
            1,
            "Start date is required"
         ),
      endDate: z
         .string()
         .min(
            1,
            "End date is required"
         ),
      message: z
         .string()
         .min(
            10,
            "Message must be at least 10 characters"
         )
         .max(
            500,
            "Message must not exceed 500 characters"
         ),
   });

   type FormData = z.infer<typeof schema>;

   const {
      handleSubmit,
      formState: { errors },
      setValue,
      register,
   } = useForm<FormData>({
      resolver: zodResolver(schema),
   });

   const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
      dayjs(),
      dayjs().add(2, "day"), // Default to 3 days
   ]);

   const onSubmit = (data: FormData) => {
      const sendMessage = () => {
         const message = `
         Hello, I'm interested for take this ${tripData?.title} Trip, !

         Start date : ${data.startDate}
         End date : ${data.endDate}
         
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
            className="max-w-2xl mx-auto p-6 border border-stone-200 rounded-2xl"
         >
            <Typography
               variant="h6"
               fontWeight={`medium`}
               sx={{ mb: 3 }}
               component="h2"
               className="text-center"
            >
               {translations.label.book} {translations.label.private_trip}
            </Typography>

            <Box className="flex flex-col sm:flex-row gap-4 mb-4">
               <Box className="w-full sm:w-1/2">
                  <DatePicker
                     sx={{ width: "100%" }}
                     label={translations.label.start_date}
                     value={dateRange[0]}
                     onChange={(newValue) => {
                        if (newValue) {
                           const newStartDate = newValue;
                           // Ensure end date is not before start date
                           const newEndDate =
                              dateRange[1] && newValue.isAfter(dateRange[1])
                                 ? newValue.add(1, "day")
                                 : dateRange[1];
                           setDateRange([newStartDate, newEndDate]);
                           setValue(
                              "startDate",
                              newStartDate.format("YYYY-MM-DD")
                           );
                           if (newEndDate) {
                              setValue(
                                 "endDate",
                                 newEndDate.format("YYYY-MM-DD")
                              );
                           }
                        }
                     }}
                     minDate={dayjs()}
                     className="w-full"
                  />
                  {errors.startDate && (
                     <Typography color="error" variant="caption">
                        {errors.startDate.message}
                     </Typography>
                  )}
               </Box>
               <Box className="w-full sm:w-1/2">
                  <DatePicker
                     sx={{ width: "100%" }}
                     label={translations.label.end_date}
                     value={dateRange[1]}
                     onChange={(newValue) => {
                        if (newValue) {
                           const newEndDate = newValue;
                           // Ensure start date is not after end date
                           const newStartDate =
                              dateRange[0] && newValue.isBefore(dateRange[0])
                                 ? newValue.subtract(1, "day")
                                 : dateRange[0];
                           setDateRange([newStartDate, newEndDate]);
                           setValue("endDate", newEndDate.format("YYYY-MM-DD"));
                           if (newStartDate) {
                              setValue(
                                 "startDate",
                                 newStartDate.format("YYYY-MM-DD")
                              );
                           }
                        }
                     }}
                     minDate={dateRange[0] || dayjs()}
                     className="w-full"
                  />
                  {errors.endDate && (
                     <Typography color="error" variant="caption">
                        {errors.endDate.message}
                     </Typography>
                  )}
               </Box>
            </Box>

            <TextField
               fullWidth
               label={translations.label.your_message}
               multiline
               rows={4}
               variant="outlined"
               {...register("message")}
               error={!!errors.message}
               helperText={errors.message?.message}
               sx={{ mb: 2 }}
            />

            <button className="bg-linear-to-tl from-yellow-40 via-yellow-600 to-orange-300 text-white font-medium py-2 px-6 rounded-full hover:shadow-lg hover:scale-105 cursor-pointer">
               {translations.contact.send}
            </button>
         </Box>
      </LocalizationProvider>
   );
};

export default PrivateTripBook;
