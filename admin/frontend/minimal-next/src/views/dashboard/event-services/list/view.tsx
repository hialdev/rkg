'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { useBoolean } from 'minimal-shared/hooks';

import { EmptyContent } from 'src/components/empty-content';
import { EventServiceTable } from '../components/event-service-table';
import useEventServiceStore from 'src/stores/event-service';
import { EventServiceForm, EventServiceType } from '../components/form';

// ----------------------------------------------------------------------

export function EventServiceListView() {
  const [selectedEventService, setSelectedEventService] = useState<any>(null);
  const [openForm, setOpenForm] = useState(false);
  const drawer = useBoolean();
  const { eventServices, all } = useEventServiceStore();
  
  useState(() => {
    all();
  });

  const handleOpenForm = () => {
    setSelectedEventService(null);
    setOpenForm(true);
    drawer.onTrue();
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    drawer.onFalse();
    setSelectedEventService(null);
  };

  const handleEdit = (eventService: any) => {
    setSelectedEventService(eventService);
    setOpenForm(true);
    drawer.onTrue();
  };

  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Event Services</Typography>
        <Button variant="contained" startIcon={<i className="fa-solid fa-plus"></i>} onClick={handleOpenForm}>
          New Event Service
        </Button>
      </Stack>

      {eventServices && eventServices.length > 0 ? (
        <EventServiceTable 
          eventServices={eventServices} 
          onEdit={handleEdit}
          onDelete={all}
          editHref={(id: string) => `/dashboard/event-services/${id}/edit`}
        />
      ) : (
        <EmptyContent
          title="No Event Services"
          description="Create your first event service"
          action={
            <Button variant="contained" onClick={handleOpenForm}>
              Create Event Service
            </Button>
          }
        />
      )}

      <EventServiceForm
        open={drawer.value}
        onClose={handleCloseForm}
        editData={selectedEventService as EventServiceType}
        onSuccess={() => {
          all();
          handleCloseForm();
        }}
      />
    </Container>
  );
}
