import type { TeamData } from 'src/stores/team';

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
import useTeamStore from 'src/stores/team';

// ----------------------------------------------------------------------

// Define the schema for the team form
export type TeamType = z.infer<typeof TeamSchema> & {
   id?: string;
};

export const TeamSchema = z.object({
   name: z.string().min(1, { message: 'Name is required!' }),
   role: z.string().min(1, { message: 'Role is required!' }),
   summary: z.string().optional(),
   image: schemaUtils.file().optional(),
});

// ----------------------------------------------------------------------

type Props = {
   editData?: TeamData;
   onSuccess?: () => void;
   open?: boolean;
   onClose?: () => void;
};

export function TeamForm({ editData, onSuccess, open, onClose }: Props) {
   const submitLoading = useBoolean();

   const isEdit = !!editData?.id;

   // Default values for the form
   const defaultValues: TeamType = {
      name: editData?.name || '',
      role: editData?.role || '',
      summary: editData?.summary || '',
      image: editData?.image
         ? process.env.NEXT_PUBLIC_API_HOST + '/' + editData.image
         : undefined,
   };

   const methods = useForm({
      mode: 'onSubmit',
      resolver: zodResolver(TeamSchema),
      defaultValues,
   });

   const {
      reset,
      handleSubmit,
      formState: { isSubmitting },
   } = methods;

   const { add, update } = useTeamStore();

   const onSubmit = handleSubmit(async (data) => {
      try {
         console.info('Team Form Data:', data);

         let result;
         if (isEdit && editData?.id) {
            // Update existing team
            result = await update({ id: editData.id, data: data as TeamData });
         } else {
            // Create new team
            result = await add({ data: data as TeamData });
         }

         if (result.success) {
            toast.success(isEdit ? 'Team updated successfully!' : 'Team created successfully!');
            onSuccess?.();
            reset();
            if (onClose) onClose();
         } else {
            toast.error(result.message || 'An error occurred while saving the team');
         }
      } catch (error) {
         console.error(error);
         toast.error('An error occurred while saving the team');
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
         <DialogTitle>{isEdit ? 'Update' : 'Add New'} Team</DialogTitle>

         <Form methods={methods} onSubmit={onSubmit}>
            <DialogContent sx={{ pt: 1, pb: 0, flexGrow: 1, overflow: 'auto' }}>
               <Stack spacing={3}>
                  <Typography variant="h6">Basic Information</Typography>

                  <Stack spacing={2}>
                     <Field.Text 
                        name="name" 
                        label="Name" 
                        required 
                     />

                     <Field.Text 
                        name="role" 
                        label="Role" 
                        required 
                     />

                     <Field.Text
                        multiline
                        minRows={3}
                        name="summary"
                        label="Summary"
                        placeholder="Summary"
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
                  {isEdit ? 'Update Team' : 'Create Team'}
               </LoadingButton>
            </DialogActions>
         </Form>
      </Dialog>
   );
}
