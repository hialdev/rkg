import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { IDestinationTableFilters } from 'src/types/destination';
import type { FiltersResultProps } from 'src/components/filters-result';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = FiltersResultProps & {
   onResetPage: () => void;
   filters: UseSetStateReturn<IDestinationTableFilters>;
};

export function DestinationTableFiltersResult({ filters, onResetPage, totalResults, sx }: Props) {
   const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

   const handleRemoveTitle = useCallback(() => {
      onResetPage();
      updateFilters({ title: '' });
   }, [onResetPage, updateFilters]);

   const handleReset = useCallback(() => {
      onResetPage();
      resetFilters();
   }, [onResetPage, resetFilters]);

   return (
      <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
         <FiltersBlock label="Keyword:" isShow={!!currentFilters.title}>
            <Chip {...chipProps} label={currentFilters.title} onDelete={handleRemoveTitle} />
         </FiltersBlock>
      </FiltersResult>
   );
}
