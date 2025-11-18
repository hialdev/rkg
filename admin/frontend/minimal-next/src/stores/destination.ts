import type { RoleData } from "./role";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { protectedApi } from "src/lib/al/axios";

export interface DestinationData {
   id : string,
   image? : string | File,
   title: string,
   description?: string,
}

interface DestinationState {
   destinations: DestinationData | null;

   all: ({page, limit, search, sort, order} : {page?: number | string, limit?: number | string, search?: string, sort: string, order: "desc" | "asc"}) => Promise<any>;
   add: (data : DestinationData) => Promise<any>;
   detail: ({id} : {id: string}) => Promise<any>;
   update: ({id, data} : {id: string, data: DestinationData}) => Promise<any>;
   delete: ({id} : {id: string}) => Promise<any>;
}

const useDestinationStore = create<DestinationState>()(
   persist(
      (set, get) => ({
         destinations: null,
         all: async ({page, limit, search, sort, order}) => {
            try {
               const params = { page, limit, search, sort, order };
               const response = await protectedApi.get("/destinations", { params });
               set({ destinations: response.data });
               return response.data;
            } catch (error) {
               return {success:false, message:error};
            }
         },
         add: async (data) => {
            try {
               let payload: DestinationData | FormData = data;
               let config = {};

               // Jika ada field image yang instanceof File, gunakan FormData
               if (data.image instanceof File) {
                  const formData = new FormData();

                  // Mapping field satu per satu — aman dari TypeScript
                  if (data.title) formData.append("title", data.title);
                  if (data.description) formData.append("description", data.description);
                  formData.append("image", data.image); // image selalu ada di sini (karena dicek instanceof File)

                  payload = formData;
                  config = {
                     headers: {
                        "Content-Type": "multipart/form-data",
                     },
                  };
               }

               const response = await protectedApi.post(`/destinations`, payload, config);
               return response.data;
            } catch (error) {
               return {
                  success: false,
                  message: error || "Unknown error",
               };
            }
         },
         detail: async ({id}) => {
            try {
               const response = await protectedApi.get(`/destinations/${id}`);
               return response.data;
            } catch (error) {
               return {success:false, message:error};
            }
         },
         update: async ({id, data}) => {
            try {
               let payload: DestinationData | FormData = data;
               let config = {};

               // Jika ada field image yang instanceof File, gunakan FormData
               if (data.image instanceof File) {
                  const formData = new FormData();

                  if (data.title) formData.append("title", data.title);
                  if (data.description) formData.append("description", data.description);
                  formData.append("image", data.image); // image selalu ada di sini (karena dicek instanceof File)

                  payload = formData;
                  config = {
                     headers: {
                        "Content-Type": "multipart/form-data",
                     },
                  };
               }

               const response = await protectedApi.post(`/destinations/${id}`, payload, config);
               return response.data;
            } catch (error) {
               return {
                  success: false,
                  message: error || "Unknown error",
               };
            }
         },
         delete: async ({id}) => {
            const response = await protectedApi.delete(`/destinations/${id}`);
            return response.data;
         },
       }),
      {
         name: "user-store", // key di localStorage
         partialize: (state) => ({
            destinations: state.destinations,
         }), // hanya simpan ini
      }
   )
);

export default useDestinationStore;
