<script setup>
import { ref, onMounted } from 'vue'
import draggable from 'vuedraggable'
import Task from './Task.vue'
import CardBox from '@/components/CardBox.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import CardBoxModal from '@/components/CardBoxModal.vue'
import { mdiPlus } from '@mdi/js'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import { useTaskStore } from '@/stores/task.ts'
import { useRoute } from 'vue-router'

const route = useRoute()
const taskStore = useTaskStore()

//get boardid from route
const boardId = route.params.id

const lanes = ref([
  {
    id: 1,
    name: 'To Do',
    tasks: []
  },
  {
    id: 2,
    name: 'In Progress',
    tasks: []
  },
  {
    id: 3,
    name: 'Done',
    tasks: []
  }
])

const dragOptions = {
  animation: 200,
  disabled: false,
  ghostClass: 'ghost'
}

const selectOptions = [
  { id: 1, label: 'Low Level' },
  { id: 2, label: 'Medium Level' },
  { id: 3, label: 'High Level' }
]

const currentDate = new Date()
const formattedDate = `${('0' + currentDate.getDate()).slice(-2)}-${('0' + (currentDate.getMonth() + 1)).slice(-2)}-${currentDate.getFullYear()}`

// Initialize newTask with default values
const newTask = ref({
  title: '',
  description: '',
  created_at: `${('0' + new Date().getDate()).slice(-2)}-${('0' + (new Date().getMonth() + 1)).slice(-2)}-${new Date().getFullYear()}`,
  level: 'Low Level'
})

let showModal = ref(false)
let currentLane = ref(null)

const openModal = (lane) => {
  showModal.value = true
  currentLane.value = lane
}

const addTask = async () => {
  if (newTask.value.title !== '') {
    const taskData = {
      boardId: boardId,
      laneId: currentLane.value.id, // Set the default laneId to 1
      name: newTask.value.title,
      description: newTask.value.description
    }
    
    try {
      await taskStore.createTaskwithBoardId(taskData, boardId)
      currentLane.value.tasks.push({ ...newTask.value })
      newTask.value = {
        title: newTask.value.title,
        description: newTask.value.description,
        created_at: `${('0' + new Date().getDate()).slice(-2)}-${('0' + (new Date().getMonth() + 1)).slice(-2)}-${new Date().getFullYear()}`,
        level: 'Low Level'
      }
      showModal.value = false
    } catch (error) {
      console.error('Error adding task:', error)
      // Handle error if needed
    }
  }
}

// Fetch tasks from boardId and update the lanes
const fetchTasksAndPopulateLanes = async () => {
  const tasks = await taskStore.getTasksfromBoardId(boardId)
  console.log(tasks)
  lanes.value.forEach((lane) => {
    lane.tasks = tasks.filter((task) => task.laneId === lane.id)
  })
}

// Call the fetchTasksAndPopulateLanes function when the component is mounted
onMounted(fetchTasksAndPopulateLanes)

</script>

<template>
  <div class="grid grid-cols-3 gap-6">
    <CardBox
      v-for="lane in lanes"
      :key="lane.name"
      class="border border-gray-300 rounded-md bg-gray-50"
    >
      <div class="border-b border-gray-300 p-4 rounded-t-md flex items-center justify-between">
        <div class="text-lg font-semibold">
          {{ lane.name }}
        </div>

        <div class="flex items-center space-x-4">
          <BaseButton
            :onClick="() => openModal(lane)"
            :icon="mdiPlus"
            label="Add Task"
            color="contrast"
            rounded-full
            small
          />
          <span class="block py-1 px-3 bg-gray-400 rounded-xl text-sm font-semibold">
            {{ lane.tasks.length }}
          </span>
        </div>
      </div>

      <div class="p-4 h-full">
        <draggable
          class="min-h-full"
          :list="lane.tasks"
          group="tasks"
          itemKey="name"
          v-bind="dragOptions"
        >
          <template #item="{ element }">
            <Task :task="element" />
          </template>
        </draggable>
      </div>
    </CardBox>
    <CardBoxModal
      :modelValue="showModal"
      title="Add Task"
      @update:modelValue="showModal = $event"
      @confirm="addTask"
      :buttonLabel="buttonLabel"
      hasCancel
    >
      <FormField label="Grouped with icons">
        <FormControl v-model="newTask.title" :icon="mdiAccount" placeholder="Task title" />
        <FormControl v-model="newTask.description" placeholder="Task description" :icon="mdiMail" />
      </FormField>
      <FormField label="Dropdown">
        <FormControl v-model="newTask.level" :options="selectOptions" />
      </FormField>

      <template #footer>
        <BaseButtons>
          <BaseButton label="Add" color="contrast" @click="addTask" />
          <BaseButton label="Cancel" color="contrast" outline @click="cancel" />
        </BaseButtons>
      </template>
    </CardBoxModal>
  </div>
</template>
