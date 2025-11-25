import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField'; // Import TextField from Material UI

import { useBoolean } from 'minimal-shared/hooks';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

type Props = {
   filters: any;
   onResetPage: () => void;
   options?: {
     [key: string]: any;
   };
};

export function DestinationTableToolbar({ filters, onResetPage, options }: Props) {
   const confirm = useBoolean();

   const [title, setTitle] = useState(filters.state.title);

   const handleSearch = () => {
      onResetPage();
      filters.setState({ title });
   };

   const handleReset = () => {
      onResetPage();
      setTitle('');
      filters.setState({ title: '' });
   };

   // Properly typed event handlers
   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value);
   };

   const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
         handleSearch();
      }
   };

   return (
      <>
         <Card>
            <Box
               gap={3}
               display="flex"
               alignItems="center"
               justifyContent="space-between"
               sx={{ p: 2.5, pr: 1.5 }}
            >
               <TextField
                  size="small"
                  value={title}
                  placeholder="Search destination..."
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  InputProps={{
                     startAdornment: (
                        <InputAdornment position="start">
                           <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                        </InputAdornment>
                     ),
                  }}
                  sx={{ width: 1, maxWidth: 360 }}
               />

               <Stack direction="row" spacing={1}>
                  <Button
                     variant="contained"
                     startIcon={<Iconify icon="eva:refresh-fill" />}
                     onClick={handleReset}
                  >
                     Reset
                  </Button>
               </Stack>
            </Box>
         </Card>

         <ConfirmDialog
            open={confirm.value}
            onClose={confirm.onFalse}
            title="Confirm"
            content="Are you sure want to reset?"
            action={
               <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                     handleReset();
                     confirm.onFalse();
                  }}
               >
                  Reset
               </Button>
            }
         />
      </>
   );
}
