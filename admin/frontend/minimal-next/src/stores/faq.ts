import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { protectedApi } from '../lib/al/axios';

export interface FaqData {
   id?: string;
   title?: string;
   content?: string;
}

interface FaqState {
   faqs: FaqData[];

   all: (params?: any) => Promise<any>;
   detail: ({ id }: { id: string }) => Promise<any>;
   add: ({ data }: { data: FaqData }) => Promise<any>;
   update: ({ id, data }: { id: string; data: FaqData }) => Promise<any>;
   delete: ({ id }: { id: string }) => Promise<any>;
}

const useFaqStore = create<FaqState>()(
   persist(
      (set, get) => ({
         faqs: [],
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
            const url = queryString ? `/faqs?${queryString}` : '/faqs';
            
            const response = await protectedApi.get(url);
            if (response.data.success && response.data.data) {
               set({ faqs: response.data.data.faqs || response.data.data });
            }
            return response.data;
         },
         detail: async ({ id }) => {
            const response = await protectedApi.get(`/faqs/${id}`);
            return response.data;
         },
         add: async ({ data }) => {
            const response = await protectedApi.post(`/faqs`, data);
            return response.data;
         },
         update: async ({ id, data }) => {
            const response = await protectedApi.post(`/faqs/${id}`, data);
            return response.data;
         },
         delete: async ({ id }) => {
            const response = await protectedApi.delete(`/faqs/${id}`);
            return response.data;
         },
      }),
      {
         name: 'faq-store', // key di localStorage
         partialize: (state) => ({
            faqs: state.faqs,
         }), // hanya simpan ini
      }
   )
);

export default useFaqStore;
