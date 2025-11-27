import type { TeamData } from 'src/stores/team';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'minimal-shared/hooks';

import { paths } from 'src/routes/paths';
import useTeamStore from 'src/stores/team';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { TeamForm } from './form';

// ----------------------------------------------------------------------

type Props = {
   row: TeamData;
   selected: boolean;
   onSelectRow: () => void;
   onDeleteRow: () => void;
   onSuccessEdit: () => void;
   editHref: string;
};

export function TeamTableRow({
   row,
   selected,
   onSelectRow,
   onDeleteRow,
   onSuccessEdit,
   editHref,
}: Props) {
   const { image, name, role, summary } = row;

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
         if (row.id) {
            const { delete: deleteTeam } = useTeamStore.getState();
            const response = await deleteTeam({ id: row.id });

            if (response.success) {
               toast.success(response.message || 'Team deleted successfully!');
               onDeleteRow();
            } else {
               toast.error(response.message || 'Failed to delete team');
            }
         }
      } catch (error) {
         console.error(error);
         toast.error('There was an error deleting the team!');
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
                  <Avatar
                     alt={name || 'Team member'}
                     src={
                        image
                           ? typeof image === 'string'
                              ? image.startsWith('http')
                                 ? image
                                 : `${process.env.NEXT_PUBLIC_API_HOST}/${image}`
                              : URL.createObjectURL(image)
                           : undefined
                     }
                     sx={{ width: 48, height: 48 }}
                  />
                  <Typography variant="subtitle2" noWrap>
                     {name}
                  </Typography>
               </Box>
            </TableCell>

            <TableCell>{role}</TableCell>

            <TableCell>
               <Typography noWrap maxWidth={300} variant="body2">
                  {summary}
               </Typography>
            </TableCell>

            <TableCell align="right">
               <Box>
                  <IconButton
                     onClick={editDialog.onTrue}
                     color={editDialog.value ? 'primary' : 'default'}
                  >
                     <Iconify icon="solar:pen-bold" />
                  </IconButton>

                  <IconButton color="error" onClick={confirmDialog.onTrue}>
                     <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
               </Box>
            </TableCell>
         </TableRow>

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

         <TeamForm editData={row} open={editDialog.value} onSuccess={onSuccessEdit} />
      </>
   );
}
