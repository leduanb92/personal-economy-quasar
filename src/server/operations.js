import { api } from "boot/axios";

let baseUrl = "pe/operations/";

export default {
  getOperations(data) {
    let url = baseUrl;
    if (data?.accountId) url += "?account_id=" + data.accountId;
    return api.get(url);
  },
  getOperation(id) {
    return api.get(baseUrl + id + "/");
  },
  addOperation(data) {
    return api.post(baseUrl, data);
  },
  updateOperation(id, data) {
    return api.put(baseUrl + id + "/", data);
  },
  deleteOperation(id) {
    return api.delete(baseUrl + id + "/");
  },
  deleteOperations(ids) {
    return api.post(baseUrl + "destroy-bulk/", { ids: ids });
  },
  getOperationsByDate(date) {
    return api.get(baseUrl + "by-date/?date=" + date);
  },
};
