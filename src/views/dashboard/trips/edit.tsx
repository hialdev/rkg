'use client';

import { useParams } from 'next/navigation';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { TripForm } from './components/form';
import { paths } from 'src/routes/al/paths';
import useTripStore from 'src/stores/trip';
import { useEffect, useState } from 'react';
import { toast } from 'src/components/snackbar';

export default function TripEdit() {
   const params = useParams();
   const { id } = params;
   const { detail } = useTripStore();
   const [tripData, setTripData] = useState<undefined | any>(undefined);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchTripDetail = async () => {
         if (!id) return;
         
         try {
            const tripId = Array.isArray(id) ? id[0] : id;
            if (!tripId) return;
            
            const res = await detail({ id: tripId });
            if (res.success) {
               setTripData(res.data);
            } else {
               toast.error('Gagal memuat data trip');
            }
         } catch (error) {
            toast.error('Gagal memuat data trip');
            console.error('Error fetching trip detail:', error);
         } finally {
            setLoading(false);
         }
      };

      fetchTripDetail();
   }, [id, detail]);

   if (loading) {
      return <div>Loading...</div>;
   }

   if (!id) {
      return <div>Invalid trip ID</div>;
   }

   return (
      <>
         <CustomBreadcrumbs
            heading="Edit Trip"
            links={[
               { name: 'Dashboard', href: paths.dashboard.root },
               { name: 'Trip', href: paths.dashboard.trip.root },
               { name: 'Edit' },
            ]}
            sx={{ mb: { xs: 3, md: 5 } }}
         />

         <TripForm 
            currentTrip={tripData} 
            onSuccess={() => console.log('Trip updated successfully')} 
         />
      </>
   );
}
