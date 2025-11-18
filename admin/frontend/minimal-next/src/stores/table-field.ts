import { create } from "zustand";
import { persist } from "zustand/middleware";

import { protectedApi } from "../lib/al/axios";

export const inputTypes = [
   "text",
   "number",
   "checkbox",
   "radio",
   "select",
   "selects",
   "file",
   "image",
   "files",
   "images",
   "richtext",
   "markdown",
];
interface Language {
   langs: string[]
   default: string
}

interface Option {
   key: string,
   value: string,
}
export interface TableFieldData {
   id: string;
   name: string;
   label: string;
   type:
      | "text"
      | "number"
      | "checkbox"
      | "radio"
      | "select"
      | "selects"
      | "file"
      | "image"
      | "files"
      | "images"
      | "richtext"
      | "markdown"
      | "relation";
   is_required: boolean;
   is_unique: boolean;
   relation_type: string;
   relation_table: string;
   languages: Language;
   options?: Option[];
   created_at?: string;
   updated_at?: string;
}

interface TableFieldState {
   getByTable: (tableId: string) => Promise<any>;
   add: ({ data }: { data: TableFieldData }) => Promise<any>;
   update: ({ id, data }: { id: string; data: TableFieldData }) => Promise<any>;
   delete: ({ id }: { id: string }) => Promise<any>;
}

const useFieldStore = create<TableFieldState>()(
   persist(
      (set, get) => ({
         tabs: [],
         getByTable: async () => {
            try {
               const response = await protectedApi.get("/setting-groups");
               
               return response.data;
            } catch (error) {
               return { success: false, message: error };
            }
         },
         add: async ({ data }) => {
            try {
               const body = data;
               const response = await protectedApi.post(`/settings/`, body);
               return response.data;
            } catch (error) {
               return { success: false, message: error };
            }
         },
         update: async ({ id, data }) => {
            try {
               const body = data;
               const response = await protectedApi.post(
                  `/settings/${id}`,
                  body
               );
               return response.data;
            } catch (error) {
               return { success: false, message: error };
            }
         },
         delete: async ({ id }) => {
            try {
               const response = await protectedApi.delete(`/settings/${id}`);
               return response.data;
            } catch (error) {
               return { success: false, message: error };
            }
         },
      }),
      {
         name: "field-store", // key di localStorage
         partialize: (state) => ({
         }), // hanya simpan ini
      }
   )
);

export default useFieldStore;
