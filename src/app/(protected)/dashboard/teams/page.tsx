import type { Metadata } from 'next';

import { paths } from 'src/routes/al/paths';

import { CONFIG } from 'src/global-config';
import AuthGuard from 'src/guards/auth-guard';

import { TeamListView } from 'src/views/dashboard/team/list/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Teams - ${CONFIG.appName}` };

export default function Page() {
   return (
      <AuthGuard currentPath={`${paths.dashboard.root}`} requiredPermissions={[]}>
         <TeamListView />
      </AuthGuard>
   );
}
