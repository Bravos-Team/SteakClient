import { useAuthStore } from '@/stores/auth/useAuthStore'
import { UserInfo } from '@/types/type'
import { onMounted } from 'vue'

export function useUseFromIpc() {
  onMounted(() => {
    window.api.sendUserInfo((_: any, user: UserInfo) => {
      useAuthStore().setUser(user)
    })
  })
}
