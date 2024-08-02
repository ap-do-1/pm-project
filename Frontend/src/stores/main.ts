import { defineStore } from 'pinia'
import { useApi } from '../services/useApi'

export const useMainStore = defineStore('main', {
  state: () => ({
    userName: null,
    userEmail: null,
    userAvatar: null,

    isFieldFocusRegistered: false
  }),
  actions: {
    setUser(payload) {
      if (payload.name) {
        this.userName = payload.name
      }
      if (payload.email) {
        this.userEmail = payload.email
      }
      if (payload.avatar) {
        this.userAvatar = payload.avatar
      }
    }
  }
})
