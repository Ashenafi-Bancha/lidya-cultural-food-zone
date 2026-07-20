import axios from 'axios';

// Get base URL from env, or default to /api if not set (relies on Vite proxy in dev)
const baseURL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

export const api = axios.create({
  baseURL,
  withCredentials: true, // For cookies (refresh token)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle 401s and token refresh (simplified for now)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If we had a robust refresh token endpoint we would hit it here on 401
    // For now, if we get a 401 and we are not on the login page, clear token and redirect
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('accessToken');
      // window.location.href = '/admin/login'; // Redirect to login if unauthorized
    }
    return Promise.reject(error);
  }
);
