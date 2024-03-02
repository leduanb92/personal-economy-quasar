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
    isAuthenticated() {
      return this.authData && !!this.authData.accessToken;
    },
  },
  actions: {
    saveLoginData(data) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      this.authData = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      };
    },
    async logout() {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      this.authData = {};
    },
    refreshToken(data) {
      this.authData.accessToken = data.access;
      this.authData.refreshToken = data.refresh;

      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
    },
  },
});
