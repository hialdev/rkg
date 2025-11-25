import type { Metadata } from 'next';

import { paths } from 'src/routes/al/paths';

import { CONFIG } from 'src/global-config';
import AuthGuard from 'src/guards/auth-guard';
import { TeamCreateView } from 'src/views/dashboard/team/create';


// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Create Team - ${CONFIG.appName}` };

export default function Page() {
   return (
      <AuthGuard currentPath={`${paths.dashboard.root}`} requiredPermissions={[]}>
         <TeamCreateView />
      </AuthGuard>
   );
}
