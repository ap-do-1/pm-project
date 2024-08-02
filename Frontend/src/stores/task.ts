import { defineStore } from 'pinia'
import { useApiPrivate } from '../services/useApi'
import { Task, TaskData } from '@/stores/types'

export interface Lane {
  boardId: string
  laneId: string
  name: string
  tasks: Task[]
}

export interface State {
  lanes: Lane[]
}

export const useTaskStore = defineStore('task', {
  state: (): State => ({
    lanes: []
  }),

  getters: {
    getLanes: (state) => state.lanes,
    getTasks: (state) => state.lanes.flatMap((lane) => lane.tasks),
    getTaskById: (state) => (id: string) =>
      state.lanes.flatMap((lane) => lane.tasks).find((task) => task._id === id)
    //getTasksByBoardId: (state) => (boardId: string) =>
      //state.lanes.flatMap((lane) => lane.tasks).filter((task) => task.board._id === boardId)
  },

  actions: {
    async getTasksfromBoardId(id: string)
    {
      try {
        const response = await useApiPrivate().get('/api/task/tasks')
        //console.log(response2.data)
        //const response = await useApiPrivate().get('/api/task/tasks/board/646ba860d7fe630ef8146856')
        //console.log(response.data)
        
        this.lanes = response.data.filter((task) => task.boardId === id)
        return this.lanes
      } catch (error) {
        console.error('Error fetching task by ID:', error)
        throw error
      }
    },

    async fetchTasks() {
      try {
        const response = await useApiPrivate().get('/api/task/tasks')
        this.lanes = response.data
        return this.lanes
      } catch (error) {
        console.error('Error fetching tasks:', error)
        throw error
      }
    },

    async fetchTaskById(id: string) {
      try {
        const response = await useApiPrivate().get(`/api/task/tasks/${id}`)
        return response.data
      } catch (error) {
        console.error('Error fetching task by ID:', error)
        throw error
      }
    },

    async createTask(taskData: TaskData) {
      try {
        const response = await useApiPrivate().post('/api/task/tasks', taskData)
        const task = response.data
        return task
      } catch (error) {
        console.error('Error creating task:', error)
        throw error
      }
    },
    
    async createTaskwithBoardId(taskData: TaskData, boardId: string) {
      try {
        const response = await useApiPrivate().post(`/api/task/tasks/${boardId}`, taskData)
        console.log(response.data)
        return response
      } catch (error) {
        console.error('Error creating task:', error)
        throw error
      }
    },

    async updateTask(id: string, taskData: TaskData) {
      try {
        const response = await useApiPrivate().put(`/api/task/tasks/${id}`, taskData)
        const updatedTask = response.data

        // Find the task in any lane and update it
        for (const lane of this.lanes) {
          const taskIndex = lane.tasks.findIndex((task) => task._id === id)
          if (taskIndex !== -1) {
            lane.tasks.splice(taskIndex, 1, updatedTask)
            break
          }
        }

        return updatedTask
      } catch (error) {
        console.error('Error updating task:', error)
        throw error
      }
    },

    async deleteTask(id: string) {
      try {
        await useApiPrivate().delete(`/api/task/tasks/${id}`)

        // Find the task in any lane and remove it
        for (const lane of this.lanes) {
          const taskIndex = lane.tasks.findIndex((task) => task._id === id)
          if (taskIndex !== -1) {
            lane.tasks.splice(taskIndex, 1)
            break
          }
        }
      } catch (error) {
        console.error('Error deleting task:', error)
        throw error
      }
    },

    async updateTaskOrder(id: string, oldLane: string, newLane: string, newIndex: number) {
      try {
        const task = this.getTaskById(id)
        if (task) {
          const oldLaneIndex = this.lanes.findIndex((lane) => lane.name === oldLane)
          const newLaneIndex = this.lanes.findIndex((lane) => lane.name === newLane)

          if (oldLaneIndex !== -1 && newLaneIndex !== -1) {
            const oldTasks = this.lanes[oldLaneIndex].tasks
            const newTasks = this.lanes[newLaneIndex].tasks

            // Remove the task from the old lane
            const taskIndex = oldTasks.findIndex((t) => t._id === id)
            if (taskIndex !== -1) {
              oldTasks.splice(taskIndex, 1)
            }

            // Add the task to the new lane at the specified index
            newTasks.splice(newIndex, 0, task)
          }
        }
      } catch (error) {
        console.error('Error updating task order:', error)
        throw error
      }
    }
  }
})

// Export store
export type TaskStore = ReturnType<typeof useTaskStore>

// Export default store
export default useTaskStore
