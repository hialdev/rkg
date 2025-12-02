import { http } from "./http";

// Base model interface for all models
export interface BaseModel {
   id: string; // uuid.UUID
   created_at: string; // time.Time
   updated_at: string; // time.Time
}

// Types for API responses
export interface Location {
   location: string;
   country_: string;
}

export interface Trip extends BaseModel {
   title?: string;
   slug?: string;
   description?: string;
   location?: string;
   country?: string;
   type?: "open-trip" | "private-trip" | string;
   duration?: string;
   price?: number;
   image?: string;
   images?: string;
   min_people?: number;
   meet_point?: string;
   content?: string;
   open_dates?: any; // json.RawMessage
   destinations?: any; // json.RawMessage
   itinerary?: any; // json.RawMessage
}

export interface Event extends BaseModel {
   title?: string;
   slug?: string;
   image?: string;
   description?: string;
   content?: string;
   client?: string;
}

export interface Testimonial extends BaseModel {
   name?: string;
   role?: string;
   image?: string;
   quote?: string;
   star?: number;
   galleries?: string;
}

export interface EventType extends BaseModel {
   title?: string;
   slug?: string;
   description?: string;
   image?: string;
   content?: string;
   galleries?: string;
}

export interface Team extends BaseModel {
   name?: string;
   role?: string;
   summary?: string;
   image?: string;
}

export interface Client extends BaseModel {
   image?: string;
   title?: string;
}

export interface Gallery {
   image: string;
   title: string;
}

export interface GalleryResponse {
   featured: Gallery[];
   sliders: Gallery[];
   all: Gallery[];
}

export interface EventPlan extends BaseModel {
   title?: string;
   step_order?: number;
   subtitle?: string;
   content?: string;
   image?: string;
}

export interface Faq extends BaseModel {
   title?: string;
   content?: string;
}

export interface Setting extends BaseModel {
   name: string;
   description?: string;
   set_key: string;
   set_value?: string;
   set_type: string;
   set_options?: string;
   is_urgent: boolean;
   group_id: string; // uuid.UUID
}

// API fetcher functions
export const getLocations = () => {
   return http.get<{ status: string; message: string; data: Location[] }>(
      "/api/web/locations"
   );
};

export const getTrips = (params?: { type?: string; location?: string }) => {
   return http.get<{ status: string; message: string; data: Trip[] }>(
      "/api/web/trips",
      { params }
   );
};

export const getTripBySlug = (slug: string) => {
   return http.get<{ status: string; message: string; data: Trip[] }>(
      `/api/web/trips/${slug}`
   );
};

export const getEvents = () => {
   return http.get<{ status: string; message: string; data: Event[] }>(
      "/api/web/events"
   );
};

export const getEventBySlug = (slug: string) => {
   return http.get<{ status: string; message: string; data: Event[] }>(
      `/api/web/events/${slug}`
   );
};

export const getTestimonials = () => {
   return http.get<{ status: string; message: string; data: Testimonial[] }>(
      "/api/web/testimonials"
   );
};

export const getEventTypes = () => {
   return http.get<{ status: string; message: string; data: EventType[] }>(
      "/api/web/event-types"
   );
};

export const getEventTypeBySlug = (slug: string) => {
   return http.get<{ status: string; message: string; data: EventType[] }>(
      `/api/web/event-types/${slug}`
   );
};

export const getTeams = () => {
   return http.get<{ status: string; message: string; data: Team[] }>(
      "/api/web/teams"
   );
};

export const getClients = () => {
   return http.get<{ status: string; message: string; data: Client[] }>(
      "/api/web/clients"
   );
};

export const getGalleries = () => {
   return http.get<{ status: string; message: string; data: GalleryResponse }>(
      "/api/web/galleries"
   );
};

export const getEventPlans = () => {
   return http.get<{ status: string; message: string; data: EventPlan[] }>(
      "/api/web/event-plans"
   );
};

export const getFaqs = () => {
   return http.get<{ status: string; message: string; data: Faq[] }>(
      "/api/web/faqs"
   );
};

export const getSetting = (key: string) => {
   return http.get<{ status: string; message: string; data: Setting }>(
      `/api/web/setting/${key}`
   );
};
