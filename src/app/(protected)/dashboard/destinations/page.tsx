import type { Metadata } from 'next';

import { paths } from 'src/routes/al/paths';

import { CONFIG } from 'src/global-config';
import AuthGuard from 'src/guards/auth-guard';
import { DashboardContent } from 'src/layouts/dashboard';
import { DestinationListView } from 'src/views/dashboard/destinations/list/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Destinations - ${CONFIG.appName}` };

export default function Page() {
   return (
      <AuthGuard currentPath={`${paths.dashboard.destinations.root}`} requiredPermissions={[]}>
         <DashboardContent>
            <DestinationListView />
         </DashboardContent>
      </AuthGuard>
   );
}
