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
        <q-btn v-close-popup icon="close" flat label="Cancel" />
        <q-btn
          v-close-popup
          flat
          :icon="account ? 'save' : 'add'"
          :label="account ? 'Save' : 'Add'"
          @click="onSave"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, reactive, watchEffect } from "vue";

const emit = defineEmits([
  "update:modelValue",
  "accountAdded",
  "accountEdited",
]);
const props = defineProps({
  modelValue: Boolean,
  account: { type: Object, default: null },
});

const form = reactive({
  id: "",
  name: "",
  initialBalance: 0,
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

const onSave = function () {
  if (validate()) {
    if (props.account) {
      emit("accountEdited", { ...form });
    } else {
      form.id = crypto.randomUUID();
      emit("accountAdded", { ...form });
    }
    resetForm();
    model.value = false;
  }
};
const validate = function () {
  return !!form.name;
};
</script>

<style scoped></style>
