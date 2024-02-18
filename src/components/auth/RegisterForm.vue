<template>
  <q-card class="q-mt-16 form-card" key="login">
    <q-card-section class="card-title q-mx-xl q-pa-none bg-white">
      <div class="shadow-3 bg-white q-py-sm rounded-borders">
        <q-space></q-space>
        <span class="text-h4 text-primary">Register</span>
        <q-space></q-space>
      </div>
    </q-card-section>
    <q-card-section class="login-form">
      <q-form class="px-0 text-white">
        <q-input
          v-model="email"
          dark
          label="Email"
          for="email"
          type="email"
          autofocus
        >
          <template v-slot:before>
            <q-icon name="email" />
          </template>
        </q-input>
        <q-input
          v-model="password"
          dark
          label="Password"
          for="password"
          type="password"
        >
          <template v-slot:before>
            <q-icon name="lock" />
          </template>
        </q-input>
        <q-space></q-space>
        <q-btn
          rounded
          size="lg"
          :loading="loading"
          color="white"
          text-color="primary"
          class="full-width q-mt-lg"
          @click="login"
          >Accept
        </q-btn>
      </q-form>
    </q-card-section>
    <q-slide-transition appear>
      <q-banner
        v-if="incorrectAuth"
        dense
        rounded
        class="mt-6 bg-negative text-white"
      >
        <span v-for="error in errors" :key="error[0]">{{ error[0] }}</span>
      </q-banner>
    </q-slide-transition>
  </q-card>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useAuthStore } from "stores/auth-store";

const loading = ref(false);
const incorrectAuth = ref(false);
const email = ref("");
const password = ref("");
const errors = reactive({});

const authStore = useAuthStore();
</script>

<style scoped>
.card-title {
  position: relative;
  word-break: normal;
  transform: translateY(-20px);
}
.form-card {
  background-color: rgba(255, 255, 255, 0.15);
  min-width: 240px;
  width: 100%;
  max-width: 360px;
}
</style>
