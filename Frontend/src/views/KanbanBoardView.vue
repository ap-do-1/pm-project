<template>
  <Layout>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiTableBorder" title="Project Board" main>
        <BaseButtons>
          <BaseButton
            v-if="projectId"
            :to="`/EditProject/${projectId}`"
            :icon="mdiFileEdit"
            label="Edit Project"
            color="primary"
            rounded-full
            small
          />
        </BaseButtons>
      </SectionTitleLineWithButton>

      <ProjectTitle />
      <KanbanBoard :projectId="projectId" />
    </SectionMain>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import KanbanBoard from '@/components/kanban/KanbanBoard.vue'
import Layout from '@/layouts/Layout.vue'
import ProjectTitle from '@/components/kanban/ProjectTitle.vue'
import SectionMain from '@/components/SectionMain.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import { mdiFileEdit, mdiTableBorder } from '@mdi/js'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import { useProjectStore } from '@/stores/project'
import { useRouter } from 'vue-router'

const router = useRouter()
const projectStore = useProjectStore()

const projectId = ref('')

onMounted(async () => {
  projectId.value = router.currentRoute.value.params.id
  await projectStore.fetchProject(projectId.value)
})
</script>
