import type { Metadata } from 'next';

import { paths } from 'src/routes/al/paths';

import { CONFIG } from 'src/global-config';
import AuthGuard from 'src/guards/auth-guard';
import { DashboardContent } from 'src/layouts/dashboard';
import TripEdit from 'src/views/dashboard/trips/edit';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Edit Trip - ${CONFIG.appName}` };

export default function Page() {
   return (
      <AuthGuard currentPath={`${paths.dashboard.trip}`} requiredPermissions={[]}>
         <DashboardContent>
            <TripEdit />
         </DashboardContent>
      </AuthGuard>
   );
}
