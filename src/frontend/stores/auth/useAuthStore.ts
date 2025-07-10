import { UserInfo } from '@/types/type'
import { defineStore } from 'pinia'


import { ref } from 'vue'

export const useAuthStore = defineStore('user', () => {
  const user = ref<UserInfo | null>(null)

  const setUser = (data: UserInfo) => {
    console.log('setUser called with data:', data);
    
    user.value = data
  }

  const clearUser = () => {
    user.value = null
  }
  const isAuthenticated = () => {
    return user.value !== null
  }
  const getUser = () => {
    console.log('getUser called');
    
    return user.value
  }
  return { user, setUser, clearUser, isAuthenticated, getUser }
})
