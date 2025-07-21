import { useAuthStore } from '@/stores/auth/useAuthStore'
import { UserInfo } from '@/types/type'
import { onMounted } from 'vue'

export function useUseFromIpc() {
  onMounted( async() => {
    const user = await window.api.getUser()
    if (user && user.displayName) {
      useAuthStore().setUser(user as UserInfo)
    } else {
      console.warn('No user information found or user is not logged in')
    }
 
  })
}
