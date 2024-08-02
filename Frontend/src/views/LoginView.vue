<script setup lang="ts">
import { reactive, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mdiAccount, mdiAsterisk } from '@mdi/js'
import SectionFullScreen from '@/components/SectionFullScreen.vue'
import CardBox from '@/components/CardBox.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import { useAuthStore, type LoginData } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const loginData = reactive<LoginData>({
  email: '',
  password: ''
})

const errorMessage = ref<string>('')

async function submit() {
  await authStore
    .login(loginData)
    .then((res: any) => {
      router.replace({ name: 'dashboard' })
    })
    .catch((err: { message: string }) => {
      console.log(err)
      errorMessage.value = err.message
    })
}
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="darkBg">
      <CardBox :class="cardClass" is-form @submit="submit">
        <FormField label="Email" help="Please enter your email">
          <FormControl
            v-model="loginData.email"
            :icon="mdiAccount"
            name="email"
            autocomplete="username"
          />
        </FormField>

        <FormField label="Password" help="Please enter your password">
          <FormControl
            v-model="loginData.password"
            :icon="mdiAsterisk"
            type="password"
            name="password"
            autocomplete="current-password"
          />
        </FormField>

        <template #footer>
          <BaseButtons>
            <BaseButton type="button" color="success" label="Login" @click="submit" />
            <p>Or</p>
            <BaseButton to="/Register" color="info" outline label="Register" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
