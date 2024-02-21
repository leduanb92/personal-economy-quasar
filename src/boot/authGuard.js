import { boot } from "quasar/wrappers";
import { useAuthStore } from "stores/auth-store";

export default boot(({ router }) => {
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const authRequired = to.matched.some((record) => record.meta.authRequired);

    if (!authStore.getIsAuthenticated) {
      const access_token = localStorage.getItem("access_token");
      const refresh_token = localStorage.getItem("refresh_token");
      const userJSON = localStorage.getItem("user");
      const user = JSON.parse(userJSON);
      if (access_token && refresh_token) {
        const data = {
          access_token: access_token,
          refresh_token: refresh_token,
          user: user,
        };
        authStore.saveLoginData(data);
      }
    }

    const isAuthenticated = authStore.getIsAuthenticated;
    if (!authRequired && isAuthenticated) {
      next({ name: "dashboard" });
    } else if (authRequired && !isAuthenticated) {
      next({ name: "index", query: { next: to.fullPath } });
    } else {
      next();
    }
  });
});
