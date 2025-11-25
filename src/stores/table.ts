import { create } from "zustand";
import { persist } from "zustand/middleware";

import { protectedApi } from "../lib/al/axios";

interface OptionConfig {
   key: string;
   value: string;
}

export interface TableField{
   id?: string;
   name: string;
   label: string;
   type: string;
   is_required: boolean;
   is_unique: boolean;
   relation_type?: string | "o2m" | "m2m" | "m2o";
   relation_table_id?: string;
   languages:{
      langs: string[];
      default: string;
   } 
   options?: string 
}

export interface TableData {
   id?: string;
   name: string;
   slug: string;
   description?: string;
   icon?: string;
   generate_widget: boolean;
   created_at?: string;
   updated_at?: string;

   fields: TableField[];
}

interface TableState {
   tables: TableData[] | null;
   
   all: ({page, limit, search, sort, order} : {page?: number | string, limit?: number | string, search?: string, sort: string, order: "desc" | "asc"}) => Promise<any>;
   detail: ({id} : {id: string}) => Promise<any>;
   add: ({ data }: { data: TableData }) => Promise<any>;
   update: ({ id, data }: { id: string; data: TableData }) => Promise<any>;
   delete: ({ id }: { id: string }) => Promise<any>;
}

const useTabletore = create<TableState>()(
   persist(
      (set, get) => ({
         tables: [],
         all: async ({page, limit, search, sort, order}) => {
            try {
               const params = { page, limit, search, sort, order };
               const response = await protectedApi.get("/tables", { params });
               set({ tables: response.data });
               return response.data;
            } catch (error) {
               return {success:false, message:error};
            }
         },
         detail: async ({id}) => {
            try {
               const response = await protectedApi.get("/tables/"+id);
               
               return response.data;
            } catch (error) {
               return { success: false, message: error };
            }
         },
         add: async ({ data }) => {
            try {
               const body = data;
               const response = await protectedApi.post(`/tables/`, body);
               return response.data;
            } catch (error) {
               return { success: false, message: error };
            }
         },
         update: async ({ id, data }) => {
            try {
               const body = data;
               const response = await protectedApi.post(
                  `/tables/${id}`,
                  body
               );
               return response.data;
            } catch (error) {
               return { success: false, message: error };
            }
         },
         delete: async ({ id }) => {
            try {
               const response = await protectedApi.delete(`/tables/${id}`);
               return response.data;
            } catch (error) {
               return { success: false, message: error };
            }
         },
      }),
      {
         name: "table-store", // key di localStorage
         partialize: (state) => ({
            // tables: state.tables,
         }), // hanya simpan ini
      }
   )
);

export default useTabletore;
