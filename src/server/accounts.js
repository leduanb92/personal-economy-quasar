import { api } from "boot/axios";

let baseUrl = "pe/cuentas/";

export default {
  getAccounts() {
    return api.get(baseUrl);
  },
  getAccount(id) {
    return api.get(baseUrl + id + "/");
  },
  addAccount(data) {
    return api.post(baseUrl, {
      nombre: data.name,
    });
  },
  updateAccount(id, data) {
    return api.put(baseUrl + id + "/", {
      nombre: data.name,
    });
  },
  deleteAccount(id) {
    return api.delete(baseUrl + id + "/");
  },
};
