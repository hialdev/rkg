import { useBoolean } from 'minimal-shared/hooks';
import { IconButton, InputAdornment, OutlinedInput, Stack, Tooltip } from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type IClientTableFilters = {
   name: string;
};

type TableFilters<T> = {
   state: T;
   setState: (state: T) => void;
};

type Props = {
   filters: TableFilters<IClientTableFilters>;
   onResetPage: () => void;
   options: {
      roles: string[];
   };
};

export function ClientTableToolbar({ filters, onResetPage, options }: Props) {
   const { state, setState } = filters;

   const isFiltered = state.name !== '';

   const handleResetFilters = () => {
      onResetPage();
      setState({ name: '' });
   };

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
         }}
      >
         <OutlinedInput
            value={state.name}
            onChange={(event) => {
               onResetPage();
               setState({ name: event.target.value });
            }}
            placeholder="Search client..."
            startAdornment={
               <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
               </InputAdornment>
            }
            endAdornment={
               <InputAdornment position="end">
                  {isFiltered && (
                     <IconButton onClick={handleResetFilters} edge="end">
                        <Iconify icon="mingcute:close-line" />
                     </IconButton>
                  )}
               </InputAdornment>
            }
         />
      </Stack>
   );
}
