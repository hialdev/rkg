'use client';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EventTypeForm } from './components/form';
import { paths } from 'src/routes/al/paths';

export default function EventTypeCreate() {
   return (
      <>
         <CustomBreadcrumbs
            heading="Create New Event Type"
            links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Event Types', href: paths.dashboard.event_types.root }, { name: 'Create' }]}
            sx={{ mb: { xs: 3, md: 5 } }}
         />

         <EventTypeForm onSuccess={() => console.log('')} />
      </>
   );
}
