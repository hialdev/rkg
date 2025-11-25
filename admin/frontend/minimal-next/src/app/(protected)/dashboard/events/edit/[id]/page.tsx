import { paths } from 'src/routes/al/paths';

import { CONFIG } from 'src/global-config';
import AuthGuard from 'src/guards/auth-guard';
import { EventEditView } from 'src/views/dashboard/events/edit';


// ----------------------------------------------------------------------

export const metadata = {
   title: `Event Edit - ${CONFIG.appName}`,
};

export default function Page() {
   return (
      <AuthGuard currentPath={`${paths.dashboard.root}/events`} requiredPermissions={['Update Event']}>
         <EventEditView />
      </AuthGuard>
   );
}
