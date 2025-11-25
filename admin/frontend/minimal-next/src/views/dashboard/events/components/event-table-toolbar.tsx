'use client';

import { useSetState } from 'minimal-shared/hooks';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
   filters: {
      state: { title: string };
      setState: (newState: { title: string }) => void;
   };
   onResetPage: () => void;
};

export function EventTableToolbar({ filters, onResetPage }: Props) {
   const { state: currentFilters, setState: updateFilters } = filters;

   const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
      updateFilters({ title: event.target.value });
      onResetPage();
   };

   const handleResetSearch = () => {
      updateFilters({ title: '' });
      onResetPage();
   };

   return (
      <Toolbar
         sx={{
            gap: 1,
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            pt: { sm: 0 },
            pb: { xs: 1, sm: 0 },
         }}
      >
         <Box sx={{ flex: '1 1 auto', gap: 2, display: 'flex', alignItems: 'center' }}>
            <TextField
               value={currentFilters.title}
               onChange={handleSearch}
               placeholder="Search event..."
               size="small"
               variant="outlined"
               InputProps={{
                  startAdornment: (
                     <InputAdornment position="start">
                        <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                     </InputAdornment>
                  ),
                  endAdornment: (
                     <InputAdornment position="end">
                        <IconButton
                           onClick={handleResetSearch}
                           edge="end"
                           sx={{ visibility: currentFilters.title ? 'visible' : 'hidden' }}
                        >
                           <Iconify icon="mingcute:close-line" />
                        </IconButton>
                     </InputAdornment>
                  ),
               }}
               sx={{
                  maxWidth: { md: 300 },
                  width: { xs: '100%', md: 'auto' },
                  '& fieldset': {
                     borderColor: (theme) =>
                        `var(--mui-palette-${theme.palette.mode}-divider)`,
                  },
               }}
            />
         </Box>
      </Toolbar>
   );
}
