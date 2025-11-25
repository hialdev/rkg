import type { TableData } from 'src/stores/table';

import * as z from 'zod';
import { useState, useEffect } from 'react'; // 👈 tambahkan useState, useEffect
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { RouterLink } from 'src/routes/components';

import useTabletore from 'src/stores/table';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// Fungsi helper untuk slugify
const slugify = (str: string): string =>
   str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // hapus karakter non-alfanumerik kecuali spasi dan -
      .replace(/[\s_-]+/g, '-') // ganti spasi/underscore dengan -
      .replace(/^-+|-+$/g, ''); // hapus - di awal/akhir

export type TableCUSchema = z.infer<typeof TableObjectSchema>;

export const TableObjectSchema = z
   .object({
      name: z.string().min(1, { message: 'Name is required!' }),
      slug: z.string().min(1, { message: 'Slug is required!' }),
      description: z.string().optional(),
      icon: z.string().optional(),
      generate_widget: z.boolean().default(false),
   });

type Props = {
   open: boolean;
   onClose: () => void;
   onSuccess?: () => void;
   currentTable?: TableData;
};

export function TablesCUForm({ currentTable, open, onClose, onSuccess }: Props) {
   const { update, add } = useTabletore();

   const defaultValues = {
      name: currentTable?.name || '',
      slug: currentTable?.slug || '',
      description: currentTable?.description || '',
      icon: currentTable?.icon || '',
      generate_widget: currentTable?.generate_widget || false,
   };

   const methods = useForm({
      mode: 'onSubmit',
      resolver: zodResolver(TableObjectSchema),
      defaultValues,
   });

   const watchedName = useWatch({ control: methods.control, name: 'name' });
   const watchedIcon = useWatch({ control: methods.control, name: 'icon', defaultValue: defaultValues.icon });

   // 👇 Lacak apakah user sudah mengedit slug secara manual
   const [isSlugTouched, setIsSlugTouched] = useState(false);

   const {
      reset,
      handleSubmit,
      setValue,
      formState: { isSubmitting },
   } = methods;

   // 👇 Otomatis slugify name → slug (hanya jika belum disentuh)
   useEffect(() => {
      if (!isSlugTouched && !currentTable) {
         const slug = slugify(watchedName);
         setValue('slug', slug, { shouldValidate: false });
      }
   }, [watchedName, isSlugTouched, currentTable, setValue]);

   // 👇 Deteksi saat user mengedit slug
   const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsSlugTouched(true);
      setValue('slug', e.target.value, { shouldValidate: true });
   };

   const onSubmit = handleSubmit(async (data) => {
      try {
         const body = {
            name: data.name,
            slug: data.slug,
            description: data.description,
            icon: data.icon,
            generate_widget: data.generate_widget,
            ...(currentTable && { id: currentTable.id }),
         };

         const gas = currentTable
            ? await update({ id: currentTable.id ?? '', data: body })
            : await add({ data: body });

         if (gas?.success) {
            onSuccess?.();
            reset();
            toast.success(gas.message);
         }
         onClose();
      } catch (error) {
         console.error(error);
         toast.error('Terjadi kesalahan');
      }
   });

   return (
      <Dialog
         fullWidth
         maxWidth={false}
         open={open}
         onClose={onClose}
         slotProps={{
            paper: { sx: { maxWidth: 720 } },
         }}
      >
         <DialogTitle>{currentTable ? 'Update' : 'Add New'} Table</DialogTitle>

         <Form methods={methods} onSubmit={onSubmit}>
            <DialogContent sx={{ pt: 1 }}>
               <Box sx={{ rowGap: 2, columnGap: 2, display: 'grid' }}>
                  <Field.Text name="name" label="Full name" />

                  {/* 👇 Custom input untuk slug agar bisa deteksi perubahan manual */}
                  <Field.Text
                     name="slug"
                     label="Slug"
                     value={methods.watch('slug')}
                     onChange={handleSlugChange}
                  />

                  <Field.Text
                     name="icon"
                     label="ID Icon"
                     helperText={
                        <Box display="flex" alignItems="center" gap={2}>
                           <Iconify icon={watchedIcon || 'mdi:help-circle-outline'} width={24} />
                           <RouterLink target="_blank" color="info" href="https://icon-sets.iconify.design/solar">
                              Dapatkan ID icon di sini
                           </RouterLink>
                        </Box>
                     }
                  />
                  <Field.Switch name="generate_widget" label="Generate Widget" />
                  <Field.Text name="description" label="Description" multiline rows={2} />
               </Box>
            </DialogContent>

            <DialogActions>
               <Button variant="outlined" onClick={onClose}>
                  Cancel
               </Button>
               <Button type="submit" variant="contained" loading={isSubmitting}>
                  {currentTable ? 'Update' : 'Add New'}
               </Button>
            </DialogActions>
         </Form>
      </Dialog>
   );
}