<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated reveal>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          color="white"
          icon="r_menu"
          aria-label="Menu"
          class="xs"
          @click="showDrawer = !showDrawer"
        />
        <q-toolbar-title> Personal Economy </q-toolbar-title>

        <q-btn
          flat
          round
          dense
          :icon="currentModeIcon"
          class="q-mr-sm"
          @click="toggleDarkMode"
        />
        <div>v0.5</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="showDrawer"
      show-if-above
      elevated
      dark
      class="bg-primary"
      :mini="miniMode"
      :breakpoint="599"
      :width="210"
    >
      <q-list class="column full-height q-gutter-y-sm">
        <q-item class="q-mx-sm q-px-xs gt-xs">
          <q-item-section side>
            <q-btn
              flat
              dense
              round
              color="white"
              aria-label="Menu"
              @click="toggleMiniMode"
            >
              <transition
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut"
                duration="100"
                mode="out-in"
              >
                <q-icon v-if="miniMode" name="r_menu" />
                <q-icon v-else name="r_arrow_back" />
              </transition>
            </q-btn>
          </q-item-section>
        </q-item>

        <essential-link
          v-for="link in links"
          :key="link.title"
          v-bind="link"
          :mini-mode="miniMode"
        />
        <q-space />
        <q-item
          clickable
          dark
          class="q-mx-sm q-px-sm rounded-borders"
          aria-label="Logout"
          @click="logout"
        >
          <q-item-section side>
            <q-icon name="r_logout" color="white" />
          </q-item-section>

          <q-item-section class="text-white">
            <q-item-label>Logout</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, inject, reactive, ref } from "vue";
import { useQuasar } from "quasar";
import EssentialLink from "components/EssentialLink.vue";

const links = reactive([
  {
    title: "Dashboard",
    caption: "",
    icon: "r_home",
    color: "white",
    link: { name: "dashboard" },
  },
  {
    title: "Accounts",
    caption: "Manage your wallets",
    icon: "r_wallet",
    color: "white",
    link: { name: "account-list" },
  },
]);

const $q = useQuasar();
const bus = inject("bus");
const miniMode = ref(true);
const showDrawer = ref(true);

const miniToggleIcon = computed(() => {
  return miniMode.value ? "menu" : "arrow";
});

const currentModeIcon = computed(() => {
  return $q.dark.isActive ? "r_light_mode" : "r_dark_mode";
});
const toggleDarkMode = () => {
  $q.dark.toggle();
};
const toggleMiniMode = () => {
  miniMode.value = !miniMode.value;
};
const logout = () => {
  bus.emit("logout");
};
</script>
