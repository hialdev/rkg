import type { TripData } from 'src/stores/trip';

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
import { Chip, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';

import Link from 'next/link';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
   row: TripData;
   selected: boolean;
   editHref: string;
   onSelectRow: () => void;
   onDeleteRow: () => void;
   onSuccessEdit: () => void;
};

export function TripTableRow({
   row,
   selected,
   editHref,
   onSelectRow,
   onDeleteRow,
   onSuccessEdit,
}: Props) {
   const menuActions = usePopover();
   const confirmDialog = useBoolean();

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
                  <Avatar
                     alt={row.title || 'Trip'}
                     src={row.image ? process.env.NEXT_PUBLIC_API_HOST + '/' + row.image : ''}
                  />

                  <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
                     <Typography typography="body">{row.title || '---'}</Typography>
                     <Box component="span" sx={{ color: 'text.disabled' }}>
                        {row.location || '---'}
                     </Box>
                  </Stack>
               </Box>
            </TableCell>

            <TableCell sx={{ whiteSpace: 'nowrap' }}>
               {row.type ? (
                  row.type == 'open-trip' ? (
                     <Chip variant="soft" color="info" label="Open Trip" />
                  ) : row.type == 'one-day-trip' ? (
                     <Chip variant="soft" color="warning" label="One Day Trip" />
                  ) : (
                     <Chip variant="soft" color="secondary" label="Private Trip" />
                  )
               ) : (
                  <Chip variant="soft" color="error" label="Not Set" />
               )}
            </TableCell>

            <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.country || '---'}</TableCell>

            <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.duration || '---'}</TableCell>

            <TableCell sx={{ whiteSpace: 'nowrap' }}>
               {row.price ? `Rp ${row.price.toLocaleString()}` : '---'}
            </TableCell>

            <TableCell>
               <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Tooltip title="Edit" placement="top" arrow>
                     <Link href={editHref}>
                        <IconButton color="default">
                           <Iconify icon="solar:pen-bold" />
                        </IconButton>
                     </Link>
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
      </>
   );
}
