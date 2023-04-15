<script setup>
import { computed } from "vue";
import { useMainStore } from "@/stores/main";

const mainStore = useMainStore();

const avatar = computed(
  () =>
    mainStore.user.avatar ??
    `https://avatars.dicebear.com/api/${
      mainStore.user.api
    }/${mainStore.user.username.replace(/[^a-z0-9]+/i, "-")}.svg`
);

const username = computed(() => mainStore.user.name);
</script>

<template>
  <div>
    <img
      :src="avatar"
      :alt="username"
      class="rounded-full block h-auto w-full max-w-full bg-gray-100 dark:bg-slate-800"
    />
    <slot />
  </div>
</template>
