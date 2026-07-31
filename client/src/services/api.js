import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Attach JWT automatically once auth exists (Day 4) — scaffolded now
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("devorbit_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;