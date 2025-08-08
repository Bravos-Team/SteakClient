import { generateDeviceId, generateDeviceInfo } from '@/utils/fingerprint'
import { SteakApi } from '..'

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
    deviceId: await generateDeviceId(),
    deviceInfo: await generateDeviceInfo(),
  })
}
