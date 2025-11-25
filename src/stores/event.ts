import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { protectedApi } from '../lib/al/axios';

export interface EventData {
   id?: string;
   title?: string;
   slug?: string;
   image?: any;
   description?: string;
   content?: string;
   client?: string;
}

interface EventState {
   events: EventData[];

   all: (params?: any) => Promise<any>;
   detail: ({ id }: { id: string }) => Promise<any>;
   add: ({ data }: { data: EventData }) => Promise<any>;
   update: ({ id, data }: { id: string; data: EventData }) => Promise<any>;
   delete: ({ id }: { id: string }) => Promise<any>;
}

const useEventStore = create<EventState>()(
   persist(
      (set, get) => ({
         events: [],
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
            const url = queryString ? `/events?${queryString}` : '/events';
            
            const response = await protectedApi.get(url);
            if (response.data.success && response.data.data) {
               set({ events: response.data.data.events || response.data.data });
            }
            return response.data;
         },
         detail: async ({ id }) => {
            const response = await protectedApi.get(`/events/${id}`);
            return response.data;
         },
         add: async ({ data }) => {
            let payload: EventData | FormData = data;
            let config = {};

            // Jika ada field image yang instanceof File, gunakan FormData
            if (data.image instanceof File) {
               const formData = new FormData();

               // Mapping field satu per satu — aman dari TypeScript
               if (data.title) formData.append('title', data.title);
               if (data.slug) formData.append('slug', data.slug);
               if (data.description) formData.append('description', data.description);
               if (data.content) formData.append('content', data.content);
               if (data.client) formData.append('client', data.client);
               formData.append('image', data.image); // image selalu ada di sini (karena dicek instanceof File)

               payload = formData;
               config = {
                  headers: {
                     'Content-Type': 'multipart/form-data',
                  },
               };
            }

            const response = await protectedApi.post(`/events`, payload, config);
            return response.data;
         },
         update: async ({ id, data }) => {
            let payload: EventData | FormData = data;
            let config = {};

            // Jika ada field image yang instanceof File, gunakan FormData
            if (data.image instanceof File) {
               const formData = new FormData();

               if (data.title) formData.append('title', data.title);
               if (data.slug) formData.append('slug', data.slug);
               if (data.description) formData.append('description', data.description);
               if (data.content) formData.append('content', data.content);
               if (data.client) formData.append('client', data.client);
               formData.append('image', data.image); // image selalu ada di sini (karena dicek instanceof File)

               payload = formData;
               config = {
                  headers: {
                     'Content-Type': 'multipart/form-data',
                  },
               };
            }

            const response = await protectedApi.post(`/events/${id}`, payload, config);
            return response.data;
         },
         delete: async ({ id }) => {
            const response = await protectedApi.delete(`/events/${id}`);
            return response.data;
         },
      }),
      {
         name: 'event-store', // key di localStorage
         partialize: (state) => ({
            events: state.events,
         }), // hanya simpan ini
      }
   )
);

export default useEventStore;
