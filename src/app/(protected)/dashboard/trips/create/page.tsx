import type { Metadata } from 'next';

import { paths } from 'src/routes/al/paths';

import { CONFIG } from 'src/global-config';
import AuthGuard from 'src/guards/auth-guard';
import { DashboardContent } from 'src/layouts/dashboard';
import TripCreate from 'src/views/dashboard/trips/create';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Add New Trip - ${CONFIG.appName}` };

export default function Page() {
   return (
      <AuthGuard currentPath={`${paths.dashboard.trip.create}`} requiredPermissions={[]}>
         <DashboardContent>
            <TripCreate />
         </DashboardContent>
      </AuthGuard>
   );
}
