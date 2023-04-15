<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { mdiAccount, mdiAsterisk } from "@mdi/js";
import SectionFullScreen from "@/components/SectionFullScreen.vue";
import CardBox from "@/components/CardBox.vue";
import FormCheckRadio from "@/components/FormCheckRadio.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import LayoutS from "@/layouts/LayoutS.vue";
import axios from "axios";

const form = reactive({
  name: "",
  email: "",
  password: "",
});

const router = useRouter();

async function registerUser() {
  try {
    const response = await axios.post(
      "http://localhost:4000/api/user/register",
      form
    );
    if (response.status === 201) {
      router.push("/");
    }
  } catch (error) {}
}
</script>

<template>
  <LayoutS>
    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
      <CardBox :class="cardClass" is-form @submit.prevent="registerUser">
        <FormField label="Name" help="Please enter your name">
          <FormControl v-model="form.name" :icon="mdiAccount" name="name" />
        </FormField>

        <FormField label="Email" help="Please enter your email">
          <FormControl
            v-model="form.email"
            :icon="mdiAccount"
            name="email"
            autocomplete="email"
          />
        </FormField>

        <FormField label="Password" help="Please enter your password">
          <FormControl
            v-model="form.password"
            :icon="mdiAsterisk"
            type="password"
            name="password"
            autocomplete="new-password"
          />
        </FormField>

        <FormCheckRadio
          v-model="form.agree"
          name="agree"
          label="I agree to the terms and conditions"
          :input-value="true"
        />

        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="success" label="Register" />
            <BaseButton to="/login" color="info" outline label="Login" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutS>
</template>
