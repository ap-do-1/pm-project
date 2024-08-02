<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { mdiCheckDecagram } from '@mdi/js'
import BaseLevel from '@/components/BaseLevel.vue'
import UserAvatarCurrentUser from '@/components/UserAvatarCurrentUser.vue'
import CardBox from '@/components/CardBox.vue'
import FormCheckRadio from '@/components/FormCheckRadio.vue'
import PillTag from '@/components/PillTag.vue'

const authStore = useAuthStore()

const userName = computed(() => authStore.userDetail.username)

const lastLogin = computed(() => {
  const lastLoginTime = authStore.userDetail.lastLogin
  if (lastLoginTime) {
    const date = new Date(lastLoginTime)
    return `Last login ${date.toLocaleString()}`
  }
  return ''
})

</script>

<template>
  <CardBox>
    <BaseLevel type="justify-around lg:justify-center">
      <UserAvatarCurrentUser class="lg:mx-12" />
      <div class="space-y-3 text-center md:text-left lg:mx-12">
        <h1 class="text-2xl">
          Hello, <b>{{ userName }}</b
          >!
        </h1>
        <p><p>{{ lastLogin }}</p> from <b>{{ userName }}</b></p>
      </div>
    </BaseLevel>
  </CardBox>
</template>
