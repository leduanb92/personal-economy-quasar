<script setup>
import { ref, computed, reactive } from "vue";

const emit = defineEmits(["update:modelValue", "accountAdded"]);
const props = defineProps({
  modelValue: Boolean,
});

const form = reactive({
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

//Methods
const resetForm = function () {
  form.name = "";
  form.initialBalance = 0;
};

const addAccount = function () {
  if (validate()) {
    emit("accountAdded", { ...form });
    resetForm();
    model.value = false;
  }
};
const validate = function () {
  return !!form.name;
};
</script>

<template>
  <q-dialog v-model="model" persistent>
    <q-card style="min-width: 350px" @keyup.enter="addAccount">
      <q-card-section>
        <div class="text-h6">Add account</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input dense v-model="form.name" autofocus />
        <q-input dense v-model="form.initialBalance" type="number" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn icon="close" flat label="Cancel" v-close-popup />
        <q-btn icon="add" flat label="Add" v-close-popup @click="addAccount" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
