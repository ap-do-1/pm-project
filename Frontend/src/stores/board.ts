import { defineStore } from 'pinia'
import { useApi } from '../services/useApi'
import { Board, BoardData, TaskData } from '@/stores/types'

export interface State {
  boards: Board[]
}

export const useBoardStore = defineStore('board', {
  state: (): State => ({
    boards: []
  }),

  getters: {
    getBoards: (state) => state.boards,
    getBoardById: (state) => (id: string) => state.boards.find((board) => board._id === id),
    getBoardsByProjectId: (state) => (projectId: string) =>
      state.boards.filter((board) => board.project._id === projectId)
  },

  actions: {
    async fetchBoards() {
      try {
        const response = await useApi().get('/api/board/boards')
        this.boards = response.data
        return this.boards
      } catch (error) {
        console.error('Error fetching boards:', error)
        throw error
      }
    },

    async fetchBoardById(id: string) {
      try {
        const response = await useApi().get(`/api/board/boards/${id}`)
        return response.data
      } catch (error) {
        console.error('Error fetching board by ID:', error)
        throw error
      }
    },

    async createBoard(boardData: BoardData) {
      try {
        const response = await useApi().post('/api/board/boards', boardData)
        const board = response.data
        this.boards.push(board)
        return board
      } catch (error) {
        console.error('Error creating board:', error)
        throw error
      }
    },

    async updateBoard(id: string, boardData: BoardData) {
      try {
        const response = await useApi().put(`/api/board/boards/${id}`, boardData)
        const updatedBoard = response.data
        const index = this.boards.findIndex((board) => board._id === id)
        if (index !== -1) {
          this.boards.splice(index, 1, updatedBoard)
        }
        return updatedBoard
      } catch (error) {
        console.error('Error updating board:', error)
        throw error
      }
    },

    async deleteBoard(id: string) {
      try {
        await useApi().delete(`/api/board/boards/${id}`)
        const index = this.boards.findIndex((board) => board._id === id)
        if (index !== -1) {
          this.boards.splice(index, 1)
        }
      } catch (error) {
        console.error('Error deleting board:', error)
        throw error
      }
    },

    async createTask(boardId: string, taskData: TaskData) {
      try {
        const response = await useApi().post(`/api/board/boards/${boardId}/tasks`, taskData)
        const task = response.data
        const boardIndex = this.boards.findIndex((board) => board._id === boardId)
        if (boardIndex !== -1) {
          this.boards[boardIndex].lanes[0].tasks.push(task)
        }
        return task
      } catch (error) {
        console.error('Error creating task:', error)
        throw error
      }
    },

    async updateTask(boardId: string, taskId: string, taskData: TaskData) {
      try {
        const response = await useApi().put(
          `/api/board/boards/${boardId}/tasks/${taskId}`,
          taskData
        )
        const updatedTask = response.data
        const boardIndex = this.boards.findIndex((board) => board._id === boardId)
        if (boardIndex !== -1) {
          const taskIndex = this.boards[boardIndex].lanes[0].tasks.findIndex(
            (task) => task._id === taskId
          )
          if (taskIndex !== -1) {
            this.boards[boardIndex].lanes[0].tasks.splice(taskIndex, 1, updatedTask)
          }
        }
        return updatedTask
      } catch (error) {
        console.error('Error updating task:', error)
        throw error
      }
    },

    async deleteTask(boardId: string, taskId: string) {
      try {
        await useApi().delete(`/api/board/boards/${boardId}/tasks/${taskId}`)
        const boardIndex = this.boards.findIndex((board) => board._id === boardId)
        if (boardIndex !== -1) {
          const taskIndex = this.boards[boardIndex].lanes[0].tasks.findIndex(
            (task) => task._id === taskId
          )
          if (taskIndex !== -1) {
            this.boards[boardIndex].lanes[0].tasks.splice(taskIndex, 1)
          }
        }
      } catch (error) {
        console.error('Error deleting task:', error)
        throw error
      }
    }
  }
})

// Export store
export type BoardStore = ReturnType<typeof useBoardStore>

// Export default store
export default useBoardStore
