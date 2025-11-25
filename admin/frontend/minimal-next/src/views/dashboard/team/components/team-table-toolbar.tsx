
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

import { useSetState } from 'minimal-shared/hooks';

import { Iconify } from 'src/components/iconify';
import { TeamTableFilters } from 'src/types/team';

// ----------------------------------------------------------------------

type Props = {
   filters: ReturnType<typeof useSetState<TeamTableFilters>>;
   onResetPage: () => void;
   options: {
      roles: string[];
   };
};

export function TeamTableToolbar({ filters, onResetPage, options }: Props) {
   const { state, setState } = filters;

   return (
      <Stack
         spacing={3}
         direction={{
            xs: 'column',
            md: 'row',
         }}
         sx={{
            p: 2.5,
            pr: { xs: 2.5, md: 1 },
            borderRadius: 1.5,
            alignItems: { md: 'center' },
            bgcolor: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
         }}
      >
         <TextField
            fullWidth
            value={state.name}
            onChange={(event) => {
               setState({ name: event.target.value });
               onResetPage();
            }}
            placeholder="Search team..."
            InputProps={{
               startAdornment: (
                  <InputAdornment position="start">
                     <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
               ),
            }}
         />
      </Stack>
   );
}
