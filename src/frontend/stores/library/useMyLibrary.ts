import { getGameDownloadInfo, getGameInfo, getMyLibrary } from '@/apis/library/library'
import { GameLibrary } from '@/types/type'
import { useQuery } from '@tanstack/vue-query'
import { Ref } from 'vue'

export const useGetLibraryList = () => {
  return useQuery({
    queryKey: ['library', 'my-games', 'list'] as const,
    queryFn: async ({ signal }) => await getMyLibrary(signal),
    retry: 3,
  })
}

export const useGetGameInfo = (gameId: Ref<string> | string) => {
  return useQuery({
    queryKey: ['library', 'game-info', gameId] as const,
    queryFn: async ({ signal }) => await getGameInfo(typeof gameId === 'string' ? gameId : gameId.value, signal),
    retry: 3,
    select: (res) => res.data,
    enabled: !!gameId,
  })
}
export const useGetGameDownloadInfo = (gameId: Ref<string> | string) => {
  return useQuery({
    queryKey: ['library', 'game-download-info', gameId] as const,
    queryFn: async ({ signal }) => await getGameDownloadInfo(typeof gameId === 'string' ? gameId : gameId.value, signal),
    retry: 3,
    select: (res) => res.data,
    enabled: !!gameId,
  })
}
