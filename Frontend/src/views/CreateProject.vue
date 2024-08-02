<template>
  <Layout>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Create A Project" main>
        <BaseButton
          to="/projects"
          :icon="mdiArrowLeft"
          label="My Projects"
          color="contrast"
          rounded-full
          small
        />
      </SectionTitleLineWithButton>
      <CardBox form @submit.prevent="submit">
        <FormField label="Project Name">
          <FormControl placeholder="Project Name" v-model="form.name" :icon="mdiTextAccount" />
        </FormField>
        <FormField label="Project Description">
          <FormControl
            placeholder="Project Description"
            help="What is your project about. Max 255 characters"
            label="Project Description"
            v-model="form.description"
            type="textarea"
          />
        </FormField>

        <FormField label="Priority">
          <FormCheckRadioGroup
            type="radio"
            v-model="form.priority"
            name="Priority-checkbox"
            :options="{ low: 'Low', medium: 'Medium', high: 'High' }"
          />
        </FormField>

        <FormField label="Members">
          <FormControl v-model="form.members" :icon="mdiTextAccount" />
        </FormField>

        <FormField label="Deadline">
          <FormControl v-model="form.deadline" :icon="mdiClockTimeEightOutline" type="date" />
        </FormField>
        <BaseDivider />

        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Submit" @click="submit" />
            <BaseButton type="reset" color="info" outline label="Reset" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionMain>
  </Layout>
</template>

<script setup>
import { ref } from 'vue'

import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import FormCheckRadioGroup from '@/components/FormCheckRadioGroup.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import Layout from '@/layouts/Layout.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'

import { useRouter } from 'vue-router'
import { mdiBallotOutline, mdiClockTimeEightOutline, mdiTextAccount, mdiArrowLeft } from '@mdi/js'
import { useProjectStore } from '@/stores/project'
// Other imports...

const router = useRouter()
const projectStore = useProjectStore()

const form = ref({
  name: '',
  description: '',
  priority: 'low',
  members: [],
  deadline: ''
})

const submit = async () => {
  const membersInput = form.value.members
  const membersToSend = Array.isArray(membersInput) ? membersInput : [membersInput]

  const projectData = {
    name: form.value.name,
    description: form.value.description,
    priority: form.value.priority,
    members: membersToSend,
    deadline: form.value.deadline,
    status: 'new'
  }

  try {
    const newProject = await projectStore.createProject(projectData)

    // Navigate to the kanban board
    router.push(`/KanbanBoard/${newProject._id}`)

    // Reset form
    form.value = {
      name: '',
      description: '',
      priority: 'low',
      members: [],
      deadline: ''
    }
  } catch (error) {
    console.error('Error creating project:', error)
  }
}
</script>
