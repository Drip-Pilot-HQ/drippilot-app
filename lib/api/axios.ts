import axios from "axios";
import { createClient } from "../supabase/client";
import { useAuthStore } from "../../store/client/useAuthStore";
import { useAccountStore } from "../../store/client/useAccountStore";
import { handleApiError } from "./error-handler";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: {
    indexes: null, // Important: This prevents adding brackets like status[] and sends status=value instead
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor to add auth and workspace context to headers
apiClient.interceptors.request.use(
  async (config) => {
    // Auth Token
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    // Workspace Context
    const activeWorkspace = useAccountStore.getState().activeWorkspace;
    if (activeWorkspace?.id) {
      config.headers["x-workspace-id"] = activeWorkspace.id;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor to handle 401s and refresh tokens
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const supabase = createClient();

      try {
        const { data, error: refreshError } =
          await supabase.auth.refreshSession();

        if (refreshError || !data.session) {
          // Refresh completely failed, log out user
          useAuthStore.getState().clearAuth();
          await supabase.auth.signOut();
          window.location.href = "/auth/login";
          return Promise.reject(refreshError);
        }

        const newAccessToken = data.session.access_token;
        useAuthStore.getState().setSession(data.session);
        useAuthStore.getState().setUser(data.user);
        apiClient.defaults.headers.common["Authorization"] =
          "Bearer " + newAccessToken;

        processQueue(null, newAccessToken);

        // Retry original request
        originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        useAuthStore.getState().clearAuth();
        window.location.href = "/auth/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Don't show global toast for 401s as they are handled by refresh logic or redirect
    if (error.response?.status !== 401) {
      handleApiError(error);
    }

    return Promise.reject(error);
  },
);
