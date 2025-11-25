import type { Metadata } from 'next';

import { paths } from 'src/routes/al/paths';

import { CONFIG } from 'src/global-config';
import AuthGuard from 'src/guards/auth-guard';
import { TablesListView } from 'src/views/dashboard/crud/tables/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `CRUD Management - ${CONFIG.appName}` };

export default function Page() {
   return (
      <AuthGuard currentPath={`${paths.dashboard.crud.root}`} requiredPermissions={[]}>
         <>
            <TablesListView />
         </>
      </AuthGuard>
   );
}
