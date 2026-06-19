import axios from 'axios';
import { API_URL } from '../data/variables';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem('ag_auth_token'));
  if (token?.access) {
    config.headers.Authorization = `Bearer ${token.access}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const token = JSON.parse(localStorage.getItem('ag_auth_token'));
        const res = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: token.refresh,
        });
        const newToken = { ...token, access: res.data.access };
        localStorage.setItem('ag_auth_token', JSON.stringify(newToken));
        original.headers.Authorization = `Bearer ${res.data.access}`;
        return axiosInstance(original);
      } catch (err) {
        localStorage.removeItem('ag_auth_token');
        localStorage.removeItem('ag_auth_remember');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;