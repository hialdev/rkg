import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
   FormControl,
   InputLabel,
   MenuItem,
   Select,
   TextField,
   Button,
   FormHelperText,
   Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getSetting } from "../../fetchers";

const ConsultationSchema = z.object({
   name: z.string().min(3, "Name must be at least 3 characters"),
   email: z.string().email("Invalid email format"),
   phone: z.string().min(8, "Phone number is too short"),
   service: z.enum(
      ["general", "open-trip", "private-trip", "event-organizer"],
      {
         required_error: "Please select a service",
      }
   ),
   description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
});

type ConsultationFormData = z.infer<typeof ConsultationSchema>;

const SERVICE_LABELS: Record<string, string> = {
   general: "General",
   "open-trip": "Open Trip",
   "private-trip": "Private Trip",
   "event-organizer": "Event Organizer",
};

export default function ConsultationForm() {
   const [whatsapp, setWhatsapp] = useState("6289671052050")

   useEffect(() => {
      async () => {
         const res = await getSetting("com.whatsapp")
         setWhatsapp(res.data.data.set_value ? res.data.data.set_value : "6289671052050")
      }
   },[])

   const {
      register,
      handleSubmit,
      setValue,
      watch,
      formState: { errors },
   } = useForm<ConsultationFormData>({
      resolver: zodResolver(ConsultationSchema),
      defaultValues: {
         name: "",
         email: "",
         phone: "",
         service: "general",
         description: "",
      },
   });

   const serviceWatch = watch("service");

   const onSubmit = (data: ConsultationFormData) => {
      const { name, email, phone, service, description } = data;

      const message = `
New Consultation Request 📩

Name: ${name}
Email: ${email}
Phone: ${phone}
Service: ${SERVICE_LABELS[service] || service}
Message: ${description}
      `.trim();

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodedMessage}`;

      // Buka di tab baru
      window.open(whatsappUrl, "_blank");
   };

   return (
      <Box
         component="form"
         onSubmit={handleSubmit(onSubmit)}
         className="grid grid-cols-2 gap-6"
      >
         {/* Full Name */}
         <TextField
            label="Full Name"
            variant="standard"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
         />

         {/* Email */}
         <TextField
            label="Email"
            type="email"
            variant="standard"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
         />

         {/* Phone */}
         <TextField
            label="Phone"
            variant="standard"
            {...register("phone")}
            error={!!errors.phone}
            helperText={errors.phone?.message}
         />

         {/* Services Dropdown */}
         <FormControl variant="standard" error={!!errors.service}>
            <InputLabel id="services-label">Services</InputLabel>
            <Select
               labelId="services-label"
               value={serviceWatch || ""}
               onChange={(e) => setValue("service", e.target.value as any)}
            >
               <MenuItem value="general">General</MenuItem>
               <MenuItem value="open-trip">Open Trip</MenuItem>
               <MenuItem value="private-trip">Private Trip</MenuItem>
               <MenuItem value="event-organizer">Event Organizer</MenuItem>
            </Select>
            <FormHelperText>{errors.service?.message}</FormHelperText>
         </FormControl>

         {/* Description */}
         <div className="col-span-2">
            <TextField
               label="Description"
               variant="standard"
               multiline
               rows={4}
               fullWidth
               {...register("description")}
               error={!!errors.description}
               helperText={errors.description?.message}
            />
         </div>

         {/* Submit Button */}
         <div className="col-span-2 flex justify-end">
            <Button
               type="submit"
               variant="contained"
               fullWidth
               color="error"
               size="large"
            >
               Submit
            </Button>
         </div>
      </Box>
   );
}
