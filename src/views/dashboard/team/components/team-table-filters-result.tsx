import type { TeamTableFilters } from 'src/types/team';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useSetState } from 'minimal-shared/hooks';

// ----------------------------------------------------------------------

type Props = {
   filters: ReturnType<typeof useSetState<TeamTableFilters>>;
   onResetPage: () => void;
   totalResults: number;
};

export function TeamTableFiltersResult({ filters, totalResults, onResetPage }: Props) {
   const { state, setState } = filters;

   const handleRemoveName = () => {
      setState({ name: '' });
      onResetPage();
   };

   const handleResetPage = () => {
      setState({ name: '' });
      onResetPage();
   };

   return (
      <Stack spacing={1.5} direction="row" flexWrap="wrap" alignItems="center">
         <Box sx={{ typography: 'body2' }}>
            <strong>{totalResults}</strong>
            <Typography component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
               results found
            </Typography>
         </Box>

         <Stack direction="row" flexWrap="wrap" spacing={1}>
            {state.name && (
               <Chip
                  label={`Name: ${state.name}`}
                  size="small"
                  onDelete={handleRemoveName}
                  sx={{ bgcolor: 'primary.lighter' }}
               />
            )}
         </Stack>

         {(state.name) && (
            <Button
               color="error"
               size="small"
               onClick={handleResetPage}
               sx={{ flexShrink: 0 }}
            >
               Clear
            </Button>
         )}
      </Stack>
   );
}
