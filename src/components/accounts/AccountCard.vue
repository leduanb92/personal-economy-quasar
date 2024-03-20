<template>
  <q-card class="account-card column">
    <q-card-section class="flex flex-center q-py-sm" style="flex-grow: 1">
      <div class="text-h6 ellipsis-2-lines q-pt-sm">{{ account.name }}</div>
    </q-card-section>
    <q-card-section
      class="flex flex-center bg-primary text-white q-py-sm"
      style="
        border-bottom-left-radius: inherit;
        border-bottom-right-radius: inherit;
      "
    >
      <div class="text-subtitle2">
        Balance: ${{ account.balance ?? account.initialBalance }}
      </div>
    </q-card-section>
    <div class="account-actions absolute-top-right hidden">
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
  </q-card>
</template>

<script setup>
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
