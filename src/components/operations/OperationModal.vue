<template>
  <q-dialog v-model="model" persistent>
    <q-card style="min-width: 250px; width: 400px" @keyup.enter="onSave">
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-select
          dense
          v-model="form.account"
          :options="accounts"
          :loading="loadingAccounts"
        />
        <q-select dense v-model="form.type" :options="types" />
        <q-input
          dense
          v-model="form.amount"
          :error="!!errors.amount.length"
          :error-message="errors.amount.join('. ')"
          bottom-slots
          type="number"
          min="0"
        />
        <q-input dense v-model="form.description" />
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
          :icon="operation ? 'r_save' : 'r_add'"
          :label="operation ? 'Save' : 'Add'"
          :loading="loading"
          @click="onSave"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, inject, reactive, ref, watchEffect, onMounted } from "vue";
import { useAccountsStore } from "stores/accounts-store";
import operationsServer from "src/server/operations";
import accountsServer from "src/server/accounts";

const emit = defineEmits(["update:modelValue", "saved", "cancelled"]);
const bus = inject("bus");
const props = defineProps({
  modelValue: Boolean,
  operation: { type: Object, default: null },
});
const accountsStore = useAccountsStore();

const loading = ref(false);
const loadingAccounts = ref(false);
const form = reactive({
  id: "",
  account: null,
  type: { value: "Exp", label: "Expense" },
  amount: 0,
  description: "",
});
const errors = reactive({
  account: [],
  amount: [],
  generalErrors: [],
});
const types = [
  { value: "Exp", label: "Expense" },
  { value: "In", label: "Income" },
];

//Computed
const title = computed(() => {
  if (props.operation) {
    return `Edit Operation`;
  }
  return "Add Operation";
});

const accounts = computed(() => {
  return accountsStore.accounts.map((account) => {
    return {
      label: account.name,
      value: account.id,
      data: account,
    };
  });
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
  if (props.operation) {
    form.id = props.operation.id;
    form.account = props.operation.account;
    form.type = types.find((type) => type.value === props.operation.type);
    form.amount = props.operation.amount;
    form.description = props.operation.description;
  }
});

//Methods
const resetForm = function () {
  form.id = "";
  form.account = null;
  form.type = { value: "Exp", label: "Expense" };
  form.amount = 0;
  form.description = "";
};
const cleanErrors = function () {
  errors.generalErrors = [];
  errors.account = [];
  errors.amount = [];
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
      if ("account" in errorData) errors.name = errorData["account"];
      if ("amount" in errorData) errors.name = errorData["amount"];
      if ("generalErrors" in errorData)
        errors.generalErrors = errorData["generalErrors"];
    }
  }
};
const onSave = function () {
  if (validate()) {
    loading.value = true;
    const account = form.account?.value;
    const type = form.type.value;
    const date = new Date().toISOString().slice(0, 10);
    if (!props.operation) {
      operationsServer
        .addOperation({ ...form, account, type, date })
        .then(() => {
          resetForm();
          emit("saved");
          model.value = false;
        })
        .catch(manageErrors)
        .finally(() => (loading.value = false));
    } else {
      operationsServer
        .updateOperation(form.id, {
          ...form,
          account,
          type,
          date,
        })
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
  let withoutErrors = true;
  if (!form.account) {
    errors.account = ["You must select an account."];
    withoutErrors = false;
  }
  if (form.amount <= 0) {
    errors.amount = ["The amount must be greater than 0."];
    withoutErrors = false;
  }
  return withoutErrors;
};
const fetchAccounts = () => {
  loadingAccounts.value = true;
  accountsServer
    .getAccounts()
    .then((response) => {
      accountsStore.accounts = response.data.results;
    })
    .catch((error) => {
      if (error.response && error.response.status === 401) {
        bus.dispatch("logout");
      } else {
        // if (error.response) {
        //   message.value = Object.values(error.response.data).flat().join(". ");
        // } else {
        //   message.value =
        //     "There was an error loading your accounts. Please, refresh the page.";
        // }
        // messageType.value = "negative";
        // messageDelay.value = 6000;
        // showMessage.value = true;
      }
    })
    .finally(() => {
      loadingAccounts.value = false;
    });
};
onMounted(() => {
  fetchAccounts();
});
</script>

<style scoped></style>
