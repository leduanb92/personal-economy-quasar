<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated reveal>
      <q-toolbar>
        <q-toolbar-title> Personal Economy </q-toolbar-title>

        <q-btn
          flat
          round
          dense
          :icon="currentModeIcon"
          class="q-mr-sm"
          @click="toggleMode"
        />
        <div>v0.5</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      :model-value="true"
      show-if-above
      elevated
      dark
      class="bg-primary"
      :mini="miniMode"
      :breakpoint="720"
      :width="210"
    >
      <q-list>
        <q-item class="q-mx-sm q-px-xs">
          <q-item-section side>
            <q-btn
              flat
              dense
              round
              color="white"
              :icon="miniMode ? 'r_menu' : 'r_arrow_back'"
              aria-label="Menu"
              @click="toggleMiniMode"
            />
          </q-item-section>
        </q-item>

        <EssentialLink
          v-for="link in links"
          :key="link.title"
          v-bind="link"
          :mini-mode="miniMode"
        />
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
import { computed, reactive, ref } from "vue";
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
const miniMode = ref(true);

const currentModeIcon = computed(() => {
  return $q.dark.isActive ? "r_light_mode" : "r_dark_mode";
});
const toggleMode = () => {
  $q.dark.toggle();
};
const toggleMiniMode = () => {
  miniMode.value = !miniMode.value;
};
</script>
