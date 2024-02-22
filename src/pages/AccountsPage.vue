<template>
  <q-page class="flex column flex-center">
    <transition enter-active-class="animated fadeIn" mode="out-in">
      <div v-if="!accounts.length" class="flex column flex-center">
        <q-icon name="r_wallet" size="76px" color="primary"></q-icon>
        <h2 class="text-primary">Your accounts</h2>
      </div>
      <div v-else class="q-pa-md q-gutter-md flex flex-center">
        <transition-group
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOutDown absolute"
          move-class="in-motion"
          appear
        >
          <account-card
            v-for="account in accounts"
            :key="account.id"
            :account="account"
            @edit="onEditAccount(account)"
            @delete="onDeleteAccount(account)"
          />
        </transition-group>
      </div>
    </transition>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="r_add" color="secondary" @click="toggleModal" />
    </q-page-sticky>
    <account-modal
      v-model="accountModal.value"
      :account="accountModal.account"
      @account-added="addAccount"
      @account-edited="editAccount"
      @cancelled="accountModal.account = null"
    />
  </q-page>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useAccountsStore } from "stores/accounts-store";
import { useAuthStore } from "stores/auth-store";
import accountsServer from "src/server/accounts";
import AccountModal from "components/accounts/AccountModal.vue";
import AccountCard from "components/accounts/AccountCard.vue";

const accountsStore = useAccountsStore();
const authStore = useAuthStore();

const accountModal = reactive({
  value: false,
  account: null,
});

const accounts = computed(() =>
  accountsStore.accounts.toSorted((a, b) => a.nombre.localeCompare(b.nombre))
);

//Methods
const toggleModal = function () {
  accountModal.value = !accountModal.value;
};
const addAccount = function (account) {
  store.addAccount(account);
  accountModal.account = null;
};

const editAccount = function (account) {
  store.editAccount(account);
  accountModal.account = null;
};

const onEditAccount = function (account) {
  accountModal.account = account;
  accountModal.value = true;
};

const onDeleteAccount = function (account) {
  store.deleteAccount(account);
};
const refresh = () => {
  loading.value = true;
  accountsServer
    .getAccounts()
    .then((response) => {
      accountsStore.accounts = response.data.results;
    })
    .catch((error) => {
      if (error.response && error.response.status === 401) {
        // EventBus.dispatch("logout");
        authStore.logout();
        window.location.reload();
      } else {
        if (error.response) {
          errors.value = error.response.data;
        } else {
          errors.value = {
            error: [
              "Ocurrió un error de conexión con el servidor. Inténtelo de nuevo.",
            ],
          };
        }
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  refresh();
});
</script>
