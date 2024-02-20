<template>
  <q-page class="home-page flex flex-center q-px-xl q-py-md">
    <div class="row justify-center" style="row-gap: 40px">
      <div class="col-10 col-md-6 text-center flex flex-center q-px-lg">
        <h1 class="text-h3 q-my-none">
          Manage your money with Personal Economy
        </h1>
        <q-separator
          color="white"
          size="0.125rem"
          class="full-width"
          spaced
        ></q-separator>
        <p class="text-justify text-subtitle1">
          Welcome, with us you will be able to manage your different money
          accounts and save the operations you make in them. You will also be
          able to save information about your debts, either as a debtor or
          creditor. Don't wait any longer, sign up and start taking your economy
          now.
        </p>
        <q-btn
          class="full-width q-mt-md"
          color="white"
          text-color="primary"
          size="lg"
          padding="sm lg"
          rounded
          :label="showLoginForm ? 'Sign up' : 'Sign in'"
          @click="showLoginForm = !showLoginForm"
        />
      </div>
      <div class="col-12 col-md-6 text-center flex flex-center q-px-md">
        <transition
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          duration="300"
          mode="out-in"
        >
          <login-form v-if="showLoginForm" />
          <register-form v-else />
        </transition>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import LoginForm from "components/auth/LoginForm.vue";
import RegisterForm from "components/auth/RegisterForm.vue";

const showLoginForm = ref(true);
</script>

<style scoped>
.home-page {
  background: rgb(25, 80, 210);
  background: linear-gradient(
    225deg,
    rgba(25, 80, 210, 1) 0%,
    rgba(25, 118, 210, 1) 15%,
    rgba(25, 166, 210, 1) 100%
  );
  color: white;
}
</style>
