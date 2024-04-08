<template>
  <q-page class="column flex-center q-pa-lg">
    <q-table
      title="Operations"
      row-key="id"
      :rows="operations"
      :columns="columns"
      :loading="loading"
      :grid="$q.screen.xs"
      class="operations-table shadow-2 rounded-borders full-width"
      style="flex-grow: 1"
      card-container-class="justify-center"
      wrap-cells
    >
      <template v-slot:top-right>
        <q-btn
          color="primary"
          icon="r_add"
          label="Add"
          @click="operationModal.value = true"
        />
      </template>
      <template v-slot:body-cell-description="props">
        <q-td :props="props" class="flex items-center">
          <div class="ellipsis-2-lines">{{ props.row.description }}</div>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { computed, inject, onMounted, reactive, ref, watch } from "vue";
import { useOperationsStore } from "stores/operations-store";
import { useWorkspaceStore } from "stores/workspace-store";
import operationsServer from "src/server/operations";
import { DateTime } from "luxon";
import { useQuasar } from "quasar";

const operationsStore = useOperationsStore();
const workspaceStore = useWorkspaceStore();
const bus = inject("bus");
const $q = useQuasar();

const operationModal = reactive({
  value: false,
  operation: null,
});
const loading = ref(false);
const loadingMessage = ref("Loading operations...");
const showMessage = ref(false);
const message = ref("");
const messageType = ref("positive");
const messageDelay = ref(3000);
const deletingPosition = reactive({
  x: 0,
  y: 0,
});
const columns = reactive([
  {
    name: "account",
    label: "Account",
    field: (row) => row.account.name,
    align: "left",
    sortable: true,
    style: "min-width: 6.25rem",
  },
  {
    name: "amount",
    label: "Amount",
    field: "amount",
    align: "left",
    sortable: true,
    format: (val, row) => `$${val}`,
    classes: (row) =>
      "text-bold " + (row.type === "In" ? "text-positive" : "text-negative"),
    style: "min-width: 6.25rem",
  },
  {
    name: "description",
    label: "Description",
    field: "description",
    align: "left",
  },
  {
    name: "date",
    label: "Date",
    field: "date",
    align: "left",
    sortable: true,
    format: (val) => DateTime.fromISO(val).toLocaleString(DateTime.DATE_MED),
    style: "min-width: 6.875rem",
  },
]);

const operations = computed(() =>
  operationsStore.operations.toSorted((a, b) => a.date.localeCompare(b.date))
);

watch(loading, () => {
  if (loading.value) {
    workspaceStore.showLoading({
      message: loadingMessage.value,
      delay: 700,
    });
  } else {
    workspaceStore.hideLoading();
    loadingMessage.value = "Loading operations...";
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
  operationModal.value = !operationModal.value;
};
const onSavedOperation = function (operation) {
  operationModal.operation = null;
  message.value = "The operation was saved successfully";
  messageType.value = "positive";
  showMessage.value = true;
  refresh();
};

const onEditOperation = function (operation) {
  operationModal.operation = operation;
  operationModal.value = true;
};

const onDeleteOperation = function (operation) {
  workspaceStore.showConfirmDialog({
    title: "Delete Operation",
    message: "Are you sure you want to delete this operation?",
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
      deleteOperation(operation);
    },
  });
};
const deleteOperation = (operation) => {
  // setElementOffset(operation);
  loadingMessage.value = `Deleting operation...`;
  loading.value = true;
  operationsServer
    .deleteOperation(operation.id)
    .then(() => {
      message.value = "The operation was deleted successfully";
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
          "There was an error deleting the operation";
        messageType.value = "negative";
        showMessage.value = true;
      }
    })
    .finally(() => (loading.value = false));
};
const refresh = () => {
  loading.value = true;
  operationsServer
    .getOperations()
    .then((response) => {
      operationsStore.operations = response.data.results;
    })
    .catch((error) => {
      if (error.response && error.response.status === 401) {
        bus.dispatch("logout");
      } else {
        if (error.response) {
          message.value = Object.values(error.response.data).flat().join(". ");
        } else {
          message.value =
            "There was an error loading your operations. Please, refresh the page.";
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

const setElementOffset = (operation) => {
  const el = document.getElementById("operation-" + operation.id);
  if (el) {
    deletingPosition.x = el.offsetLeft;
    deletingPosition.y = el.offsetTop;
  }
};

onMounted(() => {
  refresh();
});
</script>

<style scoped lang="scss">
.operations-table :deep(tbody tr) {
  vertical-align: top;
}
</style>
