'use client';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { TripForm } from './components/form';
import { paths } from 'src/routes/al/paths';

export default function TripCreate() {
   return (
      <>
         <CustomBreadcrumbs
            heading="Create New Trip"
            links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Trip', href: paths.dashboard.trip.root }, { name: 'Create' }]}
            sx={{ mb: { xs: 3, md: 5 } }}
         />

         <TripForm onSuccess={() => console.log('')} />
      </>
   );
}
