<template>
  <q-card
    class="operation-card column"
    :class="{ selected }"
    style="user-select: none"
  >
    <q-card-section class="column flex-center q-pa-sm" style="flex-grow: 1">
      <div class="text-center text-subtitle1">{{ operation.date }}</div>
      <div
        class="text-center text-h4 ellipsis-2-lines q-pt-sm"
        :class="[operation.type === 'In' ? 'text-positive' : 'text-negative']"
      >
        ${{ operation.amount }}
      </div>
      <div
        class="text-center ellipsis-2-lines q-pt-sm"
        :class="$q.screen.name === 'xs' ? 'text-h5' : 'text-h6'"
        style="user-select: text"
      >
        {{ operation.description }}
      </div>
    </q-card-section>
    <q-card-section
      class="flex flex-center bg-primary text-h5 text-white q-py-sm"
    >
      <div>{{ operation.account?.name }}</div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useQuasar } from "quasar";

const $q = useQuasar();
const props = defineProps({
  operation: { type: Object, required: true },
  selected: { type: Boolean, default: false },
});
</script>

<style scoped lang="scss">
.operation-card {
  width: 100%;
  max-width: 230px;
  min-height: 130px;

  &.selected {
    transform: scale(0.8);
    transform-origin: 50% 50%;
  }
}
</style>
