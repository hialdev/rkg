import type { ClientData } from 'src/stores/client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Typography } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { fData } from 'src/utils/format-number';

import useClientStore from 'src/stores/client';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaUtils } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type ClientCUType = z.infer<typeof ClientCUSchema>;
export const ClientCUSchema = z.object({
   title: z.string().min(1, { message: 'Title is required!' }),
   image: schemaUtils.file({ error: 'Client Image is required!' }).optional(),
});

// ----------------------------------------------------------------------

type Props = {
   open: boolean;
   onClose: () => void;
   onSuccess?: () => void;
   currentClient?: ClientData;
};

export function ClientCUForm({ currentClient, open, onClose, onSuccess }: Props) {
   const { update, add } = useClientStore();

   const defaultValues: ClientCUType = {
      image: currentClient?.image
         ? process.env.NEXT_PUBLIC_API_HOST + '/' + currentClient.image
         : undefined,
      title: currentClient?.title || '',
   };

   const methods = useForm({
      mode: 'onSubmit',
      resolver: zodResolver(ClientCUSchema),
      defaultValues,
   });

   const {
      reset,
      handleSubmit,
      formState: { isSubmitting },
   } = methods;

   const onSubmit = handleSubmit(async (data) => {
      try {
         const clientData: ClientData = {
            id: currentClient?.id ?? '',
            title: data.title,
            image: data.image ?? undefined,
         };
         let gas = undefined;

         if (currentClient) {
            gas = await update({ id: currentClient?.id ?? '', data: clientData });
         } else {
            gas = await add({ data: clientData });
         }

         if (gas.success) {
            onSuccess?.();
            reset();
            toast.success(gas.message);
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
         <DialogTitle>{currentClient ? 'Update' : 'Add New'} Client</DialogTitle>

         <Form methods={methods} onSubmit={onSubmit}>
            <DialogContent sx={{ pt: 1 }}>
               <Box sx={{ mb: 2 }}>
                  <Field.UploadAvatar
                     name="image"
                     maxSize={3145728}
                     helperText={
                        <Typography
                           variant="caption"
                           sx={{
                              mt: 3,
                              mx: 'auto',
                              display: 'block',
                              textAlign: 'center',
                              color: 'text.disabled',
                           }}
                        >
                           Allowed *.jpeg, *.jpg, *.png, *.gif
                           <br /> max size of {fData(3145728)}
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
               </Box>
            </DialogContent>

            <DialogActions>
               <Button variant="outlined" onClick={onClose}>
                  Cancel
               </Button>
               <Button type="submit" variant="contained" loading={isSubmitting}>
                  {currentClient ? 'Update' : 'Add New'}
               </Button>
            </DialogActions>
         </Form>
      </Dialog>
   );
}
