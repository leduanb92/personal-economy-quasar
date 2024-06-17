<template>
  <q-page
    class="column no-wrap flex-center q-pa-lg"
    style="max-height: calc(100vh - 50px)"
  >
    <div class="row q-mb-md full-width">
      <div class="rounded-borders q-px-sm" :class="filterClasses">
        <q-select
          v-model="filters.accountId"
          :options="accountOptions"
          label="Account"
          rounded
          emit-value
          map-options
          clearable
          dense
          @update:model-value="refresh"
        />
      </div>
    </div>
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
      style="flex-grow: 1; min-height: 15rem"
      card-container-class="justify-center overflow-auto q-gutter-md q-pa-sm"
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
          @click="onDeleteOperations"
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
      <template v-slot:item="props">
        <operation-card
          :operation="props.row"
          :selected="props.selected"
          @contextmenu="toggleRowSelection($event, props.row)"
          @click="toggleRowSelection($event, props.row, true)"
        />
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
import { useAccountsStore } from "stores/accounts-store";
import { useWorkspaceStore } from "stores/workspace-store";
import operationsServer from "src/server/operations";
import OperationModal from "components/operations/OperationModal.vue";
import OperationCard from "components/operations/OperationCard.vue";
import { DateTime } from "luxon";
import { useQuasar } from "quasar";

const operationsStore = useOperationsStore();
const accountsStore = useAccountsStore();
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

//Computed
const operations = computed(() =>
  operationsStore.operations.toSorted((a, b) => b.date.localeCompare(a.date))
);
const filters = computed({
  get: () => operationsStore.filters,
  set: (filters) => operationsStore.setFilters(filters),
});
const showEditButton = computed(() => selectedOps.value.length === 1);
const accountOptions = computed(() => {
  return accountsStore.accounts.map((account) => {
    return {
      label: account.name,
      value: account.id,
      data: account,
    };
  });
});
const filterClasses = computed(() => {
  const classes = [];
  classes.push($q.dark.isActive ? "shadow-3" : "shadow-2");
  classes.push($q.screen.xs ? "col-12" : "col-4");
  return classes.join(" ");
});

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

const manageErrors = function (
  error,
  generalMessage = "There was an error. Please, try again"
) {
  if (error.response && error.response.status === 401) {
    bus.emit("logout");
  } else {
    if (!error.response)
      message.value =
        "There was a network error. Please, check your connection";
    else {
      const errorData = error.response?.data || {};
      const errorMessage =
        errorData["generalErrors"] || errorData["message"] || generalMessage;
      message.value = Array.isArray(errorMessage)
        ? errorMessage.join(". ")
        : errorMessage;
      messageType.value = "negative";
      showMessage.value = true;
    }
  }
};

const onSavedOperation = function (operation) {
  operationModal.operation = null;
  message.value = "The operation was saved successfully";
  messageType.value = "positive";
  showMessage.value = true;
  refresh();
};

const onDeleteOperations = function () {
  if (selectedOps.value.length === 0) {
    return;
  }
  const multiple = selectedOps.value.length > 1;
  const message = multiple
    ? `Are you sure you want to delete these ${selectedOps.value.length} operations?`
    : "Are you sure you want to delete this operation?";
  workspaceStore.showConfirmDialog({
    title: "Delete Operation(s)",
    message,
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
      deleteOperations(multiple);
    },
  });
};

const deleteOperations = (multiple) => {
  loadingMessage.value = `Deleting operation(s)...`;
  loading.value = true;
  if (multiple) {
    const ids = selectedOps.value.map((op) => op.id);
    operationsServer
      .deleteOperations(ids)
      .then(() => {
        message.value = "The operations were deleted successfully";
        messageType.value = "positive";
        showMessage.value = true;
        clearSelection(false);
        refresh();
      })
      .catch((err) =>
        manageErrors(err, "There was an error deleting the operations")
      )
      .finally(() => (loading.value = false));
  } else {
    operationsServer
      .deleteOperation(selectedOps.value[0]?.id)
      .then(() => {
        message.value = "The operation was deleted successfully";
        messageType.value = "positive";
        showMessage.value = true;
        clearSelection(false);
        refresh();
      })
      .catch((err) =>
        manageErrors(err, "There was an error deleting the operation")
      )
      .finally(() => (loading.value = false));
  }
};

const refresh = () => {
  loading.value = true;
  operationsServer
    .getOperations({ accountId: filters.value.accountId })
    .then((response) => {
      operationsStore.operations = response.data.results;
    })
    .catch((error) => {
      if (error.response && error.response.status === 401) {
        bus.emit("logout");
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
