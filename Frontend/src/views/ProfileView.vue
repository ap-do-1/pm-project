<script setup>
import { useAuthStore } from '@/stores/auth'
import { mdiAccount, mdiMail, mdiAsterisk, mdiFormTextboxPassword } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import FormFilePicker from '@/components/FormFilePicker.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import UserCard from '@/components/UserCard.vue'
import layout from '@/layouts/Layout.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import { reactive } from 'vue'

const authStore = useAuthStore()

const profileForm = reactive({
  name: authStore.userDetail.username,
  email: authStore.userDetail.email,
  avatar: authStore.userDetail.avatar
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

async function submitProfile() {
  let formData = new FormData()
  formData.append('username', profileForm.name)
  formData.append('email', profileForm.email)
  formData.append('avatar', profileForm.avatar)

  await authStore.updateUser(formData)
}

const submitPass = () => {
  authStore.setUserPassword({
    current_password: passwordForm.currentPassword,
    password: passwordForm.newPassword,
    password_confirmation: passwordForm.confirmPassword
  })
}
</script>

<template>
  <layout>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiAccount" title="Profile" main />
      <UserCard class="mb-6" />
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardBox is-form @submit.prevent="submitProfile">
          <FormField label="Avatar" help="Max 500kb">
            <FormFilePicker
              v-model="profileForm.avatar"
              label="Upload"
              accept=".jpg,.jpeg,.png"
              :max-size="500000"
            />
          </FormField>

          <FormField label="Name" help="Required. Your name">
            <FormControl
              v-model="profileForm.name"
              :icon="mdiAccount"
              name="username"
              required
              autocomplete="username"
            />
          </FormField>
          <FormField label="E-mail" help="Required. Your e-mail">
            <FormControl
              v-model="profileForm.email"
              :icon="mdiMail"
              type="email"
              name="email"
              required
              autocomplete="email"
            />
          </FormField>

          <template #footer>
            <BaseButtons>
              <BaseButton color="info" type="submit" label="Submit" />
            </BaseButtons>
          </template>
        </CardBox>

        <CardBox is-form @submit.prevent="submitPass">
          <FormField label="Current password" help="Required. Your current password">
            <FormControl
              v-model="passwordForm.currentPassword"
              :icon="mdiAsterisk"
              name="password_current"
              type="password"
              required
              autocomplete="current-password"
            />
          </FormField>

          <BaseDivider />

          <FormField label="New password" help="Required. New password">
            <FormControl
              v-model="passwordForm.newPassword"
              :icon="mdiFormTextboxPassword"
              name="new_password"
              type="password"
              required
              autocomplete="new-password"
            />
          </FormField>

          <FormField label="Confirm password" help="Required. New password one more time">
            <FormControl
              v-model="passwordForm.confirmPassword"
              :icon="mdiFormTextboxPassword"
              name="confirm_password"
              type="password"
              required
              autocomplete="new-password"
            />
          </FormField>
          <template #footer>
            <BaseButtons>
              <BaseButton color="info" type="submit" label="Submit" />
            </BaseButtons>
          </template>
        </CardBox>
      </div>
    </SectionMain>
  </layout>
</template>
