<template>
  <router-view v-slot="{ Component }">
    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      mode="out-in"
    >
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup>
import { inject, onBeforeUnmount, onMounted } from "vue";
import { useAuthStore } from "stores/auth-store";

const bus = inject("bus");
const authStore = useAuthStore();

// Methods
const logout = () => {
  console.log("You are being logged out");
  authStore.logout();
  location.reload();
};

onMounted(() => {
  bus.on("logout", logout);
});
onBeforeUnmount(() => {
  bus.off("logout", logout);
});
</script>
