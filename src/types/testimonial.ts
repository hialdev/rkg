export type TestimonialItem = {
   id: string;
   name: string;
   role: string;
   image?: string;
   quote: string;
   galleries?: string | File[];
   created_at: string;
   updated_at: string;
};

export type TestimonialSchema = {
   name: string;
   role: string;
   image?: File | string;
   quote: string;
   galleries?: (File | string)[];
};

export type ITestimonialTableFilters = {
   name: string;
};
