<script setup>
import { reactive, ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { mdiAccount, mdiAsterisk } from "@mdi/js";
import SectionFullScreen from "@/components/SectionFullScreen.vue";
import CardBox from "@/components/CardBox.vue";
import FormCheckRadio from "@/components/FormCheckRadio.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";
import axios from "axios";

const form = reactive({
  login: "",
  pass: "",
  remember: false,
  fields: {},
});


const router = useRouter();

const formRef = ref(null);


const validation = () => {
  const errors = {};
  if (!form.login) {
    errors.login = "Please enter your login";
  }
  if (!form.pass) {
    errors.pass = "Please enter your password";
  }
  return errors;
};


watch(form, () => {
  const errors = validation();
  form.fields.login = errors.login;
  form.fields.pass = errors.pass;
});

const isFormValid = computed(() => {
  const errors = validation();
  return Object.keys(errors).length === 0;
});

const submit = async () => {
  try {
    // send POST request to API
    const response = await axios.post("http://localhost:4000/api/user/login", {
      email: form.login,
      password: form.pass,
    });
    // get token from response
    const token = response.data.data.token;
    // save token to local storage
    localStorage.setItem("auth-token", token);

    //delete and reset form
    form.login = "";
    form.pass = "";
    form.remember = false;
    formRef.value.reset();

    // redirect to homepage
    router.push("/");
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="darkBg">
      <CardBox
        :form-ref="formRef"
        :class="cardClass"
        is-form
        @submit.prevent="submit"
      >
        <FormField label="Login" help="Please enter your login">
          <form ref="formRef"></form>
          <FormControl
            v-model="form.login"
            :icon="mdiAccount"
            type="text"
            name="login"
            autocomplete="username"
          />
        </FormField>

        <FormField label="Password" help="Please enter your password">
          <FormControl
            v-model="form.pass"
            :icon="mdiAsterisk"
            type="password"
            name="password"
            autocomplete="current-password"
          />
        </FormField>

        <FormCheckRadio
          v-model="form.remember"
          name="remember"
          label="Remember"
          :input-value="true"
        />

        <template #footer>
          <BaseButtons>
            <BaseButton
              type="submit"
              color="success"
              label="Login"
              :disabled="!isFormValid"
            />
            <BaseButton to="/register" color="info" outline label="Register" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>