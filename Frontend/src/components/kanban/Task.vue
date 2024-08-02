<script setup>
import { defineProps, reactive } from 'vue'
import { useTaskStore } from '@/stores/task'
import BaseButton from '@/components/BaseButton.vue'
import { mdiDeleteCircleOutline } from '@mdi/js'

const taskStore = useTaskStore()

const props = defineProps({
  task: Object
})

const deleteTask = async (lane, task) => {
  if (!task._id) {
    console.error('Invalid task ID:', task._id)
    return
  }

  try {
    await taskStore.deleteTask(task._id)

    if (lane.tasks && Array.isArray(lane.tasks)) {
      const taskIndex = lane.tasks.findIndex((t) => t._id === task._id)
      if (taskIndex !== -1) {
        lane.tasks.splice(taskIndex, 1)
        // Trigger component update
        lane = reactive(lane)
      }
    }
  } catch (error) {
    console.error('Error deleting task:', error)
    // Handle error if needed
  }
}
</script>

<template>
  <div
    class="p-4 mb-3 shadow-md border-t border-r border-l border-gray-100 rounded-md flex flex-col-reverse space-y-2 space-y-reverse relative hover:cursor-move"
  >
    <div class="text-gray-400 text">{{ task.description }}, {{ task.author }}</div>
    <div>{{ task.name }}</div>
    <BaseButton
      :icon="mdiDeleteCircleOutline"
      label="Delete"
      color="info"
      rounded-full
      small
      @click="deleteTask(task.lane, task)"
    />
    <div class="text-gray-300 flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
    <div
      v-if="task.level == 'Low Level'"
      class="absolute top-4 right-4 bg-green-100 text-green-700 font-semibold text-sm px-3 rounded-full"
    >
      {{ task.level }}
    </div>
    <div
      v-if="task.level == 'Medium Level'"
      class="absolute top-4 right-4 bg-yellow-100 text-yellow-700 font-semibold text-sm px-3 rounded-full"
    >
      {{ task.level }}
    </div>
    <div
      v-if="task.level == 'High Level'"
      class="absolute top-4 right-4 bg-red-100 text-red-700 font-semibold text-sm px-3 rounded-full"
    >
      {{ task.level }}
    </div>
  </div>
</template>
