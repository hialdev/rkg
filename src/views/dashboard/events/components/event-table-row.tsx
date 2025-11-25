'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { paths } from 'src/routes/al/paths';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'minimal-shared/hooks';
import { EventData } from 'src/stores/event';
import { CONFIG } from 'src/global-config';

import { Image } from 'src/components/image';

// ----------------------------------------------------------------------

type Props = {
   row: EventData;
   selected: boolean;
   onSelectRow: () => void;
   onDeleteRow: () => void;
   onSuccessEdit: () => void;
   editHref: string;
};

export function EventTableRow({
   row,
   selected,
   onSelectRow,
   onDeleteRow,
   onSuccessEdit,
   editHref,
}: Props) {
   const confirm = useBoolean();
   const [open, setOpen] = useState(false);

   const { title, description, slug, client, image } = row;

   return (
      <>
         <TableRow hover selected={selected}>
            <TableCell padding="checkbox">
               <Checkbox checked={selected} onClick={onSelectRow} />
            </TableCell>

            <TableCell>
               <Box gap={2} display="flex" alignItems="center">
                  <Image
                     src={
                        image
                           ? image.startsWith('http')
                              ? image
                              : `${CONFIG.apiHostUrl}/${image}`
                           : '/assets/empty/empty_image.jpg'
                     }
                     sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 1.5,
                        flexShrink: 0,
                        border: (theme: any) => `solid 1px ${theme.palette.divider}`,
                     }}
                  />
                  <Box>
                     <Typography noWrap variant="body2" sx={{ maxWidth: 300 }}>
                        {title}
                     </Typography>
                     <Typography noWrap variant="body2" color='textDisabled' sx={{ maxWidth: 300, fontStyle: 'italic' }}>
                        {slug}
                     </Typography>
                  </Box>
               </Box>
            </TableCell>

            <TableCell>
               <Typography noWrap variant="body2" sx={{ maxWidth: 240 }}>
                  {client}
               </Typography>
            </TableCell>

            <TableCell>
               <Typography noWrap variant="body2" sx={{ maxWidth: 400 }}>
                  {description}
               </Typography>
            </TableCell>

            <TableCell align="right">
               <Link href={editHref} color="inherit">
                  <IconButton color={open ? 'primary' : 'default'}>
                     <Iconify icon="solar:pen-bold" />
                  </IconButton>
               </Link>

               <IconButton color="error" onClick={confirm.onTrue}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
               </IconButton>
            </TableCell>
         </TableRow>

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
                     onDeleteRow();
                     confirm.onFalse();
                  }}
               >
                  Delete
               </Button>
            }
         />
      </>
   );
}
