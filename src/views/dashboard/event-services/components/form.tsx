import type { EventServiceData } from 'src/stores/event-service';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
import { Form, Field, schemaUtils } from 'src/components/hook-form';
import useEventServiceStore from 'src/stores/event-service';

// ----------------------------------------------------------------------

// Define the schema for the event service form
export type EventServiceType = z.infer<typeof EventServiceSchema> & {
   id?: string;
};

export const EventServiceSchema = z.object({
   image: schemaUtils.file().optional(),
   title: z.string().min(1, { message: 'Title is required!' }),
   description: z.string().optional(),
});

// ----------------------------------------------------------------------

type Props = {
   editData?: EventServiceData;
   onSuccess?: () => void;
   open?: boolean;
   onClose?: () => void;
};

export function EventServiceForm({ editData, onSuccess, open, onClose }: Props) {
   const submitLoading = useBoolean();

   const isEdit = !!editData?.id;

   // Default values for the form
   const defaultValues: EventServiceType = {
      image: editData?.image
         ? process.env.NEXT_PUBLIC_API_HOST + '/' + editData.image
         : undefined,
      title: editData?.title || '',
      description: editData?.description || '',
   };

   const methods = useForm({
      mode: 'onSubmit',
      resolver: zodResolver(EventServiceSchema),
      defaultValues,
   });

   const {
      reset,
      handleSubmit,
      formState: { isSubmitting },
   } = methods;

   const { add, update } = useEventServiceStore();

   const onSubmit = handleSubmit(async (data) => {
      try {
         console.info('Event Service Form Data:', data);

         let result;
         if (isEdit && editData?.id) {
            // Update existing event service
            result = await update({ id: editData.id, data: data as EventServiceData });
         } else {
            // Create new event service
            result = await add({ data: data as EventServiceData });
         }

         if (result.success) {
            toast.success(isEdit ? 'Event Service updated successfully!' : 'Event Service created successfully!');
            onSuccess?.();
            reset();
            if (onClose) onClose();
         } else {
            toast.error(result.message || 'An error occurred while saving the event service');
         }
      } catch (error) {
         console.error(error);
         toast.error('An error occurred while saving the event service');
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
         <DialogTitle>{isEdit ? 'Update' : 'Add New'} Event Service</DialogTitle>

         <Form methods={methods} onSubmit={onSubmit}>
            <DialogContent sx={{ pt: 1, pb: 0, flexGrow: 1, overflow: 'auto' }}>
               <Stack spacing={3}>
                  <Typography variant="h6">Basic Information</Typography>

                  <Stack spacing={2}>
                     <Field.Text 
                        name="title" 
                        label="Title" 
                        required 
                     />

                     <Field.Text
                        multiline
                        minRows={3}
                        name="description"
                        label="Description"
                        placeholder="Description"
                     />

                     <Field.Upload
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
                  {isEdit ? 'Update Event Service' : 'Create Event Service'}
               </LoadingButton>
            </DialogActions>
         </Form>
      </Dialog>
   );
}
