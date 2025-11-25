import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { protectedApi } from '../lib/al/axios';

export interface EventServiceData {
   id?: string;
   image?: any;
   title?: string;
   description?: string;
}

interface EventServiceState {
   eventServices: EventServiceData[];

   all: (params?: any) => Promise<any>;
   detail: ({ id }: { id: string }) => Promise<any>;
   add: ({ data }: { data: EventServiceData }) => Promise<any>;
   update: ({ id, data }: { id: string; data: EventServiceData }) => Promise<any>;
   delete: ({ id }: { id: string }) => Promise<any>;
}

const useEventServiceStore = create<EventServiceState>()(
   persist(
      (set, get) => ({
         eventServices: [],
         all: async (params?: any) => {
            const queryParams = new URLSearchParams();
            
            if (params) {
               if (params.page !== undefined) queryParams.append('page', params.page.toString());
               if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
               if (params.search !== undefined) queryParams.append('search', params.search);
               if (params.sort !== undefined) queryParams.append('sort', params.sort);
               if (params.order !== undefined) queryParams.append('order', params.order);
            }
            
            const queryString = queryParams.toString();
            const url = queryString ? `/event-services?${queryString}` : '/event-services';
            
            const response = await protectedApi.get(url);
            if (response.data.success && response.data.data) {
               set({ eventServices: response.data.data.event_services || response.data.data });
            }
            return response.data;
         },
         detail: async ({ id }) => {
            const response = await protectedApi.get(`/event-services/${id}`);
            return response.data;
         },
         add: async ({ data }) => {
            let payload: EventServiceData | FormData = data;
            let config = {};

            // Jika ada field image yang instanceof File, gunakan FormData
            if (data.image instanceof File) {
               const formData = new FormData();

               // Mapping field satu per satu — aman dari TypeScript
               if (data.title) formData.append('title', data.title);
               if (data.description) formData.append('description', data.description);
               formData.append('image', data.image); // image selalu ada di sini (karena dicek instanceof File)

               payload = formData;
               config = {
                  headers: {
                     'Content-Type': 'multipart/form-data',
                  },
               };
            }

            const response = await protectedApi.post(`/event-services`, payload, config);
            return response.data;
         },
         update: async ({ id, data }) => {
            let payload: EventServiceData | FormData = data;
            let config = {};

            // Jika ada field image yang instanceof File, gunakan FormData
            if (data.image instanceof File) {
               const formData = new FormData();

               if (data.title) formData.append('title', data.title);
               if (data.description) formData.append('description', data.description);
               formData.append('image', data.image); // image selalu ada di sini (karena dicek instanceof File)

               payload = formData;
               config = {
                  headers: {
                     'Content-Type': 'multipart/form-data',
                  },
               };
            }

            const response = await protectedApi.post(`/event-services/${id}`, payload, config);
            return response.data;
         },
         delete: async ({ id }) => {
            const response = await protectedApi.delete(`/event-services/${id}`);
            return response.data;
         },
      }),
      {
         name: 'event-service-store', // key di localStorage
         partialize: (state) => ({
            eventServices: state.eventServices,
         }), // hanya simpan ini
      }
   )
);

export default useEventServiceStore;
