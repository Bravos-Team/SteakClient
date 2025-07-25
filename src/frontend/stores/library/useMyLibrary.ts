import { getGameDownloadInfo, getGameInfo, getMyLibrary } from '@/apis/library/library'
import { GameLibrary } from '@/types/type'
import { useQuery } from '@tanstack/vue-query'

export const useGetLibraryList = () => {
  return useQuery({
    queryKey: ['library', 'my-games', 'list'] as const,
    queryFn: async ({ signal }) => await getMyLibrary(signal),
    retry: 3,
  })
}

export const useGetGameInfo = (gameId: string, enabled = !!gameId) => {
  return useQuery({
    queryKey: ['library', 'game-info', gameId] as const,
    queryFn: async ({ signal }) => await getGameInfo(gameId, signal),
    retry: 3,
    select: (res) => res.data,
    enabled: enabled,
  })
}
export const useGetGameDownloadInfo = (gameId: string, enabled = !!gameId) => {
  return useQuery({
    queryKey: ['library', 'game-download-info', gameId] as const,
    queryFn: async ({ signal }) => await getGameDownloadInfo(gameId, signal),
    retry: 3,
    select: (res) => res.data,
    enabled: enabled,
  })
}
