import axios from 'axios';

// Base URL comes from VITE_API_URL (must already include the `/api` suffix,
// e.g. https://lidya-backend.onrender.com/api). When unset, fall back to the
// relative `/api` path which the Vite dev proxy forwards to the local backend.
const baseURL = import.meta.env.VITE_API_URL || '/api';

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

// Share a single in-flight refresh across concurrent 401s so we only hit the
// refresh endpoint once and every queued request retries with the new token.
let refreshPromise: Promise<string> | null = null;

const requestNewAccessToken = async (): Promise<string> => {
  // Use a bare axios call (not `api`) so this request skips the interceptors
  // and can't recurse. The refresh token travels in the httpOnly cookie.
  const { data } = await axios.post(
    `${baseURL}/auth/refresh`,
    {},
    { withCredentials: true }
  );
  const newToken = data?.data?.accessToken as string;
  localStorage.setItem('accessToken', newToken);
  if (data?.data?.user) {
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }
  return newToken;
};

const clearSessionAndRedirect = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/admin/login';
  }
};

// Interceptor to handle 401s: try to refresh the access token once, then retry
// the original request. If refresh fails, clear the session and redirect.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const url = String(original?.url ?? '');
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/refresh');

    if (error.response?.status === 401 && original && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = requestNewAccessToken().finally(() => {
            refreshPromise = null;
          });
        }
        const newToken = await refreshPromise;
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (refreshError) {
        clearSessionAndRedirect();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
