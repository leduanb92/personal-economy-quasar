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
          v-model="form.username"
          label="Username"
          for="username"
          type="text"
          maxlength="20"
          color="white"
          autofocus
          dark
        >
          <template v-slot:before>
            <q-icon name="r_person" color="white" />
          </template>
        </q-input>
        <q-input
          v-model="form.email"
          label="Email"
          for="email"
          type="email"
          color="white"
          dark
        >
          <template v-slot:before>
            <q-icon name="r_email" color="white" />
          </template>
        </q-input>
        <q-input
          v-model="form.password1"
          label="Password"
          for="password1"
          type="password"
          color="white"
          dark
        >
          <template v-slot:before>
            <q-icon name="r_lock" color="white" />
          </template>
        </q-input>
        <q-input
          v-model="form.password2"
          label="Confirm Password"
          for="password2"
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
          @click="register"
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
        <span v-for="error of errors" :key="error">{{ error }}</span>
      </q-banner>
    </q-slide-transition>
  </q-card>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useAuthStore } from "stores/auth-store";
import { useRouter } from "vue-router";
import authServer from "src/server/auth";

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
  username: "",
  email: "",
  password1: "",
  password2: "",
});
const loading = ref(false);
const errors = reactive([]);
const incorrectAuth = computed(() => errors.length > 0);

const register = async () => {
  loading.value = true;
  errors.length = 0;

  await authServer
    .register(form)
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
