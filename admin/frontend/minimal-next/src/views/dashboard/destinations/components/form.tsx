import type { DestinationData } from 'src/stores/destination';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import { InputAdornment } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaUtils } from 'src/components/hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { useState } from 'react';
import useDestinationStore from 'src/stores/destination';

// ----------------------------------------------------------------------

// Define the schema for the destination form
export type DestinationType = z.infer<typeof DestinationSchema> & {
   id?: string;
};

export const DestinationSchema = z.object({
   title: z.string().min(1, { message: 'Title is required!' }),
   slug: z.string().optional(),
   description: z.string().optional(),
   image: schemaUtils.file().optional(),
});

// ----------------------------------------------------------------------

type Props = {
   onSuccess?: () => void;
   currentDestination?: DestinationType | DestinationData;
   isModal?: boolean; // Optional prop to determine if it should be rendered as a dialog
   open?: boolean; // Optional prop to determine if it should be rendered as a dialog
   onClose?: () => void; // Optional prop for closing the dialog
};

// Simple slugify function
const slugify = (str: string): string => {
   return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with a single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
};

export function DestinationForm({ currentDestination, onSuccess, open, isModal = true, onClose }: Props) {
   const [slug, setSlug] = useState<string>(currentDestination?.slug || "");

   // Default values for the form
   const defaultValues: DestinationType = {
      title: currentDestination?.title || '',
      slug: currentDestination?.slug || '',
      description: currentDestination?.description || '',
      image: currentDestination?.image
         ? process.env.NEXT_PUBLIC_API_HOST + '/' + currentDestination.image
         : undefined,
   };

   const methods = useForm({
      mode: 'onSubmit',
      resolver: zodResolver(DestinationSchema),
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

   const { add, update } = useDestinationStore();

   const onSubmit = handleSubmit(async (data) => {
      try {
         console.info('Destination Form Data:', data);

         // Manually include the slug value since the field is disabled
         const formData = {
            ...data,
            slug: slug || data.slug,
         };

         let result;
         if (currentDestination?.id) {
            // Update existing destination
            result = await update({ id: currentDestination.id, data: formData });
         } else {
            // Create new destination
            result = await add({ data: formData });
         }

         if (result.success) {
            toast.success(currentDestination ? 'Destination updated successfully!' : 'Destination created successfully!');
            onSuccess?.();
            reset();
            if (isModal && onClose) {
               onClose();
            }
         } else {
            toast.error(result.message || 'An error occurred while saving the destination');
         }
      } catch (error) {
         console.error(error);
         toast.error('An error occurred while saving the destination');
      }
   });

   const formContent = (
      <Form methods={methods} onSubmit={onSubmit}>
         <DialogContent sx={{ pt: 1, pb: 0, flexGrow: 1, overflow: 'auto' }}>
            <Grid container spacing={3}>
               <Grid size={{ xs: 12 }}>
                  <Field.Upload
                     name="image"
                     maxSize={5242880} // 5MB
                     helperText="Allowed *.jpeg, *.jpg, *.png, max size of 5MB"
                  />
               </Grid>

               <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 1 }}>
                  <Field.Text 
                     name="title" 
                     label="Destination Title" 
                     fullWidth 
                     onBlur={(e) => setSlug(slugify(e.target.value))} 
                  />
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
         </DialogContent>

         <DialogActions>
            <Button variant="outlined" onClick={isModal && onClose ? onClose : () => {}}>
               Cancel
            </Button>
            <Button type="submit" variant="contained" loading={isSubmitting}>
               {currentDestination ? 'Update' : 'Add New'}
            </Button>
         </DialogActions>
      </Form>
   );

   return isModal ? (
      <Dialog fullWidth maxWidth="md" open={open ?? false} onClose={onClose || (() => {})}>
         <DialogTitle>{currentDestination ? 'Update' : 'Add New'} Destination</DialogTitle>
         {formContent}
      </Dialog>
   ) : (
      <Box sx={{ pt: 1, pb: 3 }}>
         <DialogTitle sx={{ display: 'none' }}>{currentDestination ? 'Update' : 'Add New'} Destination</DialogTitle>
         {formContent}
      </Box>
   );
}
