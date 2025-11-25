import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useSetState } from 'minimal-shared/hooks';
import { Iconify } from 'src/components/iconify';
import { IFaqTableFilters } from 'src/types/faq';

type Props = {
  filters: ReturnType<typeof useSetState<IFaqTableFilters>>;
  totalResults: number;
  onResetPage: () => void;
  sx?: React.CSSProperties | any;
};

export function FaqTableFiltersResult({ filters, totalResults, onResetPage, sx }: Props) {
  const { state: currentFilters } = filters;

 const handleResetFilters = () => {
    filters.setState({ title: '' });
    onResetPage();
  };

  return (
    <Stack spacing={1.5} sx={{ px: 2.5, pt: 0, ...sx }}>
      <Box display="flex" alignItems="center">
        <Typography variant="subtitle2" sx={{ mr: 0.5 }}>
          Filtered by:
        </Typography>

        {currentFilters.title && (
          <Box display="flex" alignItems="center" sx={{ typography: 'body2' }}>
            <Iconify icon="eva:funnel-fill" width={16} sx={{ mr: 0.5 }} />
            {currentFilters.title}
            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="eva:trash-2-outline" />}
              onClick={handleResetFilters}
              sx={{ ml: 1 }}
            >
              Clear
            </Button>
          </Box>
        )}
      </Box>

      <Typography variant="body2">
        <strong>{totalResults}</strong>
        {totalResults > 1 ? ' results' : ' result'} found
      </Typography>
    </Stack>
  );
}
