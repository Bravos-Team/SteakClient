import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    username: '' as string
  }),
  actions: {
    setUsername(newUsername: string) {
      this.username = newUsername
    }
  }
})