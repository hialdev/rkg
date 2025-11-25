'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { useBoolean } from 'minimal-shared/hooks';

import { EmptyContent } from 'src/components/empty-content';
import { EventPlanTable } from './components/event-plan-table';
import { EventPlanForm, type EventPlanType } from './components/form';
import useEventPlanStore from 'src/stores/event-plan';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/al/paths';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export function EventPlanListView() {
   const [selectedEventPlan, setSelectedEventPlan] = useState<any>(null);
   const [openForm, setOpenForm] = useState(false);
   const drawer = useBoolean();
   const { eventPlans, all } = useEventPlanStore();

   useState(() => {
      all();
   });

   const handleOpenForm = () => {
      setSelectedEventPlan(null);
      setOpenForm(true);
      drawer.onTrue();
   };

   const handleCloseForm = () => {
      setOpenForm(false);
      drawer.onFalse();
      setSelectedEventPlan(null);
   };

   const handleEdit = (eventPlan: any) => {
      setSelectedEventPlan(eventPlan);
      setOpenForm(true);
      drawer.onTrue();
   };

   return (
      <DashboardContent>
         <CustomBreadcrumbs
            heading="Event Plans"
            links={[
               { name: 'Dashboard', href: paths.dashboard.root },
               { name: 'Event Plan', href: paths.dashboard.event_plans.root },
               { name: 'List' },
            ]}
            action={
               <Button
                  onClick={handleOpenForm}
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
               >
                  New Event Plan
               </Button>
            }
            sx={{ mb: { xs: 3, md: 5 } }}
         />

         {eventPlans && eventPlans.length > 0 ? (
            <EventPlanTable
               eventPlans={eventPlans}
               onEdit={handleEdit}
               onDelete={all}
               editHref={(id: string) => `/dashboard/event-plans/${id}/edit`}
            />
         ) : (
            <EmptyContent
               title="No Event Plans"
               description="Create your first event plan"
               action={
                  <Button variant="contained" onClick={handleOpenForm}>
                     Create Event Plan
                  </Button>
               }
            />
         )}

         <EventPlanForm
            open={drawer.value}
            onClose={handleCloseForm}
            editData={selectedEventPlan as EventPlanType}
            onSuccess={() => {
               all();
               handleCloseForm();
            }}
         />
      </DashboardContent>
   );
}
