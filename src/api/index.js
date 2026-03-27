import axios from "axios";
import { getStorageItem, removeStorageItem } from "../utils/localStorageHandler";
import { STORAGE_KEYS } from "../constants/storageKeys";

export const API_ENDPOINT = import.meta.env.VITE_APP_URL;

const clearAuthAndRedirectToLogin = () => {
  removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
  removeStorageItem(STORAGE_KEYS.REFRESH_TOKEN);
  removeStorageItem(STORAGE_KEYS.USER);
  removeStorageItem(STORAGE_KEYS.TENANT_ID);
  removeStorageItem(STORAGE_KEYS.LOCATION_ID);
  removeStorageItem(STORAGE_KEYS.STAFF_ID);
  window.location.href = "/";
};

const axiosServices = axios.create({
  baseURL: API_ENDPOINT,
});

axiosServices.interceptors.request.use(
  (config) => {
    const isPublic = config.url?.includes("/oauth/token");
    if (!isPublic) {
      const accessToken = getStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = String(error?.config?.url || "");
    const isPublicTokenCall =
      requestUrl.includes("/oauth/token") || requestUrl.includes("oauth/token");
    if (error.response?.status === 401 && !isPublicTokenCall) {
      clearAuthAndRedirectToLogin();
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosServices;
