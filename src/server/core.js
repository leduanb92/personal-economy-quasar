import axios from "axios";
import { useAuthStore } from "stores/auth-store";

const store = useAuthStore();

export const setupInterceptors = (api) => {
  api.interceptors.request.use(
    (config) => {
      const authData = store.authData;
      if (
        authData.accessToken &&
        !config.url.includes("login") &&
        !config.url.includes("logout")
      ) {
        config.headers.setAuthorization(`Bearer ${authData.accessToken}`);
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  api.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;
      if (
        !originalConfig.url.includes("login") &&
        !originalConfig.url.includes("logout") &&
        err.response
      ) {
        // Access Token was expired
        if (err.response.status === 401) {
          const authData = store.authData;
          try {
            const response = await refreshClient.post("refresh-token/", {
              refresh: authData.refreshToken,
            });
            const data = response.data;
            await store.refreshToken(data);
            originalConfig.headers["Authorization"] = `Bearer ${data.access}`;

            return api(originalConfig);
          } catch (_error) {
            return Promise.reject(_error);
          }
        } else {
          return Promise.reject(err);
        }
      } else {
        return Promise.reject(err);
      }
    }
  );

  const refreshClient = axios.create({
    baseURL: api.defaults.baseURL + "users/",
    withCredentials: false,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  refreshClient.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      // Refresh Token was expired
      return Promise.reject(err);
    }
  );
};
