import type { Metadata } from 'next';

import { paths } from 'src/routes/al/paths';

import { CONFIG } from 'src/global-config';
import AuthGuard from 'src/guards/auth-guard';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function Page() {
   return (
      <AuthGuard currentPath={`${paths.dashboard.root}`} requiredPermissions={[]}>
         <></>
      </AuthGuard>
   );
}
