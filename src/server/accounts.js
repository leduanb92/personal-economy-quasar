import { api } from "boot/axios";

let baseUrl = "pe/accounts/";

export default {
  getAccounts() {
    return api.get(baseUrl);
  },
  getAccount(id) {
    return api.get(baseUrl + id + "/");
  },
  addAccount(data) {
    return api.post(baseUrl, data);
  },
  updateAccount(id, data) {
    return api.put(baseUrl + id + "/", data);
  },
  deleteAccount(id) {
    return api.delete(baseUrl + id + "/");
  },
  getTotalBalance() {
    return api.get(baseUrl + "get-total-balance/");
  },
};
