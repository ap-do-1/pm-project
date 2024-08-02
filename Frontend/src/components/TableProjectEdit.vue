<template>
  <CardBox>
    <div>
      <h2>Edit Project</h2>

      <form @submit="updateProject">
        <label>
          Project Name:
          <input v-model="projectName" type="text" required />
        </label>

        <h3>Project Members</h3>
        <ul>
          <li v-for="member in projectMembers" :key="member.id">
            {{ member.name }}
            <button @click="removeMember(member.id)">Remove</button>
          </li>
        </ul>

        <h3>Add Member</h3>
        <select v-model="selectedMember">
          <option v-for="user in availableUsers" :key="user.id" :value="user.id">
            {{ user.name }}
          </option>
        </select>
        <button @click="addMember">Add</button>

        <button type="submit">Update Project</button>
      </form>
    </div>
  </CardBox>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import CardBox from '@/components/CardBox.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { useProjectStore } from '@/stores/project'
import { useAuthStore } from '@/stores/auth'

const projectStore = useProjectStore()
const authStore = useAuthStore()

const projectId = // Get the project ID from the route or props
const project = computed(() => projectStore.getProjectById(projectId))

const projectName = ref(project.value.name)
const projectMembers = computed(() => {
  const currentUser = authStore.userDetail.id
  return project.value.members.filter(memberId => memberId !== currentUser)
})

const availableUsers = computed(() => {
  const currentUser = authStore.userDetail.id
  return authStore.users.filter(user => user.id !== currentUser && !project.value.members.includes(user.id))
})

const selectedMember = ref('')

const updateProject = () => {
  project.value.name = projectName.value
  projectStore.updateProject(project.value)
}

const addMember = () => {
  if (selectedMember.value) {
    project.value.members.push(selectedMember.value)
    selectedMember.value = ''
  }
}

const removeMember = (memberId) => {
  project.value.members = project.value.members.filter(member => member !== memberId)
}

onMounted(() => {
  // Fetch necessary data or perform any initialization here
})
</script>
