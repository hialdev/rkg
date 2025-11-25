'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { IEventTableFilters } from 'src/types/event';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

type Props = {
   filters: {
      state: IEventTableFilters;
      setState: (newState: IEventTableFilters) => void;
   };
   totalResults: number;
   onResetPage: () => void;
   sx?: any;
};

export function EventTableFiltersResult({ filters, totalResults, onResetPage, sx }: Props) {
   const { state } = filters;

   const canReset = !!state.title;

   const onReset = () => {
      filters.setState({ title: '' });
      onResetPage();
   };

   return (
      <Box sx={{ typography: 'body2', ...sx }}>
         <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
            <Typography component="span" variant="subtitle2">
               Filters:
            </Typography>

            {state.title && (
               <Label color="info" variant="soft" startIcon={<Iconify icon="eva:search-fill" />}>
                  {state.title}
               </Label>
            )}

            <Button
               onClick={onReset}
               startIcon={<Iconify icon="mingcute:close-line" />}
               sx={{ flexShrink: 0 }}
            >
               Reset
            </Button>
         </Box>

         <Typography
            component="span"
            sx={{
               ml: 1,
               fontSize: 14,
               color: 'text.secondary',
            }}
         >
            ({totalResults} results)
         </Typography>
      </Box>
   );
}
