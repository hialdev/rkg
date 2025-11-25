import { paths } from 'src/routes/al/paths';

import { CONFIG } from 'src/global-config';
import AuthGuard from 'src/guards/auth-guard';

import { EventListView } from 'src/views/dashboard/events/list/view';

// ----------------------------------------------------------------------

export const metadata = {
   title: `Events - ${CONFIG.appName}`,
};

export default function Page() {
   return (
      <AuthGuard currentPath={`${paths.dashboard.root}/events`} requiredPermissions={['Read Event']}>
         <EventListView />
      </AuthGuard>
   );
}
