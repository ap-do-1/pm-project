<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { mdiAccount, mdiAsterisk } from '@mdi/js'
import SectionFullScreen from '@/components/SectionFullScreen.vue'
import CardBox from '@/components/CardBox.vue'
import CardBoxComponentHeader from '@/components/CardBoxComponentHeader.vue'
import FormCheckRadio from '@/components/FormCheckRadio.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import sectionTitle from '@/components/sectionTitle.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import { useAuthStore, type RegisterData } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const registerData = reactive<RegisterData>({
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  password: '',
  password_confirm: ''
})

const errorMessage = ref<string>('')

async function submit() {
  await authStore
    .register(registerData)
    .then((res: any) => {
      router.replace({ name: 'login' })
    })
    .catch((err: { message: string }) => {
      errorMessage.value = err.message
    })
}
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="darkBg">
      <CardBox :class="cardClass" is-form @submit="submit">
        <p
          v-if="errorMessage"
          class="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
          role="alert"
        >
          {{ errorMessage }}
        </p>
        <FormField label="Username" help="Please enter your username">
          <FormControl v-model="registerData.username" :icon="mdiAccount" name="username" />
        </FormField>
        <FormField label="First Name" help="Please enter your first name">
          <FormControl v-model="registerData.first_name" :icon="mdiAccount" name="firstname" />
        </FormField>
        <FormField label="Last Name" help="Please enter your last name">
          <FormControl v-model="registerData.last_name" :icon="mdiAccount" name="lastname" />
        </FormField>

        <FormField label="Email" help="Please enter your email">
          <FormControl v-model="registerData.email" :icon="mdiAccount" name="Email" />
        </FormField>

        <FormField label="Password" help="Please enter your password">
          <FormControl
            v-model="registerData.password"
            :icon="mdiAsterisk"
            type="password"
            name="password"
          />
        </FormField>

        <FormField label="Confirm Password" help="Please Confirm your password">
          <FormControl
            v-model="registerData.password_confirm"
            :icon="mdiAsterisk"
            type="password"
            name="password"
          />
        </FormField>

        <template #footer>
          <BaseButtons>
            <BaseButton type="button" color="success" label="Register" @click="submit" />
            <p>Or</p>
            <BaseButton to="/login" color="info" outline label="Login" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
