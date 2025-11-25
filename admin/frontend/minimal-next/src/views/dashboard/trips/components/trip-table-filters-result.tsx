import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { ITripTableFilters } from 'src/types/trip';
import type { FiltersResultProps } from 'src/components/filters-result';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = FiltersResultProps & {
   onResetPage: () => void;
   filters: UseSetStateReturn<ITripTableFilters>;
};

export function TripTableFiltersResult({ filters, onResetPage, totalResults, sx }: Props) {
   const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

   const handleRemoveTitle = useCallback(() => {
      onResetPage();
      updateFilters({ title: '' });
   }, [onResetPage, updateFilters]);

   const handleRemoveType = useCallback(
      (inputValue: string) => {
         const newValue = currentFilters.type.filter((item) => item !== inputValue);

         onResetPage();
         updateFilters({ type: newValue });
      },
      [onResetPage, updateFilters, currentFilters.type]
   );

   const handleRemoveCountry = useCallback(
      (inputValue: string) => {
         const newValue = currentFilters.country.filter((item) => item !== inputValue);

         onResetPage();
         updateFilters({ country: newValue });
      },
      [onResetPage, updateFilters, currentFilters.country]
   );

   const handleReset = useCallback(() => {
      onResetPage();
      resetFilters();
   }, [onResetPage, resetFilters]);

   return (
      <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
         <FiltersBlock label="Type:" isShow={!!currentFilters.type.length}>
            {currentFilters.type.map((item) => (
               <Chip {...chipProps} key={item} label={item} onDelete={() => handleRemoveType(item)} />
            ))}
         </FiltersBlock>

         <FiltersBlock label="Country:" isShow={!!currentFilters.country.length}>
            {currentFilters.country.map((item) => (
               <Chip {...chipProps} key={item} label={item} onDelete={() => handleRemoveCountry(item)} />
            ))}
         </FiltersBlock>

         <FiltersBlock label="Keyword:" isShow={!!currentFilters.title}>
            <Chip {...chipProps} label={currentFilters.title} onDelete={handleRemoveTitle} />
         </FiltersBlock>
      </FiltersResult>
   );
}
