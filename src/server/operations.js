import { api } from "boot/axios";

let baseUrl = "pe/operations/";

export default {
  getOperations() {
    return api.get(baseUrl);
  },
  getOperation(id) {
    return api.get(baseUrl + id + "/");
  },
  addOperation(data) {
    return api.post(baseUrl, {
      nombre: data.name,
    });
  },
  updateOperation(id, data) {
    return api.put(baseUrl + id + "/", data);
  },
  deleteOperation(id) {
    return api.delete(baseUrl + id + "/");
  },
  getOperationsByDate(date) {
    return api.get(baseUrl + "by-date/?date=" + date);
  },
};
