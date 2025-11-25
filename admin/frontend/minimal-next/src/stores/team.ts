import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { protectedApi } from '../lib/al/axios';

export interface TeamData {
   id?: string;
   name?: string;
   role?: string;
   summary?: string;
   image?: any;
}

interface TeamState {
   teams: TeamData[];

   all: (params?: any) => Promise<any>;
   detail: ({ id }: { id: string }) => Promise<any>;
   add: ({ data }: { data: TeamData }) => Promise<any>;
   update: ({ id, data }: { id: string; data: TeamData }) => Promise<any>;
   delete: ({ id }: { id: string }) => Promise<any>;
}

const useTeamStore = create<TeamState>()(
   persist(
      (set, get) => ({
         teams: [],
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
            const url = queryString ? `/teams?${queryString}` : '/teams';
            
            const response = await protectedApi.get(url);
            if (response.data.success && response.data.data) {
               set({ teams: response.data.data.teams || response.data.data });
            }
            return response.data;
         },
         detail: async ({ id }) => {
            const response = await protectedApi.get(`/teams/${id}`);
            return response.data;
         },
         add: async ({ data }) => {
            let payload: TeamData | FormData = data;
            let config = {};

            // Jika ada field image yang instanceof File, gunakan FormData
            if (data.image instanceof File) {
               const formData = new FormData();

               // Mapping field satu per satu — aman dari TypeScript
               if (data.name) formData.append('name', data.name);
               if (data.role) formData.append('role', data.role);
               if (data.summary) formData.append('summary', data.summary);
               formData.append('image', data.image); // image selalu ada di sini (karena dicek instanceof File)

               payload = formData;
               config = {
                  headers: {
                     'Content-Type': 'multipart/form-data',
                  },
               };
            }

            const response = await protectedApi.post(`/teams`, payload, config);
            return response.data;
         },
         update: async ({ id, data }) => {
            let payload: TeamData | FormData = data;
            let config = {};

            // Jika ada field image yang instanceof File, gunakan FormData
            if (data.image instanceof File) {
               const formData = new FormData();

               if (data.name) formData.append('name', data.name);
               if (data.role) formData.append('role', data.role);
               if (data.summary) formData.append('summary', data.summary);
               formData.append('image', data.image); // image selalu ada di sini (karena dicek instanceof File)

               payload = formData;
               config = {
                  headers: {
                     'Content-Type': 'multipart/form-data',
                  },
               };
            }

            const response = await protectedApi.post(`/teams/${id}`, payload, config);
            return response.data;
         },
         delete: async ({ id }) => {
            const response = await protectedApi.delete(`/teams/${id}`);
            return response.data;
         },
      }),
      {
         name: 'team-store', // key di localStorage
         partialize: (state) => ({
            teams: state.teams,
         }), // hanya simpan ini
      }
   )
);

export default useTeamStore;
