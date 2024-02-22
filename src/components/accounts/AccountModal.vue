<template>
  <q-dialog v-model="model" persistent>
    <q-card style="min-width: 350px" @keyup.enter="onSave">
      <q-card-section>
        <div class="text-h6">Add account</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input dense v-model="form.name" autofocus />
        <q-input dense v-model="form.initialBalance" type="number" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn
          v-close-popup
          flat
          icon="r_close"
          label="Cancel"
          @click="onCancel"
        />
        <q-btn
          flat
          :icon="account ? 'r_save' : 'r_add'"
          :label="account ? 'Save' : 'Add'"
          @click="onSave"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, reactive, watchEffect } from "vue";
import accountsServer from "src/server/accounts";

const emit = defineEmits(["update:modelValue", "saved", "cancelled"]);
const props = defineProps({
  modelValue: Boolean,
  account: { type: Object, default: null },
});

const form = reactive({
  id: "",
  name: "",
  initialBalance: 0,
});
const errors = reactive({
  name: [],
  general_errors: [],
});

const model = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

//Watchers
watchEffect(() => {
  if (props.account) {
    form.id = props.account.id;
    form.name = props.account.name;
    form.initialBalance = props.account.initialBalance;
  }
});

//Methods
const resetForm = function () {
  form.id = "";
  form.name = "";
  form.initialBalance = 0;
};
const cleanErrors = function () {
  errors.general_errors = [];
  errors.name = [];
};

const onCancel = function () {
  resetForm();
  emit("cancelled");
};

const onSave = function () {
  if (validate()) {
    if (!props.account) {
      accountsServer
        .addAccount({ ...form })
        .then(() => {
          // this.cuentas = response.data.results;
          resetForm();
          emit("saved");
          model.value = false;
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            // EventBus.dispatch("logout");
          } else {
            const errorData = error.response.data;
            if ("nombre" in errorData) errors.name = errorData["nombre"];
            if ("general_errors" in errorData)
              errors.general_errors = errorData["general_errors"];
          }
        });
    } else {
      accountsServer
        .updateAccount(form.id, { ...form })
        .then(() => {
          // this.cuentas = response.data.results;
          resetForm();
          emit("saved");
          model.value = false;
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            // EventBus.dispatch("logout");
          } else {
            const errorData = error.response.data;
            if ("nombre" in errorData) errors.name = errorData["nombre"];
            if ("general_errors" in errorData)
              errors.general_errors = errorData["general_errors"];
          }
        });
    }
  }
};
const validate = function () {
  cleanErrors();
  if (!form.name) {
    errors.name = ["Name is required"];
    return false;
  }
  return true;
};
</script>

<style scoped></style>
