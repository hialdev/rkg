import type { Metadata } from 'next';

import { paths } from 'src/routes/al/paths';

import { CONFIG } from 'src/global-config';
import AuthGuard from 'src/guards/auth-guard';
import { DashboardContent } from 'src/layouts/dashboard';
import { ComingSoonView } from 'src/sections/coming-soon/view';
import { TripListView } from 'src/views/dashboard/trips/list/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `List Trips - ${CONFIG.appName}` };

export default function Page() {
   return (
      <AuthGuard currentPath={`${paths.dashboard.trip.root}`} requiredPermissions={[]}>
         <DashboardContent>
            <TripListView />
         </DashboardContent>
      </AuthGuard>
   );
}
