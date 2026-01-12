import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { protectedApi } from '../lib/al/axios';

export interface EventPlanData {
   id?: string;
   title?: string;
   step_order?: number;
   subtitle?: string;
   content?: string;
   images?: any[];
}

interface EventPlanState {
   eventPlans: EventPlanData[];

   all: (params?: any) => Promise<any>;
   detail: ({ id }: { id: string }) => Promise<any>;
   add: ({ data }: { data: EventPlanData }) => Promise<any>;
   update: ({ id, data }: { id: string; data: EventPlanData }) => Promise<any>;
   delete: ({ id }: { id: string }) => Promise<any>;
}

const useEventPlanStore = create<EventPlanState>()(
   persist(
      (set, get) => ({
         eventPlans: [],
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
            const url = queryString ? `/event-plans?${queryString}` : '/event-plans';

            const response = await protectedApi.get(url);
            if (response.data.success && response.data.data) {
               set({ eventPlans: response.data.data.event_plans || response.data.data });
            }
            return response.data;
         },
         detail: async ({ id }) => {
            const response = await protectedApi.get(`/event-plans/${id}`);
            return response.data;
         },
         add: async ({ data }) => {
            let payload: EventPlanData | FormData = data;
            let config = {};

            // Check if there are any File objects in images array
            const hasFiles = data.images && data.images.some((img) => img instanceof File);

            if (hasFiles) {
               const formData = new FormData();

               // Mapping field satu per satu
               if (data.title) formData.append('title', data.title);
               if (data.step_order !== undefined)
                  formData.append('step_order', data.step_order.toString());
               if (data.subtitle) formData.append('subtitle', data.subtitle);
               if (data.content) formData.append('content', data.content);

               // Append multiple images
               if (data.images && Array.isArray(data.images)) {
                  data.images.forEach((img: any) => {
                     formData.append('images', img);
                  });
               }

               payload = formData;
               config = {
                  headers: {
                     'Content-Type': 'multipart/form-data',
                  },
               };
            }

            const response = await protectedApi.post(`/event-plans`, payload, config);
            return response.data;
         },
         update: async ({ id, data }) => {
            let payload: EventPlanData | FormData = data;
            let config = {};

            // Check if there are any File objects in images array
            const hasFiles = data.images && data.images.some((img) => img instanceof File);

            if (hasFiles) {
               const formData = new FormData();

               if (data.title) formData.append('title', data.title);
               if (data.step_order !== undefined)
                  formData.append('step_order', data.step_order.toString());
               if (data.subtitle) formData.append('subtitle', data.subtitle);
               if (data.content) formData.append('content', data.content);

               // Append multiple images (both new Files and existing URL strings)
               if (data.images && Array.isArray(data.images)) {
                  data.images.forEach((img: any) => {
                     formData.append('images', img);
                  });
               }

               payload = formData;
               config = {
                  headers: {
                     'Content-Type': 'multipart/form-data',
                  },
               };
            }

            const response = await protectedApi.post(`/event-plans/${id}`, payload, config);
            return response.data;
         },
         delete: async ({ id }) => {
            const response = await protectedApi.delete(`/event-plans/${id}`);
            return response.data;
         },
      }),
      {
         name: 'event-plan-store', // key di localStorage
         partialize: (state) => ({
            eventPlans: state.eventPlans,
         }), // hanya simpan ini
      }
   )
);

export default useEventPlanStore;
