<template>
  <q-page class="flex column flex-center">
    <div v-if="!accounts.length" class="flex column flex-center">
      <q-icon name="wallet" size="76px" color="primary"></q-icon>
      <h2 class="text-primary">Your accounts</h2>
    </div>
    <div v-else class="q-pa-md q-gutter-md flex flex-center">
      <account-card
        v-for="account in accounts"
        :key="account.id"
        :account="account"
        @edit="onEditAccount(account)"
        @delete="onDeleteAccount(account)"
      />
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="secondary" @click="toggleModal" />
    </q-page-sticky>
    <add-account-modal v-model="showAddModal" @account-added="addAccount" />
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useAccountsStore } from "stores/accounts-store";
import AddAccountModal from "components/accounts/AccountAddModal.vue";
import AccountCard from "components/accounts/AccountCard.vue";

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
