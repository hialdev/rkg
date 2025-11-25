import type { TestimonialItem } from 'src/types/testimonial';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { useBoolean } from 'minimal-shared/hooks';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';
import { usePopover } from 'minimal-shared/hooks';
import { Image } from 'src/components/image';
import { CONFIG } from 'src/global-config';
import { TestimonialForm } from './form';

// ----------------------------------------------------------------------

type Props = {
   row: TestimonialItem;
   selected: boolean;
   onSelectRow: () => void;
   onDeleteRow: () => void;
   onSuccessEdit: () => void;
};

export function TestimonialTableRow({
   row,
   selected,
   onSelectRow,
   onDeleteRow,
   onSuccessEdit,
}: Props) {
   const { name, role, image, quote, galleries } = row;

   const [currentTestimonial, setCurrentTestimonial] = useState<TestimonialItem | null>(null);
   const editDialog = useBoolean();
   const confirmDialog = useBoolean();

   const popover = usePopover();

   const handleEdit = () => {
      setCurrentTestimonial(row);
      editDialog.onTrue();
      popover.onClose();
   };

   const handleDelete = () => {
      confirmDialog.onTrue();
      popover.onClose();
   };

   // Function to render galleries
   const renderGalleries = () => {
      let parsedGalleries: any[] = [];
      if (typeof row.galleries == 'string') {
         parsedGalleries = JSON.parse(row?.galleries ?? []);
      }
      if (!parsedGalleries || parsedGalleries.length === 0) {
         return (
            <Typography variant="body2" color="text.secondary">
               No Galleries
            </Typography>
         );
      }

      if (Array.isArray(parsedGalleries)) {
         return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
               {parsedGalleries.slice(0, 3).map((gallery, index) => (
                  <Image
                     key={index}
                     src={typeof gallery === 'string' ? `${CONFIG.apiHostUrl}/${gallery}` : ''}
                     alt={`Gallery ${index + 1}`}
                     sx={{ width: 32, height: 32, borderRadius: 1, objectFit: 'cover' }}
                  />
               ))}
               {parsedGalleries.length > 3 && (
                  <Typography variant="caption" color="text.secondary">
                     +{parsedGalleries.length - 3}
                  </Typography>
               )}
            </Box>
         );
      }

      return (
         <Typography variant="body2" color="text.secondary">
            Invalid parsedGalleries
         </Typography>
      );
   };

   return (
      <>
         <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
            <TableCell padding="checkbox">
               <Checkbox
                  checked={selected}
                  onClick={onSelectRow}
                  slotProps={{
                     input: {
                        id: `${row.id}-checkbox`,
                        'aria-label': `${row.id} checkbox`,
                     },
                  }}
               />
            </TableCell>

            <TableCell>
               <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                     src={image ? `${CONFIG.apiHostUrl}/${image}` : undefined}
                     alt={name}
                     sx={{ width: 48, height: 48 }}
                  >
                     {name?.charAt(0)?.toUpperCase()}
                  </Avatar>

                  <ListItemText
                     primary={name}
                     secondary={role}
                     primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                     secondaryTypographyProps={{ typography: 'caption' }}
                  />
               </Stack>
            </TableCell>

            <TableCell>
               <Typography variant="body2" noWrap>
                  {role}
               </Typography>
            </TableCell>

            <TableCell>
               <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                  {quote}
               </Typography>
            </TableCell>

            <TableCell>{renderGalleries()}</TableCell>

            <TableCell align="right">
               <IconButton
                  color={popover.open ? 'inherit' : 'default'}
                  onClick={(event) => {
                     setCurrentTestimonial(row);
                     popover.onOpen(event);
                  }}
               >
                  <Iconify icon="eva:more-vertical-fill" />
               </IconButton>
            </TableCell>
         </TableRow>

         <CustomPopover
            open={popover.open}
            anchorEl={popover.anchorEl}
            onClose={popover.onClose}
            sx={{ width: 160 }}
         >
            <MenuItem
               onClick={() => {
                  handleEdit();
               }}
            >
               <ListItemIcon>
                  <Iconify icon="solar:pen-bold" />
               </ListItemIcon>
               Edit
            </MenuItem>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <MenuItem
               onClick={() => {
                  handleDelete();
               }}
               sx={{ color: 'error.main' }}
            >
               <ListItemIcon>
                  <Iconify icon="solar:trash-bin-trash-bold" />
               </ListItemIcon>
               Delete
            </MenuItem>
         </CustomPopover>

         <Dialog
            open={editDialog.value}
            onClose={() => {
               editDialog.onFalse();
               setCurrentTestimonial(null);
            }}
            maxWidth="md"
            fullWidth
         >
            <DialogTitle>
               {currentTestimonial?.id ? 'Edit Testimonial' : 'Add Testimonial'}
            </DialogTitle>
            <DialogContent dividers>
               <TestimonialForm
                  currentTestimonial={currentTestimonial || undefined}
                  onSuccess={() => {
                     onSuccessEdit();
                     editDialog.onFalse();
                     setCurrentTestimonial(null);
                  }}
               />
            </DialogContent>
         </Dialog>

         <ConfirmDialog
            open={confirmDialog.value}
            onClose={confirmDialog.onFalse}
            title="Delete"
            content="Are you sure want to delete?"
            action={
               <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                     onDeleteRow();
                     confirmDialog.onFalse();
                  }}
               >
                  Delete
               </Button>
            }
         />
      </>
   );
}
