import { defineStore } from "pinia";

export const useOperationsStore = defineStore("operations", {
  state: () => ({
    operations: [],
    filters: {
      date: null,
      accountId: null,
    },
  }),

  getters: {},

  actions: {
    setFilters(filters) {
      this.filters = filters;
    },
  },
});
