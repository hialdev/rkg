import type { DestinationData } from 'src/stores/destination';

import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import { Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';

import Link from 'next/link';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';
import { DestinationForm } from './form';

// ----------------------------------------------------------------------

type Props = {
   row: DestinationData;
   selected: boolean;
   editHref?: string;
   onSelectRow: () => void;
   onDeleteRow: () => void;
   onSuccessEdit: () => void;
};

export function DestinationTableRow({ row, selected, editHref, onSelectRow, onDeleteRow, onSuccessEdit }: Props) {
   const menuActions = usePopover();
   const confirmDialog = useBoolean();
   const editForm = useBoolean();

   const renderEditForm = () => (
      <DestinationForm open={editForm.value} currentDestination={row} onSuccess={onSuccessEdit} onClose={onSuccessEdit}  />
   )

   const renderMenuActions = () => (
      <CustomPopover
         open={menuActions.open}
         anchorEl={menuActions.anchorEl}
         onClose={menuActions.onClose}
         slotProps={{ arrow: { placement: 'right-top' } }}
      >
         <MenuList>
            <MenuItem
               onClick={() => {
                  confirmDialog.onTrue();
                  menuActions.onClose();
               }}
               sx={{ color: 'error.main' }}
            >
               <Iconify icon="solar:trash-bin-trash-bold" />
               Delete
            </MenuItem>
         </MenuList>
      </CustomPopover>
   );

   const renderConfirmDialog = () => (
      <ConfirmDialog
         open={confirmDialog.value}
         onClose={confirmDialog.onFalse}
         title="Delete"
         content="Are you sure want to delete?"
         action={
            <Button variant="contained" color="error" onClick={onDeleteRow}>
               Delete
            </Button>
         }
      />
   );

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
               <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
                  <Avatar alt={row.title || 'Destination'} src={row.image ? process.env.NEXT_PUBLIC_API_HOST+'/'+row.image : ''} />

                  <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
                     <Typography
                        typography="body"
                     >
                        {row.title || '---'}
                     </Typography>
                     <Box component="span" sx={{ color: 'text.disabled' }}>
                        {row.description || '---'}
                     </Box>
                  </Stack>
               </Box>
            </TableCell>

            <TableCell sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
               {row.description ? (
                  <Typography
                     variant="body2"
                     sx={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                     }}
                  >
                     {row.description}
                  </Typography>
               ) : '---'}
            </TableCell>

            <TableCell>
               <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Tooltip title="Edit" placement="top" arrow>
                     <IconButton
                        color={editForm.value ? 'inherit' : 'default'}
                        onClick={editForm.onTrue}
                     >
                        <Iconify icon="solar:pen-bold" />
                     </IconButton>
                  </Tooltip>

                  <IconButton
                     color={menuActions.open ? 'inherit' : 'default'}
                     onClick={menuActions.onOpen}
                  >
                     <Iconify icon="eva:more-vertical-fill" />
                  </IconButton>
               </Box>
            </TableCell>
         </TableRow>

         {renderMenuActions()}
         {renderConfirmDialog()}
         {renderEditForm()}
      </>
   );
}
