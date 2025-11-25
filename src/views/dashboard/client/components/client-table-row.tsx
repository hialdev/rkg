import type { ClientData } from 'src/stores/client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import TableContainer from '@mui/material/TableContainer';

import { Iconify } from 'src/components/iconify';
import { Image } from 'src/components/image';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

type Props = {
   row: ClientData;
   selected: boolean;
   onSelectRow: () => void;
   onDeleteRow: () => void;
   onSuccessEdit: () => void;
};

export function ClientTableRow({
   row,
   selected,
   onSelectRow,
   onDeleteRow,
   onSuccessEdit
}: Props) {
   const { id, title, image } = row;

   const [openConfirm, setOpenConfirm] = useState(false);

   const handleOpenConfirm = () => {
      setOpenConfirm(true);
   };

   const handleCloseConfirm = () => {
      setOpenConfirm(false);
   };

   const handleConfirmDelete = () => {
      onDeleteRow();
      handleCloseConfirm();
   };

   return (
      <>
         <TableRow hover selected={selected}>
            <TableCell>
               
            </TableCell>
            <TableCell>
               <Box
                  sx={{
                     display: 'flex',
                     alignItems: 'center',
                     gap: 2,
                  }}
               >
                  <Avatar
                     alt={title}
                     src={image ? `${process.env.NEXT_PUBLIC_API_HOST}/${image}` : undefined}
                     sx={{ width: 48, height: 48 }}
                  />
                  <Box sx={{ maxWidth: 240 }}>
                     <Typography variant="body2" noWrap>
                        {title}
                     </Typography>
                  </Box>
               </Box>
            </TableCell>

            <TableCell align="right">
               <Iconify
                  icon="solar:trash-bin-trash-bold"
                  sx={{ cursor: 'pointer', color: 'text.disabled' }}
                  onClick={handleOpenConfirm}
               />
            </TableCell>
         </TableRow>

         <ConfirmDialog
            open={openConfirm}
            onClose={handleCloseConfirm}
            title="Delete"
            content="Are you sure want to delete?"
            action={
               <Iconify
                  icon="solar:trash-bin-trash-bold"
                  onClick={handleConfirmDelete}
                  color="error"
               />
            }
         />
      </>
   );
}
