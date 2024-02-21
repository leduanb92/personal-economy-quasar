import { defineStore } from "pinia";

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
    async logout() {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      this.authData = {};
    },
    refreshToken(data) {
      this.authData.access_token = data.access;
      this.authData.refresh_token = data.refresh;

      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
    },
  },
});
