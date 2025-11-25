import type { FaqData } from 'src/stores/faq';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
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
import useFaqStore from 'src/stores/faq';

// ----------------------------------------------------------------------

const FaqSchema = z.object({
   title: z.string().min(1, { message: 'Title is required!' }),
   content: z.string().min(1, { message: 'Content is required!' }),
});

export type FaqType = z.infer<typeof FaqSchema> & {
   id?: string;
};

// ----------------------------------------------------------------------

type Props = {
   open?: boolean;
   onClose?: () => void;
   editData?: FaqData;
   onSuccess?: () => void;
};

export function FaqForm({ open, onClose, editData, onSuccess }: Props) {
   const submitLoading = useBoolean();

   const isEdit = !!editData?.id;

   const defaultValues: FaqType = {
      title: editData?.title || '',
      content: editData?.content || '',
   };

   const methods = useForm({
      resolver: zodResolver(FaqSchema),
      defaultValues,
   });

   const {
      reset,
      handleSubmit,
      formState: { isSubmitting },
   } = methods;

   const { add, update } = useFaqStore();

   const onSubmit = handleSubmit(async (data) => {
      try {
         console.info('FAQ Form Data:', data);

         let result;
         if (isEdit && editData?.id) {
            // Update existing FAQ
            result = await update({ id: editData.id, data: data as unknown as FaqData });
         } else {
            // Create new FAQ
            result = await add({ data: data as unknown as FaqData });
         }

         if (result.success) {
            toast.success(
               result.message ||
                  (isEdit ? 'FAQ updated successfully!' : 'FAQ created successfully!')
            );
            onSuccess?.();
            reset();
            if (onClose) onClose();
         } else {
            toast.error(result.message || 'An error occurred while saving the FAQ');
         }
      } catch (error) {
         console.error('Error submitting FAQ:', error);
         toast.error('An error occurred while saving the FAQ');
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
      <Dialog fullWidth maxWidth="sm" open={open ?? false} onClose={onClose || (() => {})}>
         <DialogTitle>{isEdit ? 'Edit' : 'Create New'} FAQ</DialogTitle>

         <Form methods={methods} onSubmit={onSubmit}>
            <DialogContent sx={{ pt: 1, pb: 0, flexGrow: 1, overflow: 'auto' }}>
               <Stack spacing={3} mt={1}>
                  <Stack spacing={2}>
                     <Field.Text name="title" label="Title" required />

                     <Field.Editor name="content" />
                  </Stack>
               </Stack>
            </DialogContent>

            <DialogActions>
               <Button variant="outlined" onClick={handleCancel}>
                  Cancel
               </Button>

               <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {isEdit ? 'Update FAQ' : 'Create FAQ'}
               </LoadingButton>
            </DialogActions>
         </Form>
      </Dialog>
   );
}
