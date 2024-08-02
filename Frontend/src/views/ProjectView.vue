<template>
  <Layout>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiTableBorder" title="My Projects" main>
        <BaseButton
          to="CreateProject"
          :icon="mdiPencilOutline"
          label="Create a new Project"
          color="contrast"
          rounded-full
          small
        />
      </SectionTitleLineWithButton>

      <TableProject :projects="projectStore.getProjects" />
    </SectionMain>
  </Layout>
</template>

<script setup>
import { mdiTableBorder, mdiPencilOutline } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import TableProject from '@/components/TableProject.vue'
import Layout from '@/layouts/Layout.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useProjectStore } from '@/stores/project'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

//route
const $route = useRoute()

//props
const $props = defineProps({
  id: {
    type: String,
    default: ''
  }
})

// Get the project store
const projectStore = useProjectStore()

// Get the project ID from the route or props
const projectId = ref($route.params.id || $props.id)

// Fetch the project
projectStore.fetchProject(projectId.value)

onMounted(() => {
  // Fetch the projects
  projectStore.fetchProjects()

  // Fetch the project
  projectStore.fetchProject(projectId.value)
})
</script>
