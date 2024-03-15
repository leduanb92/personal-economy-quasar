import { Notify } from "quasar";

Notify.setDefaults({
  position: "bottom",
  timeout: 3500,
  textColor: "white",
  progress: true,
  actions: [{ icon: "r_close", color: "white" }],
});
