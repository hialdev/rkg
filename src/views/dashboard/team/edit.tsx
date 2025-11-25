"use client"

import type { TeamData } from 'src/stores/team';

import { useState, useEffect } from 'react';

import { paths } from 'src/routes/al/paths';

import useTeamStore from 'src/stores/team';
import { DashboardLayout } from 'src/layouts/al/dashboard/layout';

import { toast } from 'src/components/snackbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { LoadingScreen } from 'src/components/loading-screen';

import { TeamForm } from './components/form';

// ----------------------------------------------------------------------

type Props = {
   currentTeam: TeamData | null;
};

export function TeamEditView({ currentTeam }: Props) {
   const { detail } = useTeamStore();
   const [team, setTeam] = useState<TeamData | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchTeam = async () => {
         if (currentTeam?.id) {
            try {
               const response = await detail({ id: currentTeam.id });
               if (response.success) {
                  setTeam(response.data);
               } else {
                  toast.error('Failed to load team data');
               }
            } catch (error) {
               toast.error('Error loading team data');
            } finally {
               setLoading(false);
            }
         } else {
            setLoading(false);
         }
      };

      fetchTeam();
   }, [currentTeam?.id]);

   if (loading) {
      return <LoadingScreen />;
   }

   return (
      <DashboardLayout>
         <CustomBreadcrumbs
            heading="Edit Team"
            links={[
               { name: 'Dashboard', href: paths.dashboard.root },
               { name: 'Team', href: paths.dashboard.team },
               { name: team?.name || 'Edit' },
            ]}
            sx={{ mb: { xs: 3, md: 5 } }}
         />

         <TeamForm editData={team ?? undefined} onSuccess={() => {}} />
      </DashboardLayout>
   );
}
