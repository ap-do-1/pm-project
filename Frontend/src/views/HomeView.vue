<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import SectionMain from '@/components/SectionMain.vue'
import Layout from '@/layouts/Layout.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import CardBox from '@/components/CardBox.vue'
import CardBoxComponentBody from '@/components/CardBoxComponentBody.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import CardBoxComponentHeader from '@/components/CardBoxComponentHeader.vue'
import { useProjectStore } from '@/stores/project'
import { useAuthStore } from '@/stores/auth'

const projectStore = useProjectStore()
const authStore = useAuthStore()

const currentTime = ref(getCurrentTime())

let intervalId

onMounted(() => {
  intervalId = setInterval(() => {
    currentTime.value = getCurrentTime()
  }, 1000)
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
})

function getCurrentTime() {
  const now = new Date()
  return now.toLocaleTimeString()
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const projects = computed(() => {
  const currentUser = authStore.userDetail._id

  const filteredProjects = projectStore.getProjects
  console.log('Filtered Projects:', filteredProjects)

  const filteredProjectsByUser = filteredProjects.filter(
    (project) => project.createdBy === currentUser
  )

  console.log('Filtered Projects By User:', filteredProjectsByUser)

  return filteredProjectsByUser || []
})

const recentProjects = computed(() => {
  console.log('Recent Projects:', projects.value.slice(0, 10))
  return projects.value.slice(0, 10)
})

const upcomingDeadlines = computed(() => {
  const filteredUpcoming = projects.value.filter(
    (project) => new Date(project.deadline) > new Date()
  )
  console.log('Upcoming Deadlines:', filteredUpcoming)
  return filteredUpcoming
})
</script>

<template>
  <Layout>
    <SectionMain>
      <div class="clock text-right pr-4">Time: {{ currentTime }}</div>
      <SectionTitle>
        <h2 class="text-xl font-semibold">Dashboard</h2>
      </SectionTitle>
      <CardBox>
        <CardBoxComponentBody>
          <p class="text-lg">
            Welcome to PM-Project, a comprehensive project management tool designed to help you stay
            organized, collaborate with your team, and meet project deadlines.
          </p>
        </CardBoxComponentBody>
      </CardBox>
      <BaseDivider />
      <CardBox>
        <CardBoxComponentHeader title="Recent Projects" />
        <CardBoxComponentBody>
          <ul>
            <li v-for="project in recentProjects" :key="project._id">
              {{ project.name }}
            </li>
          </ul>
        </CardBoxComponentBody>
      </CardBox>
      <BaseDivider />

      <CardBox>
        <CardBoxComponentHeader title="Upcoming Deadlines" />
        <CardBoxComponentBody>
          <ul>
            <li v-for="project in upcomingDeadlines" :key="project._id">
              {{ project.name }} - Due Date: {{ formatDate(project.deadline) }}
            </li>
          </ul>
        </CardBoxComponentBody>
      </CardBox>
    </SectionMain>
  </Layout>
</template>
