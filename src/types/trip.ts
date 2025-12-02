import { schemaUtils } from "src/components/hook-form";
import z from "zod";

export type ITripTableFilters = {
   title: string;
   type: string[];
   country: string[];
};

export type TripType = z.infer<typeof TripSchema> & {
   id?: string;
};

export const TripSchema = z.object({
   title: z.string().optional(),
   slug: z.string().optional(),
   description: z.string().optional(),
   location: z.string().optional(),
   country: z.string().optional(),
   type: z.string().optional(),
   duration: z.string().optional(),
   price: z.number().optional(),
   image: schemaUtils.file().optional(),
   images: z.array(schemaUtils.file()).optional(),
   min_people: z.number().optional(),
   meet_point: z.string().optional(),
   destinations: z.array(z.any()).optional(),
   content: z.string().optional(),
   open_dates: z
      .array(
         z.object({
            from_date: z.string().optional(),
            to_date: z.string().optional(),
         })
      )
      .optional(),
   itinerary: z
      .array(
         z.object({
            day: z.number().optional(),
            activities: z
               .array(
                  z.object({
                     time: z.string().optional(),
                     description: z.string().optional(),
                  })
               )
               .optional(),
         })
      )
      .optional(),
});
