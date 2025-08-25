import { generateDeviceInfo } from '@/utils/fingerprint'
import { SteakApi } from '..'
import { useAuthStore } from '@/stores/auth/useAuthStore'
const AuthStore = useAuthStore()
export const getMyLibrary = (signal?: AbortSignal) => {
  return SteakApi.get('/store/private/library/my-games', { signal: signal })
}

export const getGameInfo = (gameId: string, signal?: AbortSignal) => {
  return SteakApi.get(`/store/public/games/details?gameId=${gameId}`, { signal: signal })
}

export const getGameDownloadInfo = (gameId: string, signal?: AbortSignal) => {
  return SteakApi.get(`/store/public/games/download/${gameId}`, { signal: signal })
}

export const renewUserRefreshToken = async () => {
  return await SteakApi.post('/user/auth/refresh', {
    deviceId: AuthStore.user?.deviceId,
    deviceInfo: await generateDeviceInfo(),
  })
}
