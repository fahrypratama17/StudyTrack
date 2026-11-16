import axios from "axios";

/** Kunci localStorage tempat token login disimpan. */
export const TOKEN_KEY = "studytrack_token";
export const AUTH_EXPIRED_EVENT = "studytrack:auth-expired";

/**
 * Instance axios untuk seluruh pemanggilan API backend.
 * Pada mode development, request `/api/*` di-proxy ke backend oleh Vite
 * (lihat `vite.config.js`).
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 15_000,
});

// Menyisipkan token login ke setiap request jika tersedia.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      error.config?.headers.Authorization &&
      !["/auth/login", "/auth/register"].includes(error.config.url ?? "")
    ) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    return Promise.reject(error);
  },
);

export default api;
