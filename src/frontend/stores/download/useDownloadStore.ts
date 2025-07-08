
import { GameStatus ,DMQueueElement, DownloadManagerState } from '@/types/type'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDownloadStore = defineStore('download', {
  state: () => ({
    statuses: {} as Record<string, GameStatus>,
  }),
  actions: {
    updateGameStatus(payload: GameStatus) {
      this.statuses[payload.appName] = payload
    },
  },
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
    const exists = elements.value.some((e) => e.params.appName === element.params.appName)
    if (!exists) elements.value.push(element)
  }

  const updateAll = (
   patload: { elements: DMQueueElement[], finished: DMQueueElement[], state: DownloadManagerState }
  ) => {
    if (patload.elements) {
      setQueue(patload.elements)
    }
    if (patload.finished) {
      setFinished(patload.finished)
    }
    if (patload.state) {
      setState(patload.state)
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
