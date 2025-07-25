import { GameStatus, DMQueueElement, DownloadManagerState, InstallProgress } from '@/types/type'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDownloadStore = defineStore('download', () => {
  const gameStatus = ref<GameStatus>({ appName: '', status: 'queued' })

  const setGameStatus = (status: GameStatus) => {
    gameStatus.value = status
  }
  const getGameStatus = () => {
    return gameStatus.value
  }
  const setProgress = (progress: InstallProgress) => {
    if (gameStatus.value.appName) {
      gameStatus.value.progress = progress
    } else {
      console.warn('Game status not set, cannot update progress')
    }
  }

  const getProgress = () => {
    if (gameStatus.value.progress) {
      return gameStatus.value.progress
    } else {
      console.warn('No progress available for the current game status')
      return null
    }
  }
  return {
    setProgress,
    getProgress,
    setGameStatus,
    getGameStatus,
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

    const exists = elements.value.some((e) => e.params.appName === element.params.appName)
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
