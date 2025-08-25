import {
  GameStatus,
  DMQueueElement,
  DownloadManagerState,
  InstallProgress,
  Status,
} from '@/types/type'
import { log } from 'node:console'
import { defineStore } from 'pinia'
import { updateGameStatus } from 'src/backend/download'
import { ref } from 'vue'

export const useGameStatusStore = defineStore('download', () => {
  const gameStatus = ref<GameStatus[]>([{ id: '', status: 'queued' }])

  const setGameStatus = (status: GameStatus[]) => {
    gameStatus.value = status
    console.log('Game status updated:', gameStatus.value)
  }
  const getGameStatus = () => {
    return gameStatus.value
  }
  const setProgress = (id: string, progress: InstallProgress) => {
    const currentGame = gameStatus.value.find((game) => game.id === id)
    if (currentGame) {
      currentGame.progress = progress
    } else {
      console.warn('Game status not set, cannot update progress')
    }
  }
  const addGameStatus = (status: GameStatus) => {
    if (!gameStatus.value.find((game) => game.id === status.id)) {
      gameStatus.value.push(status)
    }
  }
  const updateGameStatus = (id: string, payload: GameStatus) => {
    let currentGame = gameStatus.value.find((game) => game.id.toString() === id) as GameStatus

    if (currentGame) {
      currentGame = payload
      gameStatus.value = gameStatus.value.map((game) =>
        game.id.toString() === id ? currentGame : game,
      )
    }
  }
  const getStatus = (id: string) => {
    const currentGame = gameStatus.value.find((game) => game.id.toString() === id) as GameStatus
    if (currentGame) {
      console.log('Current game status:', currentGame)
      return currentGame.status
    } else {
      console.warn('No status available for the current game')
      return 'unknown'
    }
  }
  const getProgress = (id: string) => {
    const currentGame = gameStatus.value.find((game) => game.id.toString() === id) as GameStatus
    if (currentGame) {
      console.log('Current game progress:', currentGame)

      return currentGame.progress
    } else {
      console.warn('No progress available for the current game status')
      return {
        bytes: '0',
        downSpeed: '0',
        diskWriteSpeed: '0',
        eta: '0',
      } as InstallProgress
    }
  }
  return {
    setProgress,
    getProgress,
    setGameStatus,
    getGameStatus,
    addGameStatus,
    updateGameStatus,
    getStatus,
  }
})

export const useDownloadQueueStore = defineStore('downloadQueue', () => {
  const elements = ref<DMQueueElement[]>([])
  const finished = ref<DMQueueElement[]>([])
  const state = ref<DownloadManagerState>('idle')

  const setQueue = (newElements: DMQueueElement[]) => {
    elements.value = newElements
  }

  const setFinished = (newFinished: DMQueueElement[]) => {
    finished.value = newFinished
  }

  const setState = (newState: DownloadManagerState) => {
    state.value = newState
  }

  const addToQueue = (element: DMQueueElement) => {
    console.log(element)

    const exists = elements.value.some((e) => e.params.id === element.params.id)
    if (!exists) elements.value.push(element)
  }

  const updateAll = (payload: {
    elements: DMQueueElement[]
    finished: DMQueueElement[]
    state: DownloadManagerState
  }) => {
    if (payload.elements) {
      setQueue(payload.elements)
    }
    if (payload.finished) {
      setFinished(payload.finished)
    }
    if (payload.state) {
      console.log('QueueState:', payload.state)
      setState(payload.state)
    }
  }

  return {
    elements,
    finished,
    state,
    setQueue,
    setFinished,
    setState,
    addToQueue,
    updateAll,

    getQueue: () => elements.value,
    getFinished: () => finished.value,
    getState: () => state.value,
    getQueueInformation: () => ({
      elements: elements.value,
      finished: finished.value,
      state: state.value,
    }),
  }
})
