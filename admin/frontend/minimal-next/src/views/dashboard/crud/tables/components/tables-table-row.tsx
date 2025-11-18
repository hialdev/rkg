import type { TableData } from 'src/stores/table';

import { useRouter } from 'next/navigation';
import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Chip, useTheme, Typography } from '@mui/material';

import { paths } from 'src/routes/al/paths';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';


// ----------------------------------------------------------------------

type Props = {
   row: TableData;
   selected: boolean;
   editHref: string;
   onSelectRow: () => void;
   onDeleteRow: () => void;
   onSuccessEdit: () => void;
};

export function TablesTableRow({ row, selected, editHref, onSelectRow, onDeleteRow, onSuccessEdit }: Props) {
   const menuActions = usePopover();
   const confirmDialog = useBoolean();
   const quickEditForm = useBoolean();
   const theme = useTheme();
   const router = useRouter();
   
   const handleFields = () => {

   }


   const renderQuickEditForm = () => (
      <></>
      // <UserCUForm
      //    currentUser={row}
      //    open={quickEditForm.value}
      //    onSuccess={onSuccessEdit}
      //    onClose={quickEditForm.onFalse}
      // />
   );

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
               <Box>
                  <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
                     <Box display="flex" alignItems="center" justifyContent="center" padding={2} sx={{backgroundColor: theme.vars.palette.grey[300], color: theme.vars.palette.grey[600], borderRadius:'10px'}}>
                        <Iconify width={30} icon={row.icon ?? 'solar:database-bold-duotone'} />
                     </Box>
                     <Box>
                        <Typography
                           variant="subtitle1"
                        >
                           {row.name && row.name != "" ? row.name : '---'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                           <Iconify icon="solar:link-line-duotone" />
                           <Typography color='textDisabled'>{row.slug}</Typography>
                        </Box>
                     </Box>
                  </Box>
               </Box>
            </TableCell>

            <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.description && row.description != "" ? row.description : '---'}</TableCell>

            <TableCell sx={{ whiteSpace: 'nowrap' }}>
               <Chip variant='soft' color={row.generate_widget ? "success" : "error"} label={row.generate_widget ? "Widget Aktif" : "Widget Nonaktif"} />
            </TableCell>

            <TableCell sx={{ whiteSpace: 'nowrap' }}>
               <Button variant='soft' onClick={row.fields && row.fields.length > 0 ? handleFields : () => router.push(paths.dashboard.crud.root+'/'+row.id+'/field')}>
                  2 Fields
               </Button>
            </TableCell>

            <TableCell>
               <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Tooltip title="Quick edit" placement="top" arrow>
                     <IconButton
                        color={quickEditForm.value ? 'inherit' : 'default'}
                        onClick={quickEditForm.onTrue}
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

         {renderQuickEditForm()}
         {renderMenuActions()}
         {renderConfirmDialog()}
      </>
   );
}
