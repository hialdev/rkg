import { IconButton, Stack, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
   filters: {
      state: {
         name: string;
      };
      setState: (state: { name: string }) => void;
   };
   totalResults: number;
   onResetPage: () => void;
   sx?: object;
};

export function ClientTableFiltersResult({ filters, totalResults, onResetPage, sx }: Props) {
   const { state } = filters;

   const handleResetFilters = () => {
      onResetPage();
      filters.setState({ name: '' });
   };

   return (
      <Stack
         spacing={1.5}
         direction="row"
         alignItems="center"
         justifyContent="space-between"
         sx={{ px: 2.5, py: 1.5, pr: 1, ...sx }}
      >
         <Typography variant="subtitle2" component="div">
            {totalResults} data found
         </Typography>

         <Stack spacing={1} direction="row" flexWrap="wrap" alignItems="center">
            {state.name && (
               <Stack
                  key="name"
                  spacing={0.5}
                  direction="row"
                  alignItems="center"
                  sx={{
                     py: 0.25,
                     px: 1,
                     mr: 0.5,
                     borderRadius: 0.75,
                     typography: 'caption',
                     bgcolor: 'info.lighter',
                  }}
               >
                  <span>Name:</span>
                  <strong>{state.name}</strong>
                  <IconButton size="small" onClick={() => filters.setState({ name: '' })}>
                     <Iconify icon="mingcute:close-line" width={16} />
                  </IconButton>
               </Stack>
            )}

            <IconButton size="small" onClick={handleResetFilters}>
               <Iconify icon="mingcute:close-line" />
            </IconButton>
         </Stack>
      </Stack>
   );
}
