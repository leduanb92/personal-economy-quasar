import { defineStore } from "pinia";

export const useAccountsStore = defineStore("accounts", {
  state: () => ({
    accounts: [],
  }),
  getters: {
    getAccounts: (state) => state.accounts,
  },
  actions: {
    addAccount(account) {
      this.accounts.push(account);
    },
  },
});
