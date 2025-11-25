import type { Metadata } from 'next';

import { paths } from 'src/routes/al/paths';

import { CONFIG } from 'src/global-config';
import AuthGuard from 'src/guards/auth-guard';
import { FaqListView } from 'src/views/dashboard/faqs/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `FAQs - ${CONFIG.appName}` };

type Props = {
   searchParams: { [key: string]: string | string[] | undefined };
};

export default function Page({ searchParams }: Props) {
   return (
      <AuthGuard currentPath={paths.dashboard.faqs.root} requiredPermissions={[]}>
         <FaqListView />
      </AuthGuard>
   );
}
