import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { paths } from 'src/routes/al/paths';

import { CONFIG } from 'src/global-config';
import AuthGuard from 'src/guards/auth-guard';
import { TeamEditView } from 'src/views/dashboard/team/edit';


// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Edit Team - ${CONFIG.appName}` };

type Props = {
   params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
   const { id } = await params;

   const currentTeam = null; // In a real app, you would fetch the team data by ID here

   if (!id) {
      notFound();
   }

   return (
      <AuthGuard currentPath={`${paths.dashboard.root}`} requiredPermissions={[]}>
         <TeamEditView currentTeam={currentTeam} />
      </AuthGuard>
   );
}
