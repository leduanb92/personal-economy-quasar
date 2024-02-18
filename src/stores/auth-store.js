import { defineStore } from "pinia";
import authServer from "../server/auth";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authData: {
      access_token: "",
      refresh_token: "",
      user: "",
    },
  }),
  getters: {
    getIsAuthenticated() {
      return this.authData && !!this.authData.access_token;
    },
    getAuthData() {
      return this.authData;
    },
  },
  actions: {
    saveLoginData(data) {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      this.authData = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        user: data.user,
      };
    },
    async login(payload) {
      const response = await authServer.login(payload).catch((err) => {
        this.errors = err.response.data;
      });
      if (response && response.data) {
        this.saveLoginData(response.data);
      } else {
        this.isAuthenticated = false;
      }
    },
    async register(payload) {
      const response = await authServer.register(payload).catch((err) => {
        this.errors = err.response.data;
      });
      if (response && response.data) {
        this.saveLoginData(response.data);
      } else {
        this.isAuthenticated = false;
      }
    },
    async logout() {
      authServer.logout(this.authData.refresh_token).catch((err) => {
        this.errors = err.response.data;
      });

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      this.authData = {};
      this.isAuthenticated = false;
    },
    refreshToken(data) {
      this.isAuthenticated = true;
      this.authData.access_token = data.access;
      this.authData.refresh_token = data.refresh;

      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
    },
  },
});
