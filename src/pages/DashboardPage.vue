<template>
  <q-page
    class="row justify-center items-stretch q-pa-lg q-col-gutter-md-x-md q-col-gutter-y-md q-col-gutter-md-y-none"
    style="max-height: calc(100vh - 50px); height: calc(100vh - 50px)"
  >
    <div class="column col-12 col-md-8 q-gutter-y-md">
      <q-card
        dark
        class="home-card bg-primary q-px-none q-px-md-md q-py-sm q-py-sm-md column justify-center"
      >
        <q-card-section class="q-py-xs-none q-py-sm-xs">
          <div
            class="text-bold"
            :class="$q.screen.name === 'xs' ? 'text-h5' : 'text-h4'"
          >
            Welcome {{ userName }}!
          </div>
        </q-card-section>
        <q-card-section class="q-py-none">
          <div class="text-h6">Have a nice day</div>
        </q-card-section>
        <q-img
          src="~assets/app-wallet.png"
          width="20%"
          initial-ratio="1"
          class="absolute-bottom-right"
          style="margin: 0 -1.5rem -1.25rem 0"
        ></q-img>
      </q-card>
      <div
        class="row justify-between items-stretch q-mt-none q-col-gutter-x-md q-col-gutter-y-md"
      >
        <div class="col-12 col-sm-6">
          <q-card class="text-center">
            <q-card-section class="q-pb-none">
              <div class="text-h6">Total Balance</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <div class="text-h4 text-positive ellipsis">
                ${{ totalBalance }}
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-6">
          <q-card class="text-center">
            <q-card-section class="q-pb-none">
              <div class="text-h6">Total Debts</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <div class="text-h4 text-negative ellipsis">$19999900</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <q-card class="chart-card text-center">
        <q-card-section class="q-pb-none">
          <div class="text-h6">Incomes</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div
            class="text-h4 text-positive overflow-hidden"
            style="text-overflow: ellipsis"
          >
            Incomes Info
          </div>
        </q-card-section>
      </q-card>
      <q-card class="chart-card text-center">
        <q-card-section class="q-pb-none">
          <div class="text-h6">Expenses</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div
            class="text-h4 text-negative overflow-hidden"
            style="text-overflow: ellipsis"
          >
            Expenses Info
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-12 col-md-4 q-pb-lg q-pb-md-none" style="max-height: 100%">
      <dashboard-operations-list />
    </div>
  </q-page>
</template>

<script setup>
import { useAuthStore } from "stores/auth-store";
import { computed, inject, onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import accountsServer from "src/server/accounts";
import DashboardOperationsList from "components/dashboard/DashboardOperationsList.vue";

const $q = useQuasar();
const authStore = useAuthStore();
const bus = inject("bus");
const totalBalance = ref(0);

const userName = computed(() => {
  const user = authStore.authData.user;
  return `${user.firstName} ${user.lastName}`;
});

// Methods
const fetchData = async () => {
  await Promise.all([fetchDashboardInfo()]);
};
const fetchDashboardInfo = async () => {
  accountsServer
    .getTotalBalance()
    .then((response) => {
      totalBalance.value = response.data.total;
    })
    .catch((error) => {
      if (error.response && error.response.status === 401) {
        bus.dispatch("logout");
      } else {
        console.log("Show message to user");
      }
    });
};

onMounted(() => {
  fetchData();
});
</script>

<style>
.home-card {
  height: 7.75rem;
  width: 100%;
}
.chart-card {
  min-height: 12.5rem;
  flex-grow: 1;
}
</style>
