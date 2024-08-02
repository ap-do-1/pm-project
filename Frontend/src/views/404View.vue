<script setup>
import SectionMain from '@/components/SectionMain.vue'
import Layout from '@/layouts/Layout.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import sectionTitle from '@/components/SectionTitle.vue'
import CardBox from '@/components/CardBox.vue'
import CardBoxComponentBody from '@/components/CardBoxComponentBody.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'

//redict to homepage
import { onMounted } from 'vue'

onMounted(() => {
  setTimeout(() => {
    window.location.href = '/'
  }, 3000)
})
</script>

<template>
  <Layout>
    <LayoutGuest>
      <SectionMain>
        <sectionTitle> <h2 class="text-xl font-semibold">404</h2> </sectionTitle>
        <CardBox>
          <CardBoxComponentBody>
            <CardBox>
              <p>Page not found</p>
              <p>Redirecting to homepage...</p>

              <br />

              <p>Or click the button below to go back to homepage</p>
              <BaseButtons>
                <BaseButton type="button" color="success" label="Go Back" href="/" />
              </BaseButtons>
            </CardBox>
          </CardBoxComponentBody>
        </CardBox>
      </SectionMain>
    </LayoutGuest>
  </Layout>
</template>
