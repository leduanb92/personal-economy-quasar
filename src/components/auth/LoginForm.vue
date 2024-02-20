<template>
  <q-card class="q-mt-16 form-card full-height flex column" key="login">
    <q-card-section class="card-title q-mx-xl q-pa-none bg-white">
      <div class="shadow-3 bg-white q-py-sm rounded-borders">
        <q-space></q-space>
        <span class="text-h4 text-primary">Log In</span>
        <q-space></q-space>
      </div>
    </q-card-section>
    <q-card-section class="login-form flex column">
      <q-form class="px-0 text-white flex column">
        <q-input
          v-model="email"
          label="Email"
          for="email"
          type="email"
          color="white"
          dark
          autofocus
        >
          <template v-slot:before>
            <q-icon name="r_email" color="white" />
          </template>
        </q-input>
        <q-input
          v-model="password"
          label="Password"
          for="password"
          type="password"
          color="white"
          dark
        >
          <template v-slot:before>
            <q-icon name="r_lock" color="white" />
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
    <q-card-section
      class="q-pa-none overflow-hidden-y"
      style="transition: height 0.4s ease-in-out"
    >
      <transition
        appear
        enter-active-class="animated fadeInUp"
        leave-active-class="animated fadeOutDown"
      >
        <q-banner
          v-if="incorrectAuth"
          dense
          rounded
          inline-actions
          class="mt-6 bg-negative text-white"
        >
          <span v-for="error of errors" :key="error">{{ error }}</span>
          <template v-slot:action>
            <q-btn
              flat
              color="white"
              icon="r_close"
              @click="incorrectAuth = false"
            />
          </template>
        </q-banner>
      </transition>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useAuthStore } from "stores/auth-store";
import { useRouter } from "vue-router";
import authServer from "src/server/auth";

const authStore = useAuthStore();
const router = useRouter();

const loading = ref(false);
const email = ref("");
const password = ref("");
const errors = reactive([]);
const incorrectAuth = computed({
  get: () => errors.length > 0,
  set: (value) => {
    if (!value) {
      errors.length = 0;
    }
  },
});

const login = async () => {
  loading.value = true;
  errors.length = 0;

  await authServer
    .login({
      email: email.value,
      password: password.value,
    })
    .then((response) => {
      if (response && response.data) {
        authStore.saveLoginData(response.data);
        router.push({ name: "dashboard" });
      }
    })
    .catch((err) => {
      const responseErrors = Object.values(err.response.data).flat();
      if (responseErrors.length === 0) {
        responseErrors.push("There was an error. Please try again.");
      }
      errors.push(...responseErrors);
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<style scoped lang="scss">
.form-card {
  background-color: rgba(255, 255, 255, 0.15);
  min-width: 240px;
  width: 100%;
  max-width: 360px;
}
.card-title {
  position: relative;
  word-break: normal;
  transform: translateY(-20px);
}
.login-form {
  flex-grow: 1;

  :deep(.q-form) {
    flex-grow: 1;
  }
}
</style>
