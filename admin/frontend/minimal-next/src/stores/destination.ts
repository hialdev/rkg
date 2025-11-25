import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { protectedApi } from '../lib/al/axios';

export interface DestinationData {
   id?: string;
   title?: string;
   slug?: string;
   description?: string;
   image?: any;
}

interface DestinationState {
   destinations: DestinationData[];

   all: (params?: any) => Promise<any>;
   detail: ({ id }: { id: string }) => Promise<any>;
   add: ({ data }: { data: DestinationData }) => Promise<any>;
   update: ({ id, data }: { id: string; data: DestinationData }) => Promise<any>;
   delete: ({ id }: { id: string }) => Promise<any>;
}

const useDestinationStore = create<DestinationState>()(
   persist(
      (set, get) => ({
         destinations: [],
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
            const url = queryString ? `/destinations?${queryString}` : '/destinations';
            
            const response = await protectedApi.get(url);
            if (response.data.success && response.data.data) {
               set({ destinations: response.data.data.destinations || response.data.data });
            }
            return response.data;
         },
         detail: async ({ id }) => {
            const response = await protectedApi.get(`/destinations/${id}`);
            return response.data;
         },
         add: async ({ data }) => {
            let payload: DestinationData | FormData = data;
            let config = {};

            // Jika ada field image yang instanceof File, gunakan FormData
            if (data.image instanceof File) {
               const formData = new FormData();

               // Mapping field satu per satu — aman dari TypeScript
               if (data.title) formData.append('title', data.title);
               if (data.slug) formData.append('slug', data.slug);
               if (data.description) formData.append('description', data.description);
               formData.append('image', data.image); // image selalu ada di sini (karena dicek instanceof File)

               payload = formData;
               config = {
                  headers: {
                     'Content-Type': 'multipart/form-data',
                  },
               };
            }

            const response = await protectedApi.post(`/destinations`, payload, config);
            return response.data;
         },
         update: async ({ id, data }) => {
            let payload: DestinationData | FormData = data;
            let config = {};

            // Jika ada field image yang instanceof File, gunakan FormData
            if (data.image instanceof File) {
               const formData = new FormData();

               if (data.title) formData.append('title', data.title);
               if (data.slug) formData.append('slug', data.slug);
               if (data.description) formData.append('description', data.description);
               formData.append('image', data.image); // image selalu ada di sini (karena dicek instanceof File)

               payload = formData;
               config = {
                  headers: {
                     'Content-Type': 'multipart/form-data',
                  },
               };
            }

            const response = await protectedApi.post(`/destinations/${id}`, payload, config);
            return response.data;
         },
         delete: async ({ id }) => {
            const response = await protectedApi.delete(`/destinations/${id}`);
            return response.data;
         },
      }),
      {
         name: 'destination-store', // key di localStorage
         partialize: (state) => ({
            destinations: state.destinations,
         }), // hanya simpan ini
      }
   )
);

export default useDestinationStore;
