'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { InputAdornment } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaUtils } from 'src/components/hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { slugify } from '../helpers/slug';
import { useEffect, useState } from 'react';
import useEventStore from 'src/stores/event';
import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

// Define the schema for the event form
export type EventType = z.infer<typeof EventSchema> & {
   id?: string;
};

export const EventSchema = z.object({
   title: z.string().optional(),
   slug: z.string().optional(),
   image: schemaUtils.file().optional(),
   description: z.string().optional(),
   content: z.string().optional(),
   client: z.string().optional(),
});

// ----------------------------------------------------------------------

type Props = {
   onSuccess?: () => void;
   currentEvent?: EventType;
   open?: boolean;
   onClose?: () => void;
};

export function EventForm({ currentEvent, onSuccess, open, onClose }: Props) {
   const [slug, setSlug] = useState<string>("");
   
   useEffect(() => {
      setSlug(currentEvent?.slug || slugify(currentEvent?.title ?? ''))
   }, [])

   // Default values for the form
   const defaultValues: EventType = {
      title: currentEvent?.title || '',
      slug: currentEvent?.slug || '',
      image: currentEvent?.image != undefined ? CONFIG.apiHostUrl+'/'+currentEvent?.image : undefined,
      description: currentEvent?.description || '',
      content: currentEvent?.content || '',
      client: currentEvent?.client || '',
   };

   const methods = useForm({
      mode: 'onSubmit',
      resolver: zodResolver(EventSchema),
      defaultValues,
   });

   const {
      reset,
      handleSubmit,
      control,
      setValue,
      watch,
      formState: { isSubmitting },
   } = methods;

   const { add, update } = useEventStore();

   const onSubmit = handleSubmit(async (data) => {
      try {
         console.info('Event Form Data:', data);

         // Manually include the slug value since the field is disabled
         const formData = {
            ...data,
            slug: slug || data.slug,
         };

         let result;
         if (currentEvent?.id) {
            // Update existing event
            result = await update({ id: currentEvent.id, data: formData });
         } else {
            // Create new event
            result = await add({ data: formData });
         }

         if (result.success) {
            toast.success(currentEvent ? 'Event updated successfully!' : 'Event created successfully!');
            onSuccess?.();
            reset();
            if (onClose) onClose();
         } else {
            toast.error(result.message || 'An error occurred while saving the event');
         }
      } catch (error) {
         console.error(error);
         toast.error('An error occurred while saving the event');
      }
   });

   return (
      <Form methods={methods} onSubmit={onSubmit}>
         <Box sx={{ pt: 1, pb: 0, flexGrow: 1, overflow: 'auto' }}>
            <Grid container spacing={3}>
               {/* Left Column - Basic Info */}
               <Grid size={{ xs: 12 }}>
                  <Box sx={{ mb: 3 }}>
                     <Field.Upload
                        name="image"
                        maxSize={5242880} // 5MB
                        helperText={
                           <Box
                              sx={{
                                 mt: 1,
                                 display: 'block',
                                 textAlign: 'center',
                                 color: 'text.disabled',
                              }}
                           >
                              Allowed *.jpeg, *.jpg, *.png, max size of 5MB
                           </Box>
                        }
                     />
                  </Box>

                  <Grid container spacing={3}>
                     <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 1 }}>
                        <Field.Text name="title" label="Event Title" fullWidth onBlur={(e) => setSlug(slugify(e.target.value))} />
                     </Grid>
                     <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 1 }}>
                        <Field.Text
                           name="slug"
                           label="Slug"
                           fullWidth
                           value={slug}
                           disabled
                           helperText="URL-friendly version of the title"
                        />
                     </Grid>
                     <Grid size={{ xs: 12 }} sx={{ mb: 3 }}>
                        <Field.Text
                           multiline
                           name="description"
                           label="Description"
                           minRows={3}
                           fullWidth
                           helperText="Also used as SEO meta description"
                        />
                     </Grid>
                  </Grid>

                  <Grid container spacing={3}>
                     <Grid size={{ xs: 12 }} sx={{ mb: 3 }}>
                        <Field.Text
                           name="client"
                           label="Client"
                           fullWidth
                        />
                     </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                     <Grid size={{ xs: 12 }}>
                        <Field.Editor name="content" />
                     </Grid>
                  </Grid>
               </Grid>
            </Grid>
         </Box>

         <DialogActions>
            <Button type="button" variant="outlined" onClick={() => {
               reset();
               if (onClose) onClose();
            }}>
               Cancel
            </Button>
            <Button type="submit" variant="contained" loading={isSubmitting}>
               {currentEvent ? 'Update' : 'Add New'}
            </Button>
         </DialogActions>
      </Form>
   );
}
