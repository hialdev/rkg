import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

import { useSetState } from 'minimal-shared/hooks';
import { Iconify } from 'src/components/iconify';
import { IFaqTableFilters } from 'src/types/faq';

type Props = {
  filters: ReturnType<typeof useSetState<IFaqTableFilters>>;
  onResetPage: () => void;
};

export function FaqTableToolbar({ filters, onResetPage }: Props) {
  const { state: currentFilters, setState: updateFilters } = filters;

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ title: event.target.value });
    onResetPage();
 };

  return (
    <Box
      sx={{
        gap: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2.5, pb: 0
      }}
    >
      <TextField
        size="small"
        value={currentFilters.title}
        onChange={handleTitle}
        placeholder="Search faq..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          width: {
            xs: 1,
            sm: 240,
          },
        }}
      />
    </Box>
  );
}
