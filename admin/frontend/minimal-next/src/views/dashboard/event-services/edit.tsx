'use client';

import { useEffect } from 'react';

import { useParams } from 'next/navigation';

import { Container, Typography, Box } from '@mui/material';

import useEventServiceStore from 'src/stores/event-service';
import { EventServiceForm } from './components/form';

export function EventServiceEditView({ id }: { id: string }) {
   const { eventServices, detail } = useEventServiceStore();
   
   useEffect(() => {
      if (id) {
         detail({ id });
      }
   }, [id, detail]);

   const eventData = eventServices.find((event: any) => event.id === id);

   return (
      <Container maxWidth="lg">
         <Typography variant="h4" gutterBottom>
            Edit Event Service
         </Typography>
         
         <Box mt={3}>
            <EventServiceForm
               editData={eventData}
               onSuccess={() => {
                  // Handle success action
                  window.location.href = '/dashboard/event-services';
               }}
            />
         </Box>
      </Container>
   );
}
