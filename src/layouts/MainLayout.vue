<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated reveal>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="r_menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

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
      v-model="leftDrawerOpen"
      show-if-above
      elevated
      :breakpoint="720"
      :width="230"
    >
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
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

<script>
import { computed, defineComponent, ref } from "vue";
import { useQuasar } from "quasar";
import EssentialLink from "components/EssentialLink.vue";

const linksList = [
  {
    title: "Home",
    caption: "",
    icon: "r_home",
    link: "/",
  },
  {
    title: "Accounts",
    caption: "Manage your wallets",
    icon: "r_wallet",
    link: "/accounts/",
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const $q = useQuasar();
    const leftDrawerOpen = ref(false);

    const currentModeIcon = computed(() => {
      return $q.dark.isActive ? "r_light_mode" : "r_dark_mode";
    });
    const toggleMode = () => {
      $q.dark.toggle();
    };
    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      currentModeIcon,
      toggleMode,
      toggleLeftDrawer,
    };
  },
});
</script>
