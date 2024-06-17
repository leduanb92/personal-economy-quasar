import { useOperationsStore } from "stores/operations-store";

const routes = [
  {
    path: "/",
    component: () => import("layouts/PublicLayout.vue"),
    children: [
      {
        path: "",
        name: "index",
        component: () => import("pages/LandingPage.vue"),
      },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      authRequired: true,
    },
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: () => import("pages/DashboardPage.vue"),
      },
      {
        path: "accounts",
        name: "account-list",
        component: () => import("pages/AccountsPage.vue"),
      },
      {
        path: "operations/:accountId?",
        name: "operation-list",
        component: () => import("pages/OperationsPage.vue"),
        beforeEnter: (to, from, next) => {
          const operationsStore = useOperationsStore();
          if (to.params.accountId) {
            const filters = {
              accountId: parseInt(to.params.accountId),
              date: null,
            };
            operationsStore.setFilters(filters);
            next({ name: "operation-list" });
          } else {
            next();
          }
        },
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
