import type { ITestimonialTableFilters } from 'src/types/testimonial';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useSetState } from 'minimal-shared/hooks';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  filters: ReturnType<typeof useSetState<ITestimonialTableFilters>>;
  totalResults: number;
  onResetPage: () => void;
  sx?: any;
};

export function TestimonialTableFiltersResult({ filters, totalResults, onResetPage, sx }: Props) {
  const { state, setState } = filters;

 const handleRemoveName = () => {
    onResetPage();
    setState({ name: '' });
  };

  const handleResetFilters = () => {
    onResetPage();
    setState({ name: '' });
  };

  const results = totalResults > 0 ? `${totalResults} results found` : 'No results found';

  return (
    <Paper
      sx={{
        p: 2,
        gap: 1,
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        ...sx,
      }}
    >
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Stack spacing={1} direction="row" flexWrap="wrap" sx={{ my: 0.5 }}>
          {!!state.name && (
            <Chip
              size="small"
              label={state.name}
              onDelete={handleRemoveName}
              color="primary"
              variant="soft"
            />
          )}
        </Stack>
      </Box>

      <Button
        size="small"
        color="error"
        onClick={handleResetFilters}
        startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
      >
        Clear
      </Button>
    </Paper>
  );
}
