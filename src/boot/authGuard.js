import { boot } from "quasar/wrappers";
import { useAuthStore } from "stores/auth-store";

export default boot(({ router }) => {
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const authRequired = to.matched.some((record) => record.meta.authRequired);

    if (!authStore.isAuthenticated) {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const userJSON = localStorage.getItem("user");
      const user = JSON.parse(userJSON);
      if (accessToken && refreshToken) {
        const data = {
          accessToken: accessToken,
          refreshToken: refreshToken,
          user: user,
        };
        authStore.saveLoginData(data);
      }
    }

    const isAuthenticated = authStore.isAuthenticated;
    if (!authRequired && isAuthenticated) {
      next({ name: "dashboard" });
    } else if (authRequired && !isAuthenticated) {
      next({ name: "index", query: { next: to.fullPath } });
    } else {
      next();
    }
  });
});
