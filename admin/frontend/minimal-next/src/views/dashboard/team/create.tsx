import { paths } from 'src/routes/al/paths';

import { DashboardLayout } from 'src/layouts/al/dashboard/layout';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { TeamForm } from './components/form';

// ----------------------------------------------------------------------

export function TeamCreateView() {
   return (
      <DashboardLayout>
         <CustomBreadcrumbs
            heading="Create Team"
            links={[
               { name: 'Dashboard', href: paths.dashboard.root },
               { name: 'Team', href: paths.dashboard.team },
               { name: 'New team' },
            ]}
            sx={{ mb: { xs: 3, md: 5 } }}
         />

         <TeamForm onSuccess={() => {}} />
      </DashboardLayout>
   );
}
