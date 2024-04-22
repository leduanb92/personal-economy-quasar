<template>
  <q-page
    class="column flex-center q-pa-lg"
    style="max-height: calc(100vh - 50px)"
  >
    <q-table
      title="Operations"
      row-key="id"
      :rows="operations"
      :columns="columns"
      :loading="loading"
      :grid="$q.screen.xs"
      v-model:selected="selectedOps"
      :selection="selectionType"
      :pagination="{ rowsPerPage: 20 }"
      class="operations-table shadow-2 rounded-borders full-width"
      style="flex-grow: 1; min-height: 20rem"
      card-container-class="justify-center"
      wrap-cells
      @row-contextmenu="
        (evt, row) => {
          toggleRowSelection(evt, row);
        }
      "
      @row-click="
        (evt, row) => {
          toggleRowSelection(evt, row, true);
        }
      "
    >
      <template v-slot:top-right>
        <q-btn
          v-if="selectionType !== 'none'"
          round
          flat
          color="primary"
          icon="r_done"
          padding="xs"
          @click="clearSelection"
        />
        <q-btn
          v-if="selectedOps.length > 0"
          round
          flat
          size="sm"
          color="negative"
          icon="r_delete"
          @click="onDeleteOperation(selectedOps[0])"
        />
        <q-btn
          v-if="showEditButton"
          round
          flat
          size="sm"
          color="primary"
          icon="r_edit"
          @click="toggleModal(true)"
        />
        <q-btn
          round
          flat
          color="primary"
          icon="r_add"
          padding="xs"
          @click="toggleModal()"
        />
      </template>
      <template v-slot:body-cell-description="props">
        <q-td :props="props">
          <div class="ellipsis-2-lines">{{ props.row.description }}</div>
        </q-td>
      </template>
    </q-table>
    <operation-modal
      v-model="operationModal.value"
      :operation="operationModal.operation"
      @saved="onSavedOperation"
      @cancelled="
        () => {
          operationModal.operation = null;
        }
      "
    />
  </q-page>
</template>

<script setup>
import { computed, inject, onMounted, reactive, ref, watch } from "vue";
import { useOperationsStore } from "stores/operations-store";
import { useWorkspaceStore } from "stores/workspace-store";
import operationsServer from "src/server/operations";
import OperationModal from "components/operations/OperationModal.vue";
// import OperationCard from "components/operations/OperationCard.vue";
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
const selectionType = ref("none");
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

const selectedOps = ref([]);

const operations = computed(() =>
  operationsStore.operations.toSorted((a, b) => a.date.localeCompare(b.date))
);
const showEditButton = computed(() => selectedOps.value.length === 1);

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
const toggleModal = function (isEdit = false) {
  operationModal.operation = isEdit ? selectedOps.value[0] : null;
  operationModal.value = !operationModal.value;
};
const onSavedOperation = function (operation) {
  operationModal.operation = null;
  message.value = "The operation was saved successfully";
  messageType.value = "positive";
  showMessage.value = true;
  refresh();
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
  loadingMessage.value = `Deleting operation...`;
  loading.value = true;
  operationsServer
    .deleteOperation(operation.id)
    .then(() => {
      message.value = "The operation was deleted successfully";
      messageType.value = "positive";
      showMessage.value = true;
      clearSelection(false);
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

const toggleRowSelection = (evt, row, checkSelectionActive = false) => {
  if (checkSelectionActive) {
    if (selectionType.value === "none") {
      return;
    }
  }
  evt.preventDefault();
  const index = selectedOps.value.findIndex((e) => e.id === row.id);
  if (index > -1) {
    selectedOps.value.splice(index, 1);
  } else {
    selectedOps.value.push(row);
  }
  selectionType.value = "multiple";
};

const clearSelection = (deactivate = true) => {
  selectedOps.value = [];
  if (deactivate) {
    selectionType.value = "none";
  }
};

onMounted(() => {
  refresh();
});
</script>

<style scoped lang="scss"></style>
