import { create } from 'zustand';
import { TestimonialItem, TestimonialSchema } from 'src/types/testimonial';
import { testimonialService } from 'src/lib/al/testimonial';

export type TestimonialData = TestimonialItem;

export type TestimonialStore = {
 testimonials: TestimonialData[];
  loading: boolean;
  error: string | null;
  
  // Get all testimonials with pagination
  all: (params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    search?: string;
  }) => Promise<{ success: boolean; data?: any; message?: string }>;
  
  // Get single testimonial
 get: (id: string) => Promise<{ success: boolean; data?: TestimonialData; message?: string }>;
  
  // Add new testimonial
  add: (data: { data: TestimonialSchema }) => Promise<{ success: boolean; data?: TestimonialData; message?: string }>;
  
  // Update existing testimonial
 update: (params: { id: string; data: Partial<TestimonialSchema> }) => Promise<{ success: boolean; data?: TestimonialData; message?: string }>;
  
  // Delete testimonial
  delete: (params: { id: string }) => Promise<{ success: boolean; message?: string }>;
};

export const useTestimonialStore = create<TestimonialStore>((set) => ({
  testimonials: [],
  loading: false,
  error: null,
  
  all: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await testimonialService.getAll(params);
      if (response.success) {
        set({ testimonials: response.data?.testimonials || [], loading: false });
        return response;
      } else {
        set({ error: response.message || 'Failed to fetch testimonials', loading: false });
        return response;
      }
    } catch (error: any) {
      set({ error: error.message || 'An error occurred', loading: false });
      return { success: false, message: error.message || 'An error occurred' };
    }
  },
  
  get: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await testimonialService.get(id);
      if (response.success) {
        set({ loading: false });
        return response;
      } else {
        set({ error: response.message || 'Failed to fetch testimonial', loading: false });
        return response;
      }
    } catch (error: any) {
      set({ error: error.message || 'An error occurred', loading: false });
      return { success: false, message: error.message || 'An error occurred' };
    }
  },
  
  add: async ({ data }) => {
    set({ loading: true, error: null });
    try {
      const response = await testimonialService.create(data);
      if (response.success) {
        set((state) => ({ testimonials: [...state.testimonials, response.data as TestimonialData], loading: false }));
        return response;
      } else {
        set({ error: response.message || 'Failed to add testimonial', loading: false });
        return response;
      }
    } catch (error: any) {
      set({ error: error.message || 'An error occurred', loading: false });
      return { success: false, message: error.message || 'An error occurred' };
    }
  },
  
  update: async ({ id, data }) => {
    set({ loading: true, error: null });
    try {
      const response = await testimonialService.update(id, data);
      if (response.success) {
        set((state) => ({
          testimonials: state.testimonials.map((testimonial) =>
            testimonial.id === id ? { ...testimonial, ...response.data } as TestimonialData : testimonial
          ),
          loading: false,
        }));
        return response;
      } else {
        set({ error: response.message || 'Failed to update testimonial', loading: false });
        return response;
      }
    } catch (error: any) {
      set({ error: error.message || 'An error occurred', loading: false });
      return { success: false, message: error.message || 'An error occurred' };
    }
  },
  
  delete: async ({ id }) => {
    set({ loading: true, error: null });
    try {
      const response = await testimonialService.delete(id);
      if (response.success) {
        set((state) => ({
          testimonials: state.testimonials.filter((testimonial) => testimonial.id !== id),
          loading: false,
        }));
        return response;
      } else {
        set({ error: response.message || 'Failed to delete testimonial', loading: false });
        return response;
      }
    } catch (error: any) {
      set({ error: error.message || 'An error occurred', loading: false });
      return { success: false, message: error.message || 'An error occurred' };
    }
  },
}));
