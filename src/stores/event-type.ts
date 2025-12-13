import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { protectedApi } from '../lib/al/axios';
import { EventType } from '../types/event-type';

export interface EventTypeData extends Omit<EventType, 'galleries'> {
   galleries?: (File | string)[];
}

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

            // Start - Unified FormData logic
            // Always use FormData for file uploads or mixed content types like galleries
            const hasFiles = data.image instanceof File;
            const hasGalleries = data.galleries && Array.isArray(data.galleries);

            if (hasFiles || hasGalleries) {
               const formData = new FormData();

               // Mapping fields
               if (data.title) formData.append('title', data.title);
               if (data.slug) formData.append('slug', data.slug);
               if (data.description) formData.append('description', data.description);
               if (data.content) formData.append('content', data.content);

               if (data.image instanceof File) {
                  formData.append('image', data.image);
               }

               // Handle galleries (mixed: File objects and URL strings)
               if (data.galleries && Array.isArray(data.galleries)) {
                  data.galleries.forEach((gallery) => {
                     // Append everything; files and strings
                     if (gallery) formData.append('galleries', gallery);
                  });
               }

               payload = formData;
               config = {
                  headers: {
                     'Content-Type': 'multipart/form-data',
                  },
               };
            } else {
               // JSON fallback
               payload = data;
            }

            const response = await protectedApi.post(`/event-types`, payload, config);
            return response.data;
         },
         update: async ({ id, data }) => {
            let payload: EventTypeData | FormData = data;
            let config = {};

            // Start - Unified FormData logic
            // Always use FormData for file uploads or mixed content types like galleries
            const hasFiles = data.image instanceof File;
            const hasGalleries = data.galleries && Array.isArray(data.galleries);

            if (hasFiles || hasGalleries) {
               const formData = new FormData();

               // Mapping fields
               if (data.title) formData.append('title', data.title);
               if (data.slug) formData.append('slug', data.slug);
               if (data.description) formData.append('description', data.description);
               if (data.content) formData.append('content', data.content);

               if (data.image instanceof File) {
                  formData.append('image', data.image);
               }

               // Handle galleries (mixed: File objects and URL strings)
               if (data.galleries && Array.isArray(data.galleries)) {
                  data.galleries.forEach((gallery) => {
                     // Append everything; files and strings
                     if (gallery) formData.append('galleries', gallery);
                  });
               }

               payload = formData;
               config = {
                  headers: {
                     'Content-Type': 'multipart/form-data',
                  },
               };
            } else {
               payload = data;
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
