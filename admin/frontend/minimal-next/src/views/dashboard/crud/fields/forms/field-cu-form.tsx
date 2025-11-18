import type { TableFieldData } from 'src/stores/table-field';

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

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type UserCUType = z.infer<typeof UserCUSchema>;
export const UserCUSchema = z
   .object({
      name: z.string().min(1, { message: 'Name is required!' }),
      label: z.string().min(1, { message: 'Label is required!' }),
      type: z.string(),
      is_required: z.boolean(),
      is_unique: z.boolean(),
      relation_type: z.string().nullish(),
      relation_table: z.string().nullish(),
      translation_lang: z.array(z.string()),
      default_lang: z.string(),
      options: z.string()
   })

// ----------------------------------------------------------------------

type Props = {
   open: boolean;
   onClose: () => void;
   onSuccess?: () => void;
   currentField?: TableFieldData;
};

export function FieldCUForm({ currentField, open, onClose, onSuccess }: Props) {

   const defaultValues: UserCUType = {
      name: currentField?.name || '',
      label: currentField?.label || '',
      type: currentField?.type || '',
      is_required: currentField?.is_required || false,
      is_unique: currentField?.is_unique || false,
      relation_type: currentField?.relation_type || undefined,
      relation_table: currentField?.relation_table || undefined,
      translation_lang: currentField?.languages?.langs || [],
      default_lang: currentField?.languages?.default || '',
      options: currentField?.options || '',
   };


   const methods = useForm({
      mode: 'onSubmit',
      resolver: zodResolver(UserCUSchema),
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
         if (authData.userId === currentField?.id) {toast.info("Tidak dapat mengubah role diri sendiri!"); return}; 
         const body = {
            id: currentField?.id ?? '',
            username: data.username,
            country_code: data.phoneNumber_country_code,
            image: data.image ?? undefined,
            email: data.email,
            phone: data.phoneNumber,
            name: data.name,
            role_id: data.role?.id,
         }
         let gas = undefined;

         if (currentField) {
            gas = await update({ id: currentField?.id ?? '', data: body });
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
         <DialogTitle>{currentField ? 'Update' : 'Add New'} User</DialogTitle>

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
                  <Field.Text name="name" label="Full name" />
                  <Field.Text name="username" label="Username" />
                  <Field.Text name="email" label="Email address" />
                  <Field.Phone name="phoneNumber" label="Whatsapp number" defaultCountry="ID" />
                  <Field.Autocomplete
                     name="role" // pastikan ini sesuai field di Formik/Yup
                     label="Select Role"
                     placeholder="Select Role"
                     disableCloseOnSelect
                     options={roles}
                     getOptionLabel={(option) => option.name}
                     getOptionKey={(option) => option.id}
                     isOptionEqualToValue={(option, value) => option.id === value.id}
                     renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                           <Box>
                              <Typography variant="body2" fontWeight="bold">
                                 {option.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                 {option.description}
                              </Typography>
                           </Box>
                        </li>
                     )}
                     slotProps={{
                        chip: {
                           color: 'info',
                        },
                     }}
                  />

               </Box>
            </DialogContent>

            <DialogActions>
               <Button variant="outlined" onClick={onClose}>
                  Cancel
               </Button>
               <Button type="submit" variant="contained" loading={isSubmitting}>
                  {currentField ? 'Update' : 'Add New'}
               </Button>
            </DialogActions>
         </Form>
      </Dialog>
   );
}
