import { SteakApi } from '..'

export const getMyLibrary = (signal?: AbortSignal) => {
  return SteakApi.get('/store/private/library/my-games', { signal: signal })
}

export const getGameInfo = (gameId: string, signal?: AbortSignal) => {
  return SteakApi.get(`/store/public/games/details?gameId=${gameId}`, { signal: signal })
}