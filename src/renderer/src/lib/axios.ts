import { useAuth } from "@/store/auth/useAuthStore";
import axios from "axios";
import {toast} from "sonner";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
});


// Track pending refresh promise (avoids simultaneous refresh calls)
// let refreshPromise: Promise<string | null> | null = null;

api.interceptors.request.use(async (config) => {
    const token = useAuth.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// --------------------------------
// RESPONSE INTERCEPTOR
// Auto-refresh expired access token
// --------------------------------
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;
        if (error.response?.status === 401 && !original._retry) {
          // original._retry = true;
          toast.error(error?.response?.data?.message ?? "Session Expired, Logging out the user.")
          useAuth.getState().clearState()
        }
        //     if (!refreshPromise) {
        //         refreshPromise = useAuth.getState().refreshAccessToken();
        //     }
        //
        //     const newToken = await refreshPromise;
        //     refreshPromise = null;
        //
        //     if (newToken) {
        //         original.headers.Authorization = `Bearer ${newToken}`;
        //         return api(original); // retry
        //     }
        // }
        return Promise.reject(error);
    }
);

// Video calling api:

export const vcApi = axios.create({
  baseURL: import.meta.env.VITE_VC_BASE_URL
})

vcApi.interceptors.request.use(
  (config) => {
    const token = import.meta.env.VITE_VC_TOKEN;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


export default api;
