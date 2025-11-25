'use client';

import { useParams } from 'next/navigation';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DestinationForm } from './components/form';
import { paths } from 'src/routes/al/paths';
import useDestinationStore from 'src/stores/destination';
import { useEffect, useState } from 'react';
import { toast } from 'src/components/snackbar';

export default function DestinationEdit() {
   const params = useParams();
   const { id } = params;
   const { detail } = useDestinationStore();
   const [destinationData, setDestinationData] = useState<undefined | any>(undefined);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchDestinationDetail = async () => {
         if (!id) return;
         
         try {
            const destinationId = Array.isArray(id) ? id[0] : id;
            if (!destinationId) return;
            
            const res = await detail({ id: destinationId });
            if (res.success) {
               setDestinationData(res.data);
            } else {
               toast.error('Gagal memuat data destination');
            }
         } catch (error) {
            toast.error('Gagal memuat data destination');
            console.error('Error fetching destination detail:', error);
         } finally {
            setLoading(false);
         }
      };

      if (id) {
         fetchDestinationDetail();
      }
   }, [id, detail]);

   if (loading) {
      return <div>Loading...</div>;
   }

   if (!id) {
      return <div>Invalid destination ID</div>;
   }

   return (
      <>
         <CustomBreadcrumbs
            heading="Edit Destination"
            links={[
               { name: 'Dashboard', href: paths.dashboard.root },
               { name: 'Destination', href: paths.dashboard.destinations.root },
               { name: 'Edit' },
            ]}
            sx={{ mb: { xs: 3, md: 5 } }}
         />

         <DestinationForm 
            currentDestination={destinationData} 
            onSuccess={() => console.log('Destination updated successfully')}
            isModal={false}
         />
      </>
   );
}
