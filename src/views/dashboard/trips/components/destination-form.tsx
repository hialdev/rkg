
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { parsePhoneNumber, isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Typography } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { fData } from 'src/utils/format-number';

import useRoleStore from 'src/stores/role';
import useAuthStore from 'src/stores/auth';
import useUserStore from 'src/stores/user';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaUtils } from 'src/components/hook-form';
import { DestinationData } from 'src/stores/destination';

// ----------------------------------------------------------------------

export type DestinationType = z.infer<typeof DestinationSchema>;
export const DestinationSchema = z
   .object({
      title: z.string().min(1, { message: 'Title destination is required!' }),
      description: z.string().optional(),
      image: schemaUtils.file({ error: 'Destination Image is required!' }).optional(),
   })

// ----------------------------------------------------------------------

type Props = {
   open: boolean;
   onClose: () => void;
   onSuccess?: () => void;
   currentDestination?: DestinationData;
};

export function DestinationForm({ currentDestination, open, onClose, onSuccess }: Props) {

   const { authData } = useAuthStore();
   const { update, add } = useUserStore();
   const { roles } = useRoleStore();

   const defaultValues: DestinationType = {
      image: currentDestination?.image
         ? process.env.NEXT_PUBLIC_API_HOST + '/' + currentDestination.image
         : undefined,
      title: currentDestination?.title || '',
      description: currentDestination?.description || '',
   };


   const methods = useForm({
      mode: 'onSubmit',
      resolver: zodResolver(DestinationSchema),
      defaultValues,
   });

   const {
      reset,
      handleSubmit,
      setValue,
      formState: { isSubmitting },
   } = methods;

   const onSubmit = handleSubmit(async (data) => {
      try {
         if (authData.userId === currentDestination?.id) {toast.info("Tidak dapat mengubah role diri sendiri!"); return}; 
         const body = {
            id: currentDestination?.id ?? '',
            title: data.title ?? '',
            description: data.description ?? '',
         }
         let gas = undefined;

         if (currentDestination) {
            gas = await update({ id: currentDestination?.id ?? '', data: body });
         } else {
            gas = await add(body);
         }

         if (gas.success) {
            onSuccess?.()
            reset();
            toast.success(gas.message)
         }
         onClose();

         console.info('DATA', data);
      } catch (error) {
         console.error(error);
      }
   });

   // ------------------------------------------------------------------------------------------


   // ------------------------------------------------------------------------------------------

   return (
      <Dialog
         fullWidth
         maxWidth={false}
         open={open}
         onClose={onClose}
         slotProps={{
            paper: {
               sx: { maxWidth: 720 },
            },
         }}
      >
         <DialogTitle>{currentDestination ? 'Update' : 'Add New'} Destination</DialogTitle>

         <Form methods={methods} onSubmit={onSubmit}>
            <DialogContent sx={{ pt: 1 }}>
               <Box sx={{ mb: 2 }}>
                  <Field.Upload
                     name="image"
                     maxSize={3145728}
                     helperText={
                        <Typography
                           variant="caption"
                           sx={{
                              mt: 1,
                              mx: 'auto',
                              display: 'block',
                              textAlign: 'center',
                              color: 'text.disabled',
                           }}
                        >
                           Allowed *.jpeg, *.jpg, *.png, *.webp
                           max size of {fData(3145728)}
                        </Typography>
                     }
                  />
               </Box>
               <Box
                  sx={{
                     rowGap: 2,
                     columnGap: 2,
                     display: 'grid',
                  }}
               >
                  <Field.Text name="title" label="Title" />
                  <Field.Text multiline minRows={3} name="description" label="Description" />
               </Box>
            </DialogContent>

            <DialogActions>
               <Button variant="outlined" onClick={onClose}>
                  Cancel
               </Button>
               <Button type="submit" variant="contained" loading={isSubmitting}>
                  {currentDestination ? 'Update' : 'Add New'}
               </Button>
            </DialogActions>
         </Form>
      </Dialog>
   );
}
