<template>
  <q-page class="flex column flex-center">
    <div v-if="!accounts.length" class="flex column flex-center">
      <q-icon name="wallet" size="76px" color="primary"></q-icon>
      <h2 class="text-primary">Your accounts</h2>
    </div>
    <q-list v-else>
      <q-item v-for="account in accounts" :key="account.id">
        <q-item-section> {{ account.name }} </q-item-section>
      </q-item>
    </q-list>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="secondary" @click="toggleModal" />
    </q-page-sticky>
    <add-account-modal v-model="showAddModal" @account-added="addAccount" />
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useAccountsStore } from "stores/accounts-store";
import AddAccountModal from "components/accounts/AddAccountModal.vue";

const store = useAccountsStore();
const showAddModal = ref(false);

const accounts = store.getAccounts;

//Methods
const toggleModal = function () {
  showAddModal.value = !showAddModal.value;
};
const addAccount = function (account) {
  store.addAccount(account);
};
</script>
