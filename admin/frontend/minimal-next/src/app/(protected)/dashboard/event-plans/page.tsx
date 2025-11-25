import type { Metadata } from 'next';

import { paths } from 'src/routes/al/paths';

import { CONFIG } from 'src/global-config';
import AuthGuard from 'src/guards/auth-guard';
import { EventPlanListView } from 'src/views/dashboard/event-plans/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Event Plans - ${CONFIG.appName}` };

export default function Page() {
   return (
      <AuthGuard currentPath={paths.dashboard.event_plans.root} requiredPermissions={[]}>
         <EventPlanListView />
      </AuthGuard>
   );
}
