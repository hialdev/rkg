import type { Metadata } from 'next';

import { paths } from 'src/routes/al/paths';

import { CONFIG } from 'src/global-config';
import AuthGuard from 'src/guards/auth-guard';

import { TeamListView } from 'src/views/dashboard/team/list/view';
import { TeamEditView } from 'src/views/dashboard/team/edit';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Teams - ${CONFIG.appName}` };

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;

   return (
      <AuthGuard currentPath={`${paths.dashboard.root}`} requiredPermissions={[]}>
         <TeamEditView id={id} />
      </AuthGuard>
   );
}
