import { defineStore } from 'pinia'
import { useApi, useApiPrivate } from '../services/useApi'
import jwtDecode from 'jwt-decode'

const STORAGE_KEY = 'loginData'

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  full_name?: string
  avatar?: string
}

export interface State {
  user: User
  accessToken: string
  authReady: boolean
  //all users
  users: User[]
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  first_name: string
  last_name: string
  password: string
  password_confirm: string
}

export const useAuthStore = defineStore('auth', {
  state: (): State => {
    return {
      user: {} as User,
      accessToken: '',
      authReady: false,
      users: []
    }
  },

  getters: {
    userDetail: (state: State) => state.user,
    isAuthenticated: (state: State) => !!state.accessToken,
    AllUsers: (state: State) => state.users
  },

  actions: {
    //setuser
    async setUser(payload: { name?: string; email?: string; avatar?: string }) {
      if (payload.name) {
        this.user.username = payload.name

        const nameArray = payload.name.split(' ')
        if (nameArray.length > 1) {
          this.user.first_name = nameArray[0]
          this.user.last_name = nameArray[1]
        }
      }
      if (payload.email) {
        this.user.email = payload.email
      }
      if (payload.avatar) {
        this.user.avatar = payload.avatar
      }
    },

    async setAccessToken() {
      const loginData = localStorage.getItem(STORAGE_KEY)
      if (loginData) {
        const { accessToken } = JSON.parse(loginData)
        if (accessToken) {
          this.accessToken = accessToken
        }
      }
    },

    async initialize() {
      const loginData = localStorage.getItem(STORAGE_KEY)
      if (loginData) {
        const { accessToken, user } = JSON.parse(loginData)
        if (accessToken) {
          this.accessToken = accessToken
          this.user = user
          this.authReady = true

          try {
            await this.getUser() // Retrieve the user details
          } catch (error) {
            // Handle error retrieving user details
            console.error('Error retrieving user details:', error)
            // Clear the stored access token and user details
            this.accessToken = ''
            this.user = {} as User
          }
        }
      }

      // Whether or not login data was found, we have attempted to initialize auth.
      this.authReady = true
      return Promise.resolve()
    },

    async attempt() {
      try {
        if (!this.accessToken) {
          await this.initialize()
        }

        if (!this.accessToken) {
          // No access token found, resolve immediately
          return Promise.resolve()
        }

        await this.refresh()
        await this.getUser()
        // Store the access token in local storage
        localStorage.setItem('accessToken', this.accessToken)
      } catch (error) {
        // Handle error
        console.error(error)
        // Clear the stored access token and user details
        this.accessToken = ''
        this.user = {} as User
      }
    },

    async refreshToken() {
      // Send a refresh token request to the server
      // You can use an API endpoint to refresh the token
      const refreshToken = localStorage.getItem('refreshToken')

      try {
        const { data } = await useApi().post('/api/auth/refresh', {
          refresh_token: refreshToken
        })
        return data
      } catch (error) {
        // Token refresh failed, handle the error
        throw new Error('Token refresh failed. Please log in again.')
      }
    },

    decodeTokenExpiration(token) {
      try {
        const decodedToken = jwtDecode(token)
        if (decodedToken && decodedToken.exp) {
          return decodedToken.exp
        }
      } catch (error) {
        console.error('Error decoding token:', error)
      }

      return null
    },

    // Rest of the actions...

    async login(payload: LoginData) {
      try {
        const { data } = await useApi().post('/api/auth/login', payload)
        this.accessToken = data.access_token
        await this.getUser()
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ accessToken: this.accessToken, user: this.user })
        )
        return data
      } catch (error: Error | any) {
        throw error.message
      }
    },

    async register(payload: RegisterData) {
      try {
        const { data } = await useApi().post('/api/auth/register', payload)
        return data
      } catch (error: Error | any) {
        throw error.message
      }
    },

    async getUser() {
      try {
        const { data } = await useApiPrivate().get('/api/auth/user')
        this.user = {
          ...data,
          lastLogin: new Date().toISOString(),
          fullName: `${data.first_name} ${data.last_name}`,
          avatar: `${data.avatar}`,
          role: 'admin',
          permissions: ['admin', 'user']
        }
        return data
      } catch (error: Error | any) {
        throw error.message
      }
    },

    async updateUser(payload: User) {
      try {
        const { data } = await useApiPrivate().put('/api/auth/update', payload)
        const updatedUser = {
          ...data,
          username: payload.username,
          email: payload.email,
          avatar: payload.avatar
        }
        this.user = updatedUser
        return data
      } catch (error: Error | any) {
        throw error.message
      }
    },

    async logout() {
      try {
        const { data } = await useApiPrivate().post('/api/auth/logout')
        this.accessToken = ''
        this.user = {} as User
        this.authReady = false
        localStorage.removeItem(STORAGE_KEY)
        return data
      } catch (error: Error | any) {
        throw error.message
      }
    },

    async refresh() {
      if (!this.accessToken) {
        return Promise.reject(new Error('No access token found.'))
      }

      try {
        const { data } = await useApi().post('/api/auth/refresh')
        this.accessToken = data.access_token
        return data
      } catch (error: Error | any) {
        throw error.message
      }
    }
  }
})

export type AuthStore = ReturnType<typeof useAuthStore>
