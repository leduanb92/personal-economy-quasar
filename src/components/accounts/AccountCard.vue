<template>
  <q-card class="account-card bg-primary text-white">
    <q-card-section class="flex flex-center column">
      <div class="text-h6">{{ account.name }}</div>
      <div class="text-subtitle2">
        Balance: ${{ account.balance || account.initialBalance }}
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn
        flat
        size="sm"
        color="white"
        icon="edit"
        @click="$emit('edit', account)"
      />
      <q-btn
        flat
        size="sm"
        color="white"
        icon="delete"
        @click="$emit('delete', account)"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
const emit = defineEmits(["edit", "delete"]);
const props = defineProps({
  account: { type: Object, required: true },
});
</script>

<style scoped>
.account-card {
  width: 200px;
  max-width: 200px;
}
</style>
