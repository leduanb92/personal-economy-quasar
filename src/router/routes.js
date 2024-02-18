const routes = [
  {
    path: "/home",
    component: () => import("layouts/PublicLayout.vue"),
    children: [
      { path: "", name: "home", component: () => import("pages/HomePage.vue") },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "dashboard",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "accounts/",
        name: "account-list",
        component: () => import("pages/AccountsPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
