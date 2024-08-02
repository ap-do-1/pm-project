import { defineStore } from 'pinia'
import { useApiPrivate } from '../services/useApi'
import { Project, ProjectData, BoardData } from '@/stores/types'
import { useAuthStore } from './auth'

export interface State {
  projects: Project[]
}

export const useProjectStore = defineStore('project', {
  state: (): State => ({
    projects: []
  }),

  getters: {
    getProjects: (state) => state.projects,
    getProjectById: (state) => (id: string) => state.projects.find((project) => project._id === id)
  },

  actions: {
    async fetchProject(projectId: string) {
      //console.log(projectId)
      try {
        const response = await useApiPrivate().get(`/api/project/projects/${projectId}`)
        const project = response.data
        return project
      } catch (error) {
        console.error('Error fetching project:', error)
        throw error
      }
    },

    async fetchProjects() {
      try {
        const response = await useApiPrivate().get('/api/project/projects')
        const projects = response.data
        this.$patch({ projects }) // update the state
        return projects
      } catch (error) {
        console.error('Error fetching projects:', error)
        throw error
      }
    },

    async fetchUserProjects(userId: string) {
      try {
        const response = await useApiPrivate().get(`/api/project/projects/user/${userId}`)
        const projects = response.data
        this.$patch({ projects }) // update the state
        return projects
      } catch (error) {
        console.error('Failed to fetch user projects:', error)
        throw error
      }
    },

    async fetchMemberProjects() {
      try {
        const authStore = useAuthStore()
        const userId = authStore.userDetail.id
        const response = await useApiPrivate().get(`/api/project/projects/member/${userId}`)
        this.projects = response.data
        return this.projects
      } catch (error) {
        const authStore = useAuthStore()
        const userId = authStore.userDetail.id
        console.error(`Error fetching projects for member ${userId}:`, error)
        throw error
      }
    },

    async fetchProjectById(id: string) {
      try {
        const response = await useApiPrivate().get(`/api/project/projects/${id}`)
        return response.data
      } catch (error) {
        console.error('Error fetching project by ID:', error)
        throw error
      }
    },

    async createProject(projectData: ProjectData) {
      try {
        const response = await useApiPrivate().post('/api/project/projects', projectData)
        const project = response.data
        this.projects.push(project) // Add the project to the store's state
        return project
      } catch (error) {
        console.error('Error creating project:', error)
        throw error
      }
    },

    async updateProject(id: string, projectData: ProjectData) {
      try {
        const response = await useApiPrivate().put(`/api/project/projects/${id}`, projectData)
        const updatedProject = response.data
        const index = this.projects.findIndex((project) => project._id === id)
        if (index !== -1) {
          this.projects.splice(index, 1, updatedProject)
        }
        return updatedProject
      } catch (error) {
        console.error('Error updating project:', error)
        throw error
      }
    },

    async fetchProjectsCloseDueDates() {
      try {
        const response = await useApiPrivate().get('/api/project/projects/closeDueDates')
        this.projects = response.data
        return this.projects
      } catch (error) {
        console.error('Error fetching projects close to due dates:', error)
        // Handle the error response appropriately
        if (error) {
          console.error('Error details:', error)
        }
        throw error
      }
    },

    async deleteProject(id: string) {
      try {
        await useApiPrivate().delete(`/api/project/projects/${id}`)
        const index = this.projects.findIndex((project) => project._id === id)
        if (index !== -1) {
          this.projects.splice(index, 1)
        }
      } catch (error) {
        console.error('Error deleting project:', error)
        throw error
      }
    },

    async addBoard(projectId: string, boardData: BoardData) {
      try {
        const response = await useApiPrivate().post(
          `/api/project/projects/${projectId}/boards`,
          boardData
        )
        const project = response.data
        const index = this.projects.findIndex((project) => project._id === projectId)
        if (index !== -1) {
          this.projects.splice(index, 1, project)
        }
        return project
      } catch (error) {
        console.error('Error adding board to project:', error)
        throw error
      }
    },

    async removeBoard(projectId: string, boardId: string) {
      try {
        await useApiPrivate().delete(`/api/project/projects/${projectId}/boards/${boardId}`)
        const index = this.projects.findIndex((project) => project._id === projectId)
        if (index !== -1) {
          this.projects.splice(index, 1)
        }
      } catch (error) {
        console.error('Error removing board from project:', error)
        throw error
      }
    },

    async addMember(projectId: string, memberId: string) {
      try {
        const response = await useApiPrivate().post(
          `/api/project/projects/${projectId}/members/${memberId}`
        )
        const project = response.data
        const index = this.projects.findIndex((project) => project._id === projectId)
        if (index !== -1) {
          this.projects.splice(index, 1, project)
        }
        return project
      } catch (error) {
        console.error('Error adding member to project:', error)
        throw error
      }
    },

    async removeMember(projectId: string, memberId: string) {
      try {
        await useApiPrivate().delete(`/api/project/projects/${projectId}/members/${memberId}`)
        const index = this.projects.findIndex((project) => project._id === projectId)
        if (index !== -1) {
          this.projects.splice(index, 1)
        }
      } catch (error) {
        console.error('Error removing member from project:', error)
        throw error
      }
    },

    addProject(project: Project) {
      this.projects.push(project)
    }
  }
})

// Export store
export type ProjectStore = ReturnType<typeof useProjectStore>

// Export default store
export default useProjectStore
