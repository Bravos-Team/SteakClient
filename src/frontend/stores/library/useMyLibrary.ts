import { getMyLibrary } from '@/apis/library/library'
import { GameLibrary } from '@/types/type'
import { useQuery } from '@tanstack/vue-query'

export const useGetLibraryList = () => {
  return useQuery({
    queryKey: ['library', 'my-games', 'list'] as const,
    queryFn: async ({ signal }) => await getMyLibrary(signal),
    retry: 3,
  })
}
