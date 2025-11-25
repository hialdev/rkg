import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { protectedApi } from '../lib/al/axios';
import { EventType } from '../types/event-type';

export interface EventTypeData extends EventType {}

interface EventTypeState {
   eventTypes: EventTypeData[];

   all: (params?: any) => Promise<any>;
   detail: ({ id }: { id: string }) => Promise<any>;
   add: ({ data }: { data: EventTypeData }) => Promise<any>;
   update: ({ id, data }: { id: string; data: EventTypeData }) => Promise<any>;
   delete: ({ id }: { id: string }) => Promise<any>;
}

const useEventTypeStore = create<EventTypeState>()(
   persist(
      (set, get) => ({
         eventTypes: [],
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
            const url = queryString ? `/event-types?${queryString}` : '/event-types';
            
            const response = await protectedApi.get(url);
            if (response.data.success && response.data.data) {
               set({ eventTypes: response.data.data.event_types || response.data.data });
            }
            return response.data;
         },
         detail: async ({ id }) => {
            const response = await protectedApi.get(`/event-types/${id}`);
            return response.data;
         },
         add: async ({ data }) => {
            let payload: EventTypeData | FormData = data;
            let config = {};

            // Jika ada field image yang instanceof File atau galleries yang merupakan array file, gunakan FormData
            if (data.image instanceof File || (data.galleries && Array.isArray(data.galleries) && data.galleries.some(gallery => gallery instanceof File))) {
               const formData = new FormData();

               // Mapping field satu per satu — aman dari TypeScript
               if (data.title) formData.append('title', data.title);
               if (data.slug) formData.append('slug', data.slug);
               if (data.description) formData.append('description', data.description);
               if (data.content) formData.append('content', data.content);
               if (data.image instanceof File) {
                  formData.append('image', data.image);
               }

               // Handle galleries
               if (data.galleries && Array.isArray(data.galleries)) {
                  // Filter hanya file yang merupakan instance File untuk dikirim ke backend
                  const fileGalleries = data.galleries.filter(gallery => gallery instanceof File);
                  fileGalleries.forEach((gallery, index) => {
                     if (gallery instanceof File) {
                        formData.append('galleries', gallery);
                     }
                  });
               }

               payload = formData;
               config = {
                  headers: {
                     'Content-Type': 'multipart/form-data',
                  },
               };
            } else {
               // Jika tidak ada file, konversi galleries dari array string ke JSON string
               if (data.galleries && Array.isArray(data.galleries)) {
                  // Hanya perlu mengonversi jika galleries adalah array (bukan string JSON)
                  const processedData = {
                     ...data,
                     galleries: JSON.stringify(data.galleries)
                  };
                  payload = processedData;
               }
            }

            const response = await protectedApi.post(`/event-types`, payload, config);
            return response.data;
         },
         update: async ({ id, data }) => {
            let payload: EventTypeData | FormData = data;
            let config = {};

            // Jika ada field image yang instanceof File atau galleries yang merupakan array file, gunakan FormData
            if (data.image instanceof File || (data.galleries && Array.isArray(data.galleries) && data.galleries.some(gallery => gallery instanceof File))) {
               const formData = new FormData();

               // Mapping field satu per satu — aman dari TypeScript
               if (data.title) formData.append('title', data.title);
               if (data.slug) formData.append('slug', data.slug);
               if (data.description) formData.append('description', data.description);
               if (data.content) formData.append('content', data.content);
               if (data.image instanceof File) {
                  formData.append('image', data.image);
               }

               // Handle galleries
               if (data.galleries && Array.isArray(data.galleries)) {
                  // Filter hanya file yang merupakan instance File untuk dikirim ke backend
                  const fileGalleries = data.galleries.filter(gallery => gallery instanceof File);
                  fileGalleries.forEach((gallery, index) => {
                     if (gallery instanceof File) {
                        formData.append('galleries', gallery);
                     }
                  });
               }

               payload = formData;
               config = {
                  headers: {
                     'Content-Type': 'multipart/form-data',
                  },
               };
            } else {
               // Jika tidak ada file, konversi galleries dari array string ke JSON string
               if (data.galleries && Array.isArray(data.galleries)) {
                  // Hanya perlu mengonversi jika galleries adalah array (bukan string JSON)
                  const processedData = {
                     ...data,
                     galleries: JSON.stringify(data.galleries)
                  };
                  payload = processedData;
               }
            }

            const response = await protectedApi.post(`/event-types/${id}`, payload, config);
            return response.data;
         },
         delete: async ({ id }) => {
            const response = await protectedApi.delete(`/event-types/${id}`);
            return response.data;
         },
      }),
      {
         name: 'event-type-store', // key di localStorage
         partialize: (state) => ({
            eventTypes: state.eventTypes,
         }), // hanya simpan ini
      }
   )
);

export default useEventTypeStore;
