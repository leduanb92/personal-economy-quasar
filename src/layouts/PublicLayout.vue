<template>
  <q-layout view="hHh Lpr lFf">
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
import { computed } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();

const currentModeIcon = computed(() => {
  return $q.dark.isActive ? "r_light_mode" : "r_dark_mode";
});

//Methods
const toggleMode = () => {
  $q.dark.toggle();
};
</script>
