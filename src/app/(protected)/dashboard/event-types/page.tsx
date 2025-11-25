import type { Metadata } from 'next';

import { paths } from 'src/routes/al/paths';

import { CONFIG } from 'src/global-config';
import AuthGuard from 'src/guards/auth-guard';
import { DashboardContent } from 'src/layouts/dashboard';
import { EventTypeListView } from 'src/views/dashboard/event-types/list/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Event Types - ${CONFIG.appName}` };

export default function Page() {
   return (
      <AuthGuard currentPath={`${paths.dashboard.event_types.root}`} requiredPermissions={[]}>
         <DashboardContent>
            <EventTypeListView />
         </DashboardContent>
      </AuthGuard>
   );
}
