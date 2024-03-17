<template>
  <q-dialog v-model="model" persistent>
    <q-card style="min-width: 250px; width: 400px" @keyup.enter="onSave">
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          dense
          v-model="form.name"
          :error="!!errors.name.length"
          :error-message="errors.name.join('. ')"
          autocapitalize="words"
          bottom-slots
          autofocus
        />
        <q-input dense v-model="form.initialBalance" type="number" />
      </q-card-section>

      <q-card-actions align="right" class="row no-wrap text-primary">
        <span
          v-if="errors.generalErrors.length"
          class="text-negative text-caption ellipsis-3-lines q-mr-md"
        >
          {{ errors.generalErrors.join(". ") }}
        </span>
        <q-space />
        <q-btn
          v-close-popup
          flat
          no-wrap
          style="flex-shrink: 0"
          icon="r_close"
          label="Cancel"
          @click="onCancel"
        />
        <q-btn
          flat
          no-wrap
          style="flex-shrink: 0"
          :icon="account ? 'r_save' : 'r_add'"
          :label="account ? 'Save' : 'Add'"
          :loading="loading"
          @click="onSave"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, inject, reactive, ref, watchEffect } from "vue";
import accountsServer from "src/server/accounts";

const emit = defineEmits(["update:modelValue", "saved", "cancelled"]);
const bus = inject("bus");
const props = defineProps({
  modelValue: Boolean,
  account: { type: Object, default: null },
});

const loading = ref(false);
const form = reactive({
  id: "",
  name: "",
  initialBalance: 0,
});
const errors = reactive({
  name: [],
  generalErrors: [],
});

//Computed
const title = computed(() => {
  if (props.account) {
    return `Edit Account (${props.account.name})`;
  }
  return "Add Account";
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
  errors.generalErrors = [];
  errors.name = [];
};

const onCancel = function () {
  resetForm();
  cleanErrors();
  emit("cancelled");
};

const manageErrors = function (error) {
  if (error.response && error.response.status === 401) {
    bus.emit("logout");
  } else {
    if (!error.response)
      errors.generalErrors = [
        "There was a network error. Please, check your connection",
      ];
    else {
      const errorData = error.response.data;
      if ("name" in errorData) errors.name = errorData["name"];
      if ("generalErrors" in errorData)
        errors.generalErrors = errorData["generalErrors"];
    }
  }
};
const onSave = function () {
  if (validate()) {
    loading.value = true;
    const name =
      form.name.trim().charAt(0).toUpperCase() + form.name.trim().slice(1);
    if (!props.account) {
      accountsServer
        .addAccount({ ...form, name: name })
        .then(() => {
          resetForm();
          emit("saved");
          model.value = false;
        })
        .catch(manageErrors)
        .finally(() => (loading.value = false));
    } else {
      accountsServer
        .updateAccount(form.id, { ...form })
        .then(() => {
          resetForm();
          emit("saved");
          model.value = false;
        })
        .catch(manageErrors)
        .finally(() => (loading.value = false));
    }
  }
};
const validate = function () {
  cleanErrors();
  if (!form.name) {
    errors.name = ["You must specify an account name."];
    return false;
  }
  return true;
};
</script>

<style scoped></style>
