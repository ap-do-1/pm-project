<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

defineProps({
  username: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: null
  }
})

const authStore = useAuthStore()

const username = computed(() => authStore.userDetail.username)
const avatar = computed(() => authStore.userDetail.avatar)
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
