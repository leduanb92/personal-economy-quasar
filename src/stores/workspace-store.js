import { defineStore } from "pinia";
import { Loading, Dialog, Notify } from "quasar";

export const useWorkspaceStore = defineStore("workspace", {
  state: () => ({}),

  getters: {},

  actions: {
    showLoading(options = {}) {
      Loading.show(options);
    },
    hideLoading() {
      Loading.hide();
    },
    showConfirmDialog({
      onOk = () => {},
      onCancel = () => {},
      onDismiss = () => {},
      ...options
    } = {}) {
      Dialog.create({
        title: "Confirm",
        persistent: true,
        cancel: true,
        ...options,
      })
        .onOk(onOk)
        .onCancel(onCancel)
        .onDismiss(onDismiss);
    },
    showNotification(options = {}) {
      Notify.create(options);
    },
  },
});
