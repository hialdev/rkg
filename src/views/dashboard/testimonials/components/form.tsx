import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import { InputAdornment, Typography } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaUtils } from 'src/components/hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { useEffect, useState } from 'react';
import { useTestimonialStore } from 'src/stores/testimonial';
import { CONFIG } from 'src/global-config';
import { paths } from 'src/routes/al/paths';
import { useRouter } from 'src/routes/hooks';
import { TestimonialItem, TestimonialSchema } from 'src/types/testimonial';

// ----------------------------------------------------------------------

type Props = {
   onSuccess?: () => void;
   currentTestimonial?: TestimonialItem;
   onClose?: () => void;
};

export function TestimonialForm({ currentTestimonial, onSuccess, onClose }: Props) {
   const router = useRouter();
   let parsedGalleries: any[] = [];

   if (typeof currentTestimonial?.galleries === 'string' && currentTestimonial.galleries !== '') {
      try {
         parsedGalleries = JSON.parse(currentTestimonial.galleries);
      } catch (err) {
         console.error('Invalid JSON galleries:', err);
      }
   } else if (Array.isArray(currentTestimonial?.galleries)) {
      parsedGalleries = currentTestimonial.galleries;
   }

   // Default values for the form
   const defaultValues: TestimonialSchema = {
      name: currentTestimonial?.name || '',
      role: currentTestimonial?.role || '',
      image:
         typeof currentTestimonial?.image === 'string' && currentTestimonial?.image
            ? `${CONFIG.apiHostUrl}/${currentTestimonial.image}`
            : currentTestimonial?.image,
      quote: currentTestimonial?.quote || '',
      galleries:
         parsedGalleries && Array.isArray(parsedGalleries)
            ? parsedGalleries.map((gallery: any) =>
                 typeof gallery === 'string' ? `${CONFIG.apiHostUrl}/${gallery}` : gallery
              )
            : [],
   };

   const testimonialSchema = z.object({
      name: z.string().min(1, { message: 'Name is required' }),
      role: z.string().min(1, { message: 'Role is required' }),
      quote: z.string().min(1, { message: 'Quote is required' }),
      image: schemaUtils.file({ error: 'Thumbnail image is required!' }).optional().optional(),
      galleries: z.array(schemaUtils.file()).optional(),
   });

   const methods = useForm({
      mode: 'onSubmit',
      resolver: zodResolver(testimonialSchema),
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

   const { add, update } = useTestimonialStore();

   const handleRemoveFile = (inputFile: File | string) => {
      const filtered =
         watch('galleries')?.filter((file: any) => {
            // Handle duplicate URL checking: match exactly
            // For Files: references are unique in memory usually, but good to check
            return file !== inputFile;
         }) || [];
      setValue('galleries', filtered, { shouldValidate: true, shouldDirty: true });
   };

   const onSubmit = handleSubmit(async (data) => {
      try {
         console.info('Testimonial Form Data:', data);

         const imageValue =
            data.image !== null && data.image instanceof File ? data.image : undefined;

         // Fix: Do not filter for File instances only. Pass mixed array (File | string).
         // Filter out nulls.
         const processedGalleries = (data.galleries || []).filter((item) => item !== null);

         const formData = {
            name: data.name,
            role: data.role,
            quote: data.quote,
            image: imageValue,
            galleries: processedGalleries,
         };

         // Use the store methods but make sure the data matches the expected types
         let result;
         if (currentTestimonial?.id) {
            // Update existing testimonial
            result = await update({ id: currentTestimonial.id, data: formData });
         } else {
            // Create new testimonial
            result = await add({ data: formData });
         }

         if (result.success) {
            toast.success(
               currentTestimonial
                  ? 'Testimonial updated successfully!'
                  : 'Testimonial created successfully!'
            );
            onSuccess?.();
            reset();
            onClose?.(); // Close the dialog after successful submission
         } else {
            toast.error(result.message || 'An error occurred while saving the testimonial');
         }
      } catch (error) {
         console.error(error);
         toast.error('An error occurred while saving the testimonial');
      }
   });

   return (
      <Form methods={methods} onSubmit={onSubmit}>
         <Box sx={{ pt: 1, pb: 0, flexGrow: 1, overflow: 'auto' }}>
            <Grid container spacing={3}>
               {/* Left Column - Basic Info */}
               <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ mb: 3 }}>
                     <Field.Upload
                        name="image"
                        maxSize={5242880} // 5MB
                        helperText={
                           <Typography
                              variant="caption"
                              sx={{
                                 mt: 1,
                                 display: 'block',
                                 textAlign: 'center',
                                 color: 'text.disabled',
                              }}
                           >
                              Allowed *.jpeg, *.jpg, *.png, max size of 5MB
                           </Typography>
                        }
                     />
                  </Box>

                  <Grid container spacing={3}>
                     <Grid size={{ xs: 12 }} sx={{ mb: 1 }}>
                        <Field.Text name="name" label="Name" fullWidth />
                     </Grid>
                     <Grid size={{ xs: 12 }} sx={{ mb: 1 }}>
                        <Field.Text name="role" label="Role" fullWidth />
                     </Grid>
                     <Grid size={{ xs: 12 }} sx={{ mb: 3 }}>
                        <Field.Text multiline name="quote" label="Quote" minRows={3} fullWidth />
                     </Grid>
                  </Grid>
               </Grid>

               {/* Right Column - Galleries */}
               <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ mb: 3 }}>
                     <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Galleries
                     </Typography>
                     <Field.Upload
                        name="galleries"
                        maxSize={5242880} // 5MB
                        multiple
                        onRemove={handleRemoveFile}
                        helperText={
                           <Typography
                              variant="caption"
                              sx={{
                                 mt: 1,
                                 display: 'block',
                                 textAlign: 'center',
                                 color: 'text.disabled',
                              }}
                           >
                              Allowed *.jpeg, *.jpg, *.png, max size of 5MB each
                           </Typography>
                        }
                     />
                  </Box>
               </Grid>
            </Grid>
         </Box>

         <Box sx={{ position: 'sticky', bottom: 0, end: 0, start: 0, zIndex: 99, pb: 2 }}>
            <Button type="submit" variant="contained" fullWidth loading={isSubmitting}>
               {currentTestimonial ? 'Update' : 'Add New'}
            </Button>
         </Box>
      </Form>
   );
}
