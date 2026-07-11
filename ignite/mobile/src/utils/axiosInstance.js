import axios from 'axios';
import storage from './storage';

export const TOKEN_KEY = 'ignite_auth_token';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// AuthContext registers a handler so a failed refresh logs the user out
// without this module importing the context (avoids a require cycle).
let onAuthFailure = null;
export const setOnAuthFailure = (handler) => {
  onAuthFailure = handler;
};

axiosInstance.interceptors.request.use(async (config) => {
  const token = await storage.get(TOKEN_KEY);
  if (token?.access) {
    config.headers.Authorization = `Bearer ${token.access}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthError = error.response?.status === 401;

    if (isAuthError && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const token = await storage.get(TOKEN_KEY);

      if (token?.refresh) {
        try {
          // Plain axios: the instance's interceptors must not run on the refresh call.
          const { data } = await axios.post(`${API_URL}/token/refresh/`, {
            refresh: token.refresh,
          });
          const newToken = { ...token, access: data.access };
          await storage.set(TOKEN_KEY, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken.access}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          await storage.remove(TOKEN_KEY);
          onAuthFailure?.();
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
