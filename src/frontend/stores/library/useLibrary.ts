import { GameLibrary } from '@/types/type'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLibraryStore = defineStore('library', () => {
  const library = ref<GameLibrary[]>([])

  const addGame = (game: GameLibrary) => {
    if (!library.value.some((g) => g.gameId === game.gameId)) {
      library.value.push(game)
    } else {
      console.warn(`Game ${game.gameId} already exists in the library`)
    }
  }

  const removeGame = (gameId: string) => {
    library.value = library.value.filter((game) => game.gameId !== gameId)
  }

  const setLibrary = (newLibrary: GameLibrary[]) => {
    library.value = newLibrary
  }
  const getLibrary = () => {
    return library.value
  }

  return {
    addGame,
    removeGame,
    getLibrary,
    setLibrary,
  }
})
