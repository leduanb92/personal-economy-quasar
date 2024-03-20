<template>
  <div class="operation-container q-py-sm q-px-sm q-hoverable">
    <div class="row justify-center justify-sm-between q-gutter-sm no-wrap-sm">
      <p
        class="text-h6 text-capitalize ellipsis-2-lines q-mb-none"
        :title="operation.description"
      >
        {{ operation.description }}
      </p>
      <span class="text-h6" :class="amountClass">${{ operation.amount }}</span>
    </div>
    <div class="row justify-center justify-sm-between q-gutter-sm no-wrap-sm">
      <span class="text-subtitle1 text-grey-7">{{
        operation.account?.name
      }}</span>
      <span class="text-subtitle1 text-grey-7">{{ date }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { DateTime } from "luxon";

const props = defineProps({
  operation: { type: Object, required: true },
});

const date = computed(() => {
  return DateTime.fromISO(props.operation.date).toLocaleString();
});

const amountClass = computed(() => {
  return props.operation.type === "In" ? "text-positive" : "text-negative";
});
</script>

<style scoped lang="scss">
.operation-container:not(:last-child) {
  border-bottom: 2px dashed $grey-6;
}
</style>
