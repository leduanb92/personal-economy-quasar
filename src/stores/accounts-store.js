import { defineStore } from "pinia";

export const useAccountsStore = defineStore("accounts", {
  state: () => ({
    accounts: [],
  }),
  getters: {
    getAccounts: (state) =>
      state.accounts.sort((a, b) => a.name.localeCompare(b.name)),
  },
  actions: {
    addAccount(account) {
      this.accounts.push(account);
    },
    editAccount(account) {
      const index = this.accounts.findIndex((a) => a.id === account.id);
      if (index !== -1) {
        this.accounts[index] = account;
      }
    },
    deleteAccount(account) {
      const index = this.accounts.findIndex((a) => a.id === account.id);
      if (index !== -1) {
        this.accounts.splice(index, 1);
      }
    },
  },
});
