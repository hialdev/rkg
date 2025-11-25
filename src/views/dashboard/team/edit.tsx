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
import { Box } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

type Props = {
   id: string;
};

export function TeamEditView({ id }: Props) {
   const { detail } = useTeamStore();
   const [team, setTeam] = useState<TeamData | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchTeam = async () => {
         if (id) {
            try {
               const response = await detail({ id: id });
               if (response.success) {
                  setTeam(response.data);
                  console.log("Response Team Data : ", response.data)
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
   }, [id]);

   if (loading) {
      return <LoadingScreen />;
   }

   return (
      <DashboardContent>
         <CustomBreadcrumbs
            heading="Edit Team"
            links={[
               { name: 'Dashboard', href: paths.dashboard.root },
               { name: 'Team', href: paths.dashboard.team },
               { name: team?.name || 'Edit' },
            ]}
            sx={{ mb: { xs: 3, md: 5 } }}
         />

         <TeamForm editData={team ?? undefined} open={true} onSuccess={() => {}} />
      </DashboardContent>
   );
}
