import axios, { AxiosInstance } from "axios";

const baseURL = import.meta.env.PROD
  ? "https://job-alert-render-3.onrender.com/api"
  : "/api";

const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// Attach token automatically
api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("authToken");
  if (token && config && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Refresh flow: if 401, attempt refresh once and retry queued requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err: any) => {
    const originalRequest = err.config;
    const isAuthRequest = originalRequest.url?.includes("/auth/login") || 
                         originalRequest.url?.includes("/auth/register") || 
                         originalRequest.url?.includes("/auth/refresh");

    if (err.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token && originalRequest.headers)
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((e) => Promise.reject(e));
      }

      isRefreshing = true;

      return new Promise(async (resolve, reject) => {
        try {
          const refreshRes = await api.post("/auth/refresh");
          const newToken = refreshRes.data?.token;
          if (newToken) {
            localStorage.setItem("authToken", newToken);
            api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          }
          processQueue(null, newToken ?? null);
          if (originalRequest.headers && newToken)
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        } catch (e) {
          processQueue(e, null);
          localStorage.removeItem("authToken");
          window.location.href = "/";
          reject(e);
        } finally {
          isRefreshing = false;
        }
      });
    }

    return Promise.reject(err);
  }
);

// Helper API functions
export const fetchJobsAPI = async <T = any[]>(): Promise<T> => {
  const res = await api.get("/jobs");
  return res.data as T;
};

export default api;