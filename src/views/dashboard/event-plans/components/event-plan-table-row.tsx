import type { EventPlanData } from 'src/stores/event-plan';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'minimal-shared/hooks';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import useEventPlanStore from 'src/stores/event-plan';
import { EventPlanForm } from './form';

// ----------------------------------------------------------------------

type Props = {
   row: EventPlanData;
   selected: boolean;
   onSelectRow: () => void;
   onDeleteRow: () => void;
   onSuccessEdit: () => void;
   editHref: string;
};

export function EventPlanTableRow({
   row,
   selected,
   onSelectRow,
   onDeleteRow,
   onSuccessEdit,
   editHref,
}: Props) {
   const { id, title, subtitle, step_order } = row;

   const [open, setOpen] = useState<HTMLButtonElement | null>(null);

   const confirmDialog = useBoolean();
   const editDialog = useBoolean();

   const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
      setOpen(event.currentTarget);
   };

   const handleClosePopover = () => {
      setOpen(null);
   };

   const handleDelete = async () => {
      try {
         if (id) {
            const { delete: deleteEventPlan } = useEventPlanStore.getState();
            const response = await deleteEventPlan({ id });

            if (response.success) {
               toast.success(response.message || 'Event plan deleted successfully!');
               onDeleteRow();
            } else {
               toast.error(response.message || 'Failed to delete event plan');
            }
         }
      } catch (error) {
         console.error(error);
         toast.error('There was an error deleting the event plan!');
      } finally {
         confirmDialog.onFalse();
      }
   };

   return (
      <>
         <TableRow hover selected={selected}>
            <TableCell padding="checkbox">
               <Checkbox checked={selected} onClick={onSelectRow} />
            </TableCell>

            <TableCell>
               <Box gap={2} display="flex" alignItems="center">
                  <Typography variant="subtitle2" noWrap>
                     {title}
                  </Typography>
               </Box>
            </TableCell>

            <TableCell>{step_order}</TableCell>

            <TableCell>
               <Typography noWrap maxWidth={300} variant="body2">
                  {subtitle}
               </Typography>
            </TableCell>

            <TableCell align="right">
               <IconButton onClick={handleOpenPopover}>
                  <Iconify icon="eva:more-vertical-fill" />
               </IconButton>
            </TableCell>
         </TableRow>

         <Popover
            open={!!open}
            anchorEl={open}
            onClose={handleClosePopover}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
         >
            <Box sx={{ py: 1 }}>
               <Box
                  onClick={editDialog.onTrue}
                  sx={{
                     py: 1.5,
                     px: 2,
                     typography: 'body2',
                     display: 'flex',
                     gap: 1,
                     cursor: 'pointer',
                     alignItems: 'center',
                  }}
               >
                  <Iconify icon="solar:pen-bold" width={20} />
                  Edit
               </Box>

               <Box
                  onClick={() => {
                     confirmDialog.onTrue();
                     handleClosePopover();
                  }}
                  sx={{
                     py: 1.5,
                     px: 2,
                     typography: 'body2',
                     display: 'flex',
                     gap: 1,
                     cursor: 'pointer',
                     alignItems: 'center',
                     color: "red"
                  }}
               >
                  <Iconify icon="solar:trash-bin-trash-bold" width={20} />
                  Delete
               </Box>
            </Box>
         </Popover>

         <ConfirmDialog
            open={confirmDialog.value}
            onClose={confirmDialog.onFalse}
            title="Delete"
            content="Are you sure want to delete?"
            action={
               <button onClick={handleDelete} className="btn btn-danger">
                  Delete
               </button>
            }
         />

         <EventPlanForm open={editDialog.value} editData={row} onSuccess={editDialog.onFalse} onClose={editDialog.onFalse} />
      </>
   );
}
