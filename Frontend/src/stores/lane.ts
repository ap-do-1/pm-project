import { defineStore } from 'pinia'
import { useApiPrivate } from '../services/useApi'
import { Lane, Task } from '@/stores/types'

export interface State {
  lanes: Lane[]
}

export const useLaneStore = defineStore('lane', {
  state: (): State => ({
    lanes: []
  }),

  getters: {
    getLanes: (state) => state.lanes,
    getLaneById: (state) => (id: string) => state.lanes.find((lane) => lane._id === id)
  },

  actions: {
    async getAllLanes() {
      try {
        const response = await useApiPrivate().get(`/api/lane/lanes`)
        this.lanes = response.data
      } catch (error) {
        console.error('Error fetching lanes:', error)
        throw error
      }
    },

    async getLaneById(id: string) {
      try {
        const response = await useApiPrivate().get(`/api/lane/lanes/${id}`)
        return response.data
      } catch (error) {
        console.error('Error fetching lane:', error)
        throw error
      }
    },

    async createLane(name: string, board: string) {
      try {
        const response = await useApiPrivate().post('/api/lane/lanes', { name, board })
        const lane = response.data
        this.lanes.push(lane)
        return lane
      } catch (error) {
        console.error('Error creating lane:', error)
        throw error
      }
    },

    async updateLane(id: string, name: string) {
      try {
        const response = await useApiPrivate().put(`/api/lane/lanes/${id}`, { name })
        const updatedLane = response.data
        const index = this.lanes.findIndex((lane) => lane._id === id)
        if (index !== -1) {
          this.lanes.splice(index, 1, updatedLane)
        }
        return updatedLane
      } catch (error) {
        console.error('Error updating lane:', error)
        throw error
      }
    },

    async deleteLane(id: string) {
      try {
        await useApiPrivate().delete(`/api/lane/lanes/${id}`)
        const index = this.lanes.findIndex((lane) => lane._id === id)
        if (index !== -1) {
          this.lanes.splice(index, 1)
        }
      } catch (error) {
        console.error('Error deleting lane:', error)
        throw error
      }
    },

    async addTask(laneId: string, taskId: string) {
      try {
        await useApiPrivate().post(`/api/lane/lanes/${laneId}/tasks`, { taskId })
      } catch (error) {
        console.error('Error adding task to lane:', error)
        throw error
      }
    },

    async removeTask(laneId: string, taskId: string) {
      try {
        await useApiPrivate().delete(`/api/lane/lanes/${laneId}/tasks/${taskId}`)
      } catch (error) {
        console.error('Error removing task from lane:', error)
        throw error
      }
    },

    addLane(lane: Lane) {
      this.lanes.push(lane)
    }
  }
})

// Export store
export type LaneStore = ReturnType<typeof useLaneStore>

// Export default store
export default useLaneStore
