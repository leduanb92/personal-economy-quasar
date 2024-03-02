<template>
  <q-item
    clickable
    tag="a"
    :to="link"
    exact
    dark
    active-class="active-link"
    class="q-mx-sm q-px-sm rounded-borders"
  >
    <q-item-section v-if="icon" side>
      <q-icon :name="icon" :color="color" />
    </q-item-section>

    <q-item-section :class="'text-' + color">
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label v-if="caption" caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    default: "",
  },
  link: {
    type: String,
    default: "#",
  },
  icon: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "",
  },
  mini: {
    type: Boolean,
    default: false,
  },
});
</script>

<style>
.active-link {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
