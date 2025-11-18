import type { Metadata } from 'next';

import { paths } from 'src/routes/al/paths';

import { CONFIG } from 'src/global-config';
import AuthGuard from 'src/guards/auth-guard';
import FieldView from 'src/views/dashboard/crud/fields/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Add New Dataset - ${CONFIG.appName}` };

export default function Page() {
   

   return (
      <AuthGuard currentPath={paths.dashboard.crud.root} requiredPermissions={[]}>
         <FieldView />
      </AuthGuard>
   );
}