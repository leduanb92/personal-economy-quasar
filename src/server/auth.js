import { api } from "boot/axios";

let baseUrl = "users/";
export default {
  login(credentials) {
    return api.post(baseUrl + "login/", {
      email: credentials.email,
      password: credentials.password,
    });
  },
  register(credentials) {
    return api.post(baseUrl + "register/", {
      username: credentials.username,
      email: credentials.email,
      password1: credentials.password1,
      password2: credentials.password2,
    });
  },
  logout(refresh_token) {
    return api.post(baseUrl + "logout/", {
      refresh: refresh_token,
    });
  },
};
