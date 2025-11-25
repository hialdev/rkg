'use client';

import { useEffect, useState } from 'react';
import { redirect, useParams } from 'next/navigation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Container } from '@mui/material';

import { paths } from 'src/routes/al/paths';

import useEventStore, { EventData } from 'src/stores/event';
import { DashboardContent } from 'src/layouts/dashboard';
import { useBoolean } from 'minimal-shared/hooks';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EventForm } from './components/form';

// ----------------------------------------------------------------------

export function EventEditView() {
   const params = useParams();
   const eventId = params?.id as string;
   
   const { detail } = useEventStore();
   const [event, setEvent] = useState<EventData | null>(null);
   const [loading, setLoading] = useState(true);
   const editMode = useBoolean(true);

   useEffect(() => {
      const fetchEvent = async () => {
         try {
            setLoading(true);
            const response = await detail({ id: eventId });
            
            if (response.success) {
               setEvent(response.data);
            } else {
               toast.error(response.message || 'Failed to fetch event data');
            }
         } catch (error) {
            toast.error('An error occurred while fetching event data');
            console.error(error);
         } finally {
            setLoading(false);
         }
      };

      if (eventId) {
         fetchEvent();
      }
   }, [eventId, detail]);

   if (loading) {
      return <LoadingScreen />;
   }

   if (!event) {
      return (
         <DashboardContent>
            <CustomBreadcrumbs
               heading="Event"
               links={[
                  { name: 'Dashboard', href: paths.dashboard.root },
                  { name: 'Event', href: paths.dashboard.events.root },
                  { name: 'Edit' },
               ]}
               sx={{ mb: { xs: 3, md: 5 } }}
            />
            <Card>
               <Box p={3} sx={{ textAlign: 'center' }}>
                  Event not found
               </Box>
            </Card>
         </DashboardContent>
      );
   }

   return (
      <>
         <DashboardContent>
            <CustomBreadcrumbs
               heading="Event"
               links={[
                  { name: 'Dashboard', href: paths.dashboard.root },
                  { name: 'Event', href: paths.dashboard.events.root },
                  { name: 'Edit' },
               ]}
               sx={{ mb: { xs: 3, md: 5 } }}
            />

            <EventForm
               currentEvent={event}
               onSuccess={() => redirect(paths.dashboard.events.root)}
               open={true}
            />
         </DashboardContent>
      </>
   );
}
