import * as React from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { useBoolean } from 'minimal-shared/hooks';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import useFaqStore from 'src/stores/faq';
import { FaqForm } from './form';

// ----------------------------------------------------------------------

type Props = {
   row: any;
   selected: boolean;
   onSelectRow: () => void;
   onDeleteRow: () => void;
   onSuccessEdit?: () => void;
};

export function FaqTableRow({ row, selected, onSelectRow, onDeleteRow, onSuccessEdit }: Props) {
   const { id, title, content } = row;

   const confirm = useBoolean();
   const editDialog = useBoolean();
   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

   const openMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
   };

   const closeMenu = () => {
      setAnchorEl(null);
   };

   const handleDelete = async () => {
      try {
         if (id) {
            await onDeleteRow();
         }
      } catch (error) {
         console.error(error);
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

            <TableCell>
               <Typography noWrap maxWidth={300} variant="body2">
                  {content}
               </Typography>
            </TableCell>

            <TableCell align="right">
               <IconButton onClick={openMenu}>
                  <Iconify icon="eva:more-vertical-fill" />
               </IconButton>
            </TableCell>
         </TableRow>

         <Menu
            open={!!anchorEl}
            anchorEl={anchorEl}
            onClose={closeMenu}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
         >
            <MenuItem
               onClick={() => {
                  closeMenu();
                  editDialog.onTrue();
               }}
               sx={{ px: 2, gap: 2 }}
            >
               <Iconify icon="solar:pen-bold" width={20} />
               Edit
            </MenuItem>

            <MenuItem
               onClick={() => {
                  confirm.onTrue();
                  closeMenu();
               }}
               sx={{ color: 'error.main', px: 2, gap: 2 }}
            >
               <Iconify icon="solar:trash-bin-trash-bold" width={20} />
               Delete
            </MenuItem>
         </Menu>

         <ConfirmDialog
            open={confirm.value}
            onClose={confirm.onFalse}
            title="Delete"
            content="Are you sure want to delete?"
            action={
               <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                     handleDelete();
                     confirm.onFalse();
                  }}
               >
                  Delete
               </Button>
            }
         />

         <FaqForm
            open={editDialog.value}
            onClose={editDialog.onFalse}
            onSuccess={() => {
               editDialog.onFalse();
               onSuccessEdit?.();
            }}
            editData={row}
         />
      </>
   );
}
