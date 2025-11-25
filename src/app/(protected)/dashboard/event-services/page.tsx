import type { Metadata } from 'next';

import { paths } from 'src/routes/al/paths';

import { CONFIG } from 'src/global-config';
import AuthGuard from 'src/guards/auth-guard';
import EventServiceView from 'src/views/dashboard/event-services/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Event Services - ${CONFIG.appName}` };

export default function Page() {
   return (
      <AuthGuard currentPath={`${paths.dashboard.root}/event-services`} requiredPermissions={[]}>
         <EventServiceView />
      </AuthGuard>
   );
}
