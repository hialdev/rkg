'use client';

import { useParams } from 'next/navigation';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EventTypeForm } from './components/form';
import { paths } from 'src/routes/al/paths';
import useEventTypeStore from 'src/stores/event-type';
import { useEffect, useState } from 'react';
import { toast } from 'src/components/snackbar';

export default function EventTypeEdit({ id }: { id: string }) {
   const params = useParams();
   const { detail } = useEventTypeStore();
   const [eventTypeData, setEventTypeData] = useState<undefined | any>(undefined);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchEventTypeDetail = async () => {
         const eventTypeId = id || (Array.isArray(params?.id) ? params.id[0] : params?.id);
         if (!eventTypeId) return;
         
         try {
            const res = await detail({ id: eventTypeId });
            if (res.success) {
               setEventTypeData(res.data);
            } else {
               toast.error('Gagal memuat data event type');
            }
         } catch (error) {
            toast.error('Gagal memuat data event type');
            console.error('Error fetching event type detail:', error);
         } finally {
            setLoading(false);
         }
      };

      fetchEventTypeDetail();
   }, [id, params, detail]);

   if (loading) {
      return <div>Loading...</div>;
   }

   if (!id && !params?.id) {
      return <div>Invalid event type ID</div>;
   }

   return (
      <>
         <CustomBreadcrumbs
            heading="Edit Event Type"
            links={[
               { name: 'Dashboard', href: paths.dashboard.root },
               { name: 'Event Types', href: paths.dashboard.event_types.root },
               { name: 'Edit' },
            ]}
            sx={{ mb: { xs: 3, md: 5 } }}
         />

         <EventTypeForm 
            currentEventType={eventTypeData} 
            onSuccess={() => console.log('Event type updated successfully')} 
         />
      </>
   );
}
