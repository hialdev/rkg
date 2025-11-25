import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { protectedApi } from '../lib/al/axios';

export interface TripData {
   id?: string;
   title?: string;
   slug?: string;
   description?: string;
   location?: string;
   country?: string;
   type?: string;
   duration?: string;
   price?: number;
   image?: any;
   min_people?: number;
   meet_point?: string;
   destinations?: any[];
   content?: string;
   open_dates?: {
      from_date?: string;
      to_date?: string;
   }[];
   itinerary?: {
      day?: number;
      activities?: {
         time?: string;
         description?: string;
      }[];
   }[];
   created_at?: string;
   updated_at?: string;
}

interface TripState {
   trips: TripData[];

   all: (params?: any) => Promise<any>;
   detail: ({ id }: { id: string }) => Promise<any>;
   add: ({ data }: { data: TripData }) => Promise<any>;
   update: ({ id, data }: { id: string; data: TripData }) => Promise<any>;
   delete: ({ id }: { id: string }) => Promise<any>;
}

const useTripStore = create<TripState>()(
   persist(
      (set, get) => ({
         trips: [],
         all: async (params?: any) => {
            const queryParams = new URLSearchParams();
            
            if (params) {
               if (params.page !== undefined) queryParams.append('page', params.page.toString());
               if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
               if (params.search !== undefined) queryParams.append('search', params.search);
               if (params.sort !== undefined) queryParams.append('sort', params.sort);
               if (params.order !== undefined) queryParams.append('order', params.order);
               if (params.type !== undefined) queryParams.append('type', params.type);
               if (params.country !== undefined) queryParams.append('country', params.country);
            }
            
            const queryString = queryParams.toString();
            const url = queryString ? `/trips?${queryString}` : '/trips';
            
            const response = await protectedApi.get(url);
            if (response.data.success && response.data.data) {
               set({ trips: response.data.data.trips || response.data.data });
            }
            return response.data;
         },
         detail: async ({ id }) => {
            const response = await protectedApi.get(`/trips/${id}`);
            return response.data;
         },
         add: async ({ data }) => {
            let payload: TripData | FormData = data;
            let config = {};

            // Jika ada field image yang instanceof File, gunakan FormData
            if (data.image instanceof File) {
               const formData = new FormData();

               // Mapping field satu per satu — aman dari TypeScript
               if (data.title) formData.append('title', data.title);
               if (data.slug) formData.append('slug', data.slug);
               if (data.description) formData.append('description', data.description);
               if (data.location) formData.append('location', data.location);
               if (data.country) formData.append('country', data.country);
               if (data.type) formData.append('type', data.type);
               if (data.duration) formData.append('duration', data.duration);
               if (data.price !== undefined && data.price !== null)
                  formData.append('price', String(data.price));
               if (data.min_people !== undefined && data.min_people !== null)
                  formData.append('min_people', String(data.min_people));
               if (data.meet_point) formData.append('meet_point', data.meet_point);
               if (data.content) formData.append('content', data.content);
               if (data.open_dates) formData.append('open_dates', JSON.stringify(data.open_dates));
               if (data.destinations)
                  formData.append('destinations', JSON.stringify(data.destinations));
               if (data.itinerary) formData.append('itinerary', JSON.stringify(data.itinerary));
               formData.append('image', data.image); // image selalu ada di sini (karena dicek instanceof File)

               payload = formData;
               config = {
                  headers: {
                     'Content-Type': 'multipart/form-data',
                  },
               };
            }

            const response = await protectedApi.post(`/trips`, payload, config);
            return response.data;
         },
         update: async ({ id, data }) => {
            let payload: TripData | FormData = data;
            let config = {};

            // Jika ada field image yang instanceof File, gunakan FormData
            if (data.image instanceof File) {
               const formData = new FormData();

               if (data.title) formData.append('title', data.title);
               if (data.slug) formData.append('slug', data.slug);
               if (data.description) formData.append('description', data.description);
               if (data.location) formData.append('location', data.location);
               if (data.country) formData.append('country', data.country);
               if (data.type) formData.append('type', data.type);
               if (data.duration) formData.append('duration', data.duration);
               if (data.price !== undefined && data.price !== null)
                  formData.append('price', String(data.price));
               if (data.min_people !== undefined && data.min_people !== null)
                  formData.append('min_people', String(data.min_people));
               if (data.meet_point) formData.append('meet_point', data.meet_point);
               if (data.content) formData.append('content', data.content);
               if (data.open_dates) formData.append('open_dates', JSON.stringify(data.open_dates));
               if (data.destinations)
                  formData.append('destinations', JSON.stringify(data.destinations));
               if (data.itinerary) formData.append('itinerary', JSON.stringify(data.itinerary));
               formData.append('image', data.image); // image selalu ada di sini (karena dicek instanceof File)

               payload = formData;
               config = {
                  headers: {
                     'Content-Type': 'multipart/form-data',
                  },
               };
            }

            const response = await protectedApi.post(`/trips/${id}`, payload, config);
            return response.data;
         },
         delete: async ({ id }) => {
            const response = await protectedApi.delete(`/trips/${id}`);
            return response.data;
         },
      }),
      {
         name: 'trip-store', // key di localStorage
         partialize: (state) => ({
            trips: state.trips,
         }), // hanya simpan ini
      }
   )
);

export default useTripStore;
