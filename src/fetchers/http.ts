import axios from "axios";

const baseURL = import.meta.env.PUBLIC_API_URL || "https://sandboxapi.rkgtour.com";

export const http = axios.create({
   baseURL,
   timeout: 15_000,
   headers: { "Content-Type": "application/json" },
});
