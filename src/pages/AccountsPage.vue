<template>
  <q-page class="flex column flex-center">
    <transition enter-active-class="animated fadeIn" mode="out-in">
      <div v-if="!accounts.length && !loading" class="flex column flex-center">
        <q-icon name="r_wallet" size="76px" color="primary"></q-icon>
        <h2 class="text-primary">You do not have any account yet</h2>
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
      <q-btn fab icon="r_add" color="primary" @click="toggleModal" />
    </q-page-sticky>
    <account-modal
      v-model="accountModal.value"
      :account="accountModal.account"
      @saved="onSavedAccount"
      @cancelled="
        () => {
          accountModal.account = null;
        }
      "
    />
  </q-page>
</template>

<script setup>
import { computed, inject, onMounted, reactive, ref, watch } from "vue";
import { useAccountsStore } from "stores/accounts-store";
import { useWorkspaceStore } from "stores/workspace-store";
import accountsServer from "src/server/accounts";
import AccountModal from "components/accounts/AccountModal.vue";
import AccountCard from "components/accounts/AccountCard.vue";

const accountsStore = useAccountsStore();
const workspaceStore = useWorkspaceStore();
const bus = inject("bus");

const accountModal = reactive({
  value: false,
  account: null,
});
const loading = ref(false);
const showMessage = ref(false);
const message = ref("");
const messageType = ref("positive");
const messageDelay = ref(3000);

const accounts = computed(() =>
  accountsStore.accounts.toSorted((a, b) => a.name.localeCompare(b.name))
);

watch(loading, () => {
  if (loading.value) {
    workspaceStore.showLoading({
      message: "Loading accounts...",
      delay: 700,
    });
  } else {
    workspaceStore.hideLoading();
  }
});
watch(showMessage, () => {
  if (showMessage.value) {
    workspaceStore.showNotification({
      message: message.value,
      type: messageType.value,
      timeout: messageDelay.value,
      onDismiss: () => {
        showMessage.value = false;
        messageDelay.value = 3000;
      },
    });
  }
});

//Methods
const toggleModal = function () {
  accountModal.value = !accountModal.value;
};
const onSavedAccount = function (account) {
  accountModal.account = null;
  message.value = "The account was saved successfully";
  messageType.value = "positive";
  showMessage.value = true;
  refresh();
};

const onEditAccount = function (account) {
  accountModal.account = account;
  accountModal.value = true;
};

const onDeleteAccount = function (account) {
  workspaceStore.showConfirmDialog({
    title: "Delete Account",
    message: "Are you sure you want to delete this account?",
    ok: {
      label: "Delete",
      color: "negative",
      icon: "r_delete",
      flat: true,
    },
    cancel: {
      icon: "r_close",
      flat: true,
    },
    onOk: () => {
      deleteAccount(account);
    },
  });
};
const deleteAccount = (account) => {
  accountsServer
    .deleteAccount(account.id)
    .then(() => {
      message.value = "The account was deleted successfully";
      messageType.value = "positive";
      showMessage.value = true;
      refresh();
    })
    .catch((error) => {
      if (error.response && error.response.status === 401) {
        bus.dispatch("logout");
      } else {
        const errorData = error.response?.data || {};
        message.value =
          errorData["generalErrors"]?.join(". ") ||
          errorData["message"]?.join(". ") ||
          "There was an error deleting the account";
        messageType.value = "negative";
        showMessage.value = true;
      }
    });
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
        bus.dispatch("logout");
      } else {
        if (error.response) {
          message.value = Object.values(error.response.data).flat().join(". ");
        } else {
          message.value =
            "There was an error loading your accounts. Please, refresh the page.";
        }
        messageType.value = "negative";
        messageDelay.value = 6000;
        showMessage.value = true;
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
