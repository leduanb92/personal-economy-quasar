<template>
  <q-card class="full-height column no-wrap" style="min-height: 15.625rem">
    <q-card-section class="column q-pa-none">
      <div
        class="row items-center bg-primary border-radius-inherit q-px-md q-py-xs text-white shadow-1"
      >
        <div class="text-h6">Operations</div>
        <q-space />
        <div class="text-caption cursor-pointer flex items-center">
          <span>{{
            selectedDate.toLocaleString({
              month: "long",
              year: "numeric",
            })
          }}</span>
          <q-icon right name="r_keyboard_arrow_down" />
          <q-menu>
            <q-date
              v-model="calendarDate"
              first-day-of-week="1"
              mask="YYYY-MM-DD"
              no-unset
              minimal
            />
          </q-menu>
        </div>
      </div>
      <div
        class="week-days row justify-evenly items-center q-py-sm q-px-xs shadow-1"
      >
        <div
          v-for="day in weekDays"
          :key="day.toISO()"
          class="week-days__day column items-center text-h6 text-primary text-center cursor-pointer q-pa-sm"
          :class="{ selected: selectedDate.equals(day) }"
          @click="selectedDate = day"
        >
          <span class="text-uppercase text-caption">{{
            day.toFormat("EEE")
          }}</span>
          <span class="text-uppercase text-h5 text-bold">{{
            day.toFormat("dd")
          }}</span>
        </div>
      </div>
    </q-card-section>
    <q-card-section class="operation-list-container q-py-xs q-mt-xs q-mb-sm">
      <dashboard-operations-list-item
        v-for="op in operations"
        :key="op.id"
        :operation="op"
      />
    </q-card-section>
    <q-inner-loading :showing="showLoading" />
  </q-card>
</template>

<script setup>
import { computed, inject, onMounted, ref, watch } from "vue";
import { DateTime } from "luxon";
import operationsServer from "src/server/operations";
import { debounce } from "quasar";
import DashboardOperationsListItem from "components/dashboard/DashboardOperationsListItem.vue";

const bus = inject("bus");
const selectedDate = ref(DateTime.now().startOf("day"));
const showLoading = ref(false);
const operations = ref([]);

// Computed
const weekDays = computed(() => {
  const days = [];
  const start = selectedDate.value.startOf("week");
  for (let i = 0; i < 7; i++) {
    days.push(start.plus({ days: i }));
  }
  return days;
});
const calendarDate = computed({
  get: () => selectedDate.value.toISODate(),
  set: (value) => {
    selectedDate.value = DateTime.fromISO(value);
  },
});

// Methods
let fetchData = () => {
  showLoading.value = true;
  operationsServer
    .getOperationsByDate(selectedDate.value.toISODate())
    .then((response) => {
      operations.value = response.data.list;
    })
    .catch((err) => {
      if (err.response && err.response.status === 401) {
        bus.emit("logout");
      } else {
        console.log("Show message to user");
      }
    })
    .finally(() => {
      showLoading.value = false;
    });
};

// Watch
watch(selectedDate, () => {
  fetchData();
});

onMounted(() => {
  fetchData = debounce(fetchData, 700);
  fetchData();
});
</script>

<style scoped lang="scss">
.operation-list-container {
  flex-grow: 1;
  min-height: 7.875rem;
  overflow-y: auto;
}
.week-days {
  background-color: rgba($primary, 0.2);
  border-bottom-left-radius: $generic-border-radius !important;
  border-bottom-right-radius: $generic-border-radius !important;

  &__day {
    flex-grow: 1;
    border-radius: $generic-border-radius;

    &.selected {
      background-color: $primary;
      color: white !important;
    }

    &:hover:not(.selected) {
      background-color: rgba($primary, 0.25);
    }
  }
}
</style>
