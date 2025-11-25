import type { EventPlanData } from 'src/stores/event-plan';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LoadingButton from '@mui/lab/LoadingButton';

import { useBoolean } from 'minimal-shared/hooks';

import { toast } from 'src/components/snackbar';
import { Field, Form, RHFTextField, RHFUpload } from 'src/components/hook-form';
import useEventPlanStore from 'src/stores/event-plan';

// ----------------------------------------------------------------------

const EventPlanSchema = z.object({
   title: z.string().min(1, { message: 'Title is required!' }),
   step_order: z.number().min(1, { message: 'Step order is required!' }),
   subtitle: z.string().min(1, { message: 'Subtitle is required!' }),
   content: z.string().optional(),
   image: z.instanceof(File).optional().nullable(),
});

export type EventPlanType = z.infer<typeof EventPlanSchema> & {
   id?: string;
};

// ----------------------------------------------------------------------

type Props = {
   editData?: EventPlanData;
   onSuccess?: () => void;
   open?: boolean;
   onClose?: () => void;
};

export function EventPlanForm({ editData, onSuccess, open, onClose }: Props) {
   const submitLoading = useBoolean();

   const isEdit = !!editData?.id;

   // Default values for the form
   const defaultValues: EventPlanType = {
      title: editData?.title || '',
      step_order: editData?.step_order || 1,
      subtitle: editData?.subtitle || '',
      content: editData?.content || '',
      image: null, // Don't prefill with existing image path as it's not a File object
   };

   const methods = useForm({
      resolver: zodResolver(EventPlanSchema),
      defaultValues,
   });

   const {
      reset,
      handleSubmit,
      formState: { isSubmitting },
   } = methods;

   const { add, update } = useEventPlanStore();

   const onSubmit = handleSubmit(async (data) => {
      try {
         console.info('Event Plan Form Data:', data);

         let result;
         if (isEdit && editData?.id) {
            // Update existing event plan
            result = await update({ id: editData.id, data: data as unknown as EventPlanData });
         } else {
            // Create new event plan
            result = await add({ data: data as unknown as EventPlanData });
         }

         if (result.success) {
            toast.success(result.message || (isEdit ? 'Event Plan updated successfully!' : 'Event Plan created successfully!'));
            onSuccess?.();
            reset();
            if (onClose) onClose();
         } else {
            toast.error(result.message || 'An error occurred while saving the event plan');
         }
      } catch (error) {
         console.error('Error submitting event plan:', error);
         toast.error('An error occurred while saving the event plan');
      }
   });

   const handleCancel = () => {
      reset(); // Reset form to clear any validation errors
      if (onClose) {
         onClose();
      } else {
         onSuccess?.();
      }
   };

   return (
      <Dialog
         fullWidth
         maxWidth="md"
         open={open ?? false}
         onClose={onClose || (() => {})}
      >
         <DialogTitle>{isEdit ? 'Edit' : 'Create New'} Event Plan</DialogTitle>

         <Form methods={methods} onSubmit={onSubmit}>
            <DialogContent sx={{ pt: 1, pb: 0, flexGrow: 1, overflow: 'auto' }}>
               <Stack spacing={3} mt={1}>
                  <Stack spacing={2}>
                     <RHFTextField 
                        name="title" 
                        label="Title" 
                        required 
                     />

                     <RHFTextField 
                        name="step_order" 
                        label="Step Order" 
                        type="number"
                        required 
                     />

                     <RHFTextField 
                        name="subtitle" 
                        label="Subtitle" 
                        required 
                     />

                     <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                           Plan Content
                        </Typography>
                        <Field.Editor name="content" />
                     </Box>

                     <RHFUpload
                        name="image"
                        maxSize={5242880} // 5MB
                        helperText="Allowed *.jpeg, *.jpg, *.png, max size of 5MB"
                     />
                  </Stack>
               </Stack>
            </DialogContent>

            <DialogActions>
               <Button variant="outlined" onClick={handleCancel}>
                  Cancel
               </Button>

               <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
               >
                  {isEdit ? 'Update Event Plan' : 'Create Event Plan'}
               </LoadingButton>
            </DialogActions>
         </Form>
      </Dialog>
   );
}
