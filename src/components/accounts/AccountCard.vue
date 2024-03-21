<template>
  <q-card class="account-card column">
    <q-card-section class="flex flex-center q-py-sm" style="flex-grow: 1">
      <div
        class="text-center ellipsis-2-lines q-pt-sm"
        :class="$q.screen.name === 'xs' ? 'text-h4' : 'text-h5'"
      >
        {{ account.name }}
      </div>
      <div
        class="account-actions absolute-top-right"
        :class="{ hidden: !$q.platform.is.mobile }"
      >
        <q-btn
          flat
          round
          size="sm"
          color="primary"
          icon="r_edit"
          @click="emit('edit', account)"
        />
        <q-btn
          flat
          round
          size="sm"
          color="negative"
          icon="r_delete"
          @click="emit('delete', account)"
        />
      </div>
    </q-card-section>
    <q-card-section class="flex flex-center bg-primary text-white q-py-sm">
      <div
        :class="$q.screen.name === 'xs' ? 'text-subtitle1' : 'text-subtitle2'"
      >
        Balance: ${{ account.balance ?? account.initialBalance }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useQuasar } from "quasar";

const $q = useQuasar();
const emit = defineEmits(["edit", "delete"]);
const props = defineProps({
  account: { type: Object, required: true },
});
</script>

<style scoped lang="scss">
.account-card {
  width: 200px;
  max-width: 200px;
  min-height: 130px;

  &:hover .account-actions {
    display: block !important;
  }
}
</style>
