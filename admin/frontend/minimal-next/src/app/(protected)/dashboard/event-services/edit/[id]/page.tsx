import type { Metadata } from 'next';

import { paths } from 'src/routes/al/paths';

import { CONFIG } from 'src/global-config';
import AuthGuard from 'src/guards/auth-guard';
import { EventServiceEditView } from 'src/views/dashboard/event-services/edit';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Edit Event Service - ${CONFIG.appName}` };

type Props = {
   params: { id: string };
};

export default function Page({ params }: Props) {
   const { id } = params;

   return (
      <AuthGuard currentPath={`${paths.dashboard.event_services}/${id}/edit`} requiredPermissions={[]}>
         <EventServiceEditView id={id} />
      </AuthGuard>
   );
}
