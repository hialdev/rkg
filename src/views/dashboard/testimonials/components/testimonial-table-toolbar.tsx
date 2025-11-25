import type { ITestimonialTableFilters } from 'src/types/testimonial';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

import { useSetState } from 'minimal-shared/hooks';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  filters: ReturnType<typeof useSetState<ITestimonialTableFilters>>;
  onResetPage: () => void;
};

export function TestimonialTableToolbar({ filters, onResetPage }: Props) {
  const { state, setState } = filters;

  const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
    onResetPage();
    setState({ name: event.target.value });
  };

  return (
    <Card>
      <Box
        sx={{
          p: 2.5,
          gap: 2,
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
        }}
      >
        <TextField
          value={state.name}
          onChange={handleName}
          placeholder="Search testimonials..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Card>
  );
}
