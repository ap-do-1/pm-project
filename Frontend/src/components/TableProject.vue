<template>
  <CardBox class="mb-6" has-table>
    <table>
      <thead>
        <tr>
          <th v-if="checkable" />
          <th />
          <th>Name</th>
          <th>Description</th>
          <th>Deadline</th>
          <th>Status</th>
          <th>Priority</th>
          <th>Created</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="project in projectsPaginated" :key="project._id">
          <TableCheckboxCell v-if="checkable" @checked="checked($event, project)" />
          <td class="border-b-0 lg:w-6 before:hidden">
            <UserAvatar :username="project.name" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" />
          </td>
          <td data-label="Name">
            {{ project.name }}
          </td>
          <td data-label="Description">
            {{ project.description }}
          </td>
          <td data-label="Deadline">
            {{ formatDate(project.deadline) }}
          </td>
          <td data-label="Status" class="lg:w-32">
            <small class="flex w-2/5 self-center lg:w-full" :value="project.status">
              <span
                v-if="project.status === 'in progress'"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                In progress
              </span>
              <span
                v-else-if="project.status === 'closed'"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
              >
                Closed
              </span>
              <span
                v-else-if="project.status === 'open'"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
              >
                Open
              </span>
              <span
                v-else-if="project.status === 'new'"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                New
              </span>
            </small>
          </td>
          <td data-label="Status" class="lg:w-32">
            <small class="flex w-2/5 self-center lg:w-full" :value="project.priority">
              <span
                v-if="project.priority === 'low'"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                Low
              </span>
              <span
                v-else-if="project.priority === 'medium'"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
              >
                Medium
              </span>
              <span
                v-else-if="project.priority === 'high'"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
              >
                High
              </span>
            </small>
          </td>

          <td data-label="Created" class="lg:w-1 whitespace-nowrap">
            <small class="text-gray-500 dark:text-slate-400" :title="project.created_at">
              {{ formatDate(project.created_at) }}
            </small>
          </td>
          <td class="before:hidden lg:w-1 whitespace-nowrap">
            <BaseButtons>
              <BaseButton
                v-if="project?._id"
                :to="`/KanbanBoard/${project._id}`"
                :icon="mdiEye"
                label="View"
                color="info"
                rounded-full
                small
              />

              <BaseButton
                v-if="project?._id"
                :to="`/EditProject/${project._id}`"
                :icon="mdiMonitorCellphone"
                label="Edit"
                color="primary"
                rounded-full
                small
              />
              <BaseButton
                v-if="project?._id"
                :onClick="() => deleteProject(project)"
                :icon="mdiTrashCan"
                label="Delete"
                color="danger"
                @click="isModalDangerActive = true"
                rounded-full
                small
              />
            </BaseButtons>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
      <BaseLevel>
        <BaseButtons>
          <BaseButton
            v-for="page in pagesList"
            :key="page"
            :active="page === currentPage"
            :label="page + 1"
            :color="page === currentPage ? 'lightDark' : 'whiteDark'"
            small
            @click="goToPage(page)"
          />
        </BaseButtons>
        <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
      </BaseLevel>
    </div>
  </CardBox>
</template>

<script setup>
import { computed, ref, defineProps } from 'vue'
import { mdiMonitorCellphone, mdiTrashCan, mdiEye } from '@mdi/js'
import TableCheckboxCell from '@/components/TableCheckboxCell.vue'

import BaseLevel from '@/components/BaseLevel.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { useProjectStore } from '@/stores/project'
import { useAuthStore } from '@/stores/auth'
import CardBox from '@/components/CardBox.vue'

defineProps({
  checkable: Boolean,
  projects: {
    type: Array,
    required: true
  }
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const isModalDangerActive = ref(false)

const projectStore = useProjectStore()
const authStore = useAuthStore()

const perPage = ref(5)
const currentPage = ref(0)
const checkedRows = ref([])

const numPages = computed(() => Math.ceil(projects.value.length / perPage.value))

const currentPageHuman = computed(() => currentPage.value + 1)

const pagesList = computed(() => {
  const pagesList = []

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i)
  }

  return pagesList
})

const remove = (arr, cb) => {
  const newArr = []

  arr.forEach((item) => {
    if (!cb(item)) {
      newArr.push(item)
    }
  })

  return newArr
}

const checked = (isChecked, project) => {
  if (isChecked) {
    checkedRows.value.push(project)
  } else {
    checkedRows.value = remove(checkedRows.value, (row) => row._id === project._id)
  }
}

const deleteProject = (project) => {
  projectStore.deleteProject(project._id)
}

const projects = computed(() => {
  const currentUser = authStore.userDetail._id
  console.log(currentUser)

  const filteredProjects = projectStore.getProjects
  console.log('All Projects: ', filteredProjects)

  const filteredProjectsByUser = filteredProjects.filter(
    (project) => project.createdBy === currentUser
  )
  console.log('Projects Created by User: ', filteredProjectsByUser)

  const filteredProjectsByMember = filteredProjects.filter((project) =>
    project.members.includes(currentUser)
  )
  console.log('Projects with User as Member: ', filteredProjectsByMember)

  const allProjects = [...filteredProjectsByUser, ...filteredProjectsByMember]
  console.log("All User's Projects: ", allProjects)

  return allProjects || []
})

const projectsPaginated = computed(() => {
  console.log(currentPage.value, perPage.value)

  const from = currentPage.value * perPage.value
  const to = (currentPage.value + 1) * perPage.value

  return projects.value.slice(from, to) || []
})

const goToPage = (page) => {
  currentPage.value = page
}
</script>
