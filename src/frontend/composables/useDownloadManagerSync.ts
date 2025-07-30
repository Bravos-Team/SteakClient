import { DMQueueElement, DownloadManagerState, GameStatus } from '@/types/type'
import { onMounted, onUnmounted } from 'vue'
import { useDownloadQueueStore, useDownloadStore } from '@/stores/download/useDownloadStore'
const QueueStore = useDownloadQueueStore()
const DownloadStore = useDownloadStore()
export function useDownloadManagerSync() {
  onMounted(() => {
    const handleDMQueueInformation = window.api.handleDMQueueInformation(
      async (
        e: any,
        elements: DMQueueElement[],
        finished: DMQueueElement[],
        state: DownloadManagerState,
      ) => {
        console.log('Received DM queue information:', elements, finished, state);
        
        QueueStore.updateAll({ elements, finished, state })
      },
    )
    const handleGameStatus = window.api.handleGameStatus((e: any, payload: GameStatus) => {
      DownloadStore.setGameStatus(payload)
      console.log('Game status updated:', payload)
      console.log(DownloadStore.getProgress())
    })
    onUnmounted(() => {
      handleDMQueueInformation()
      handleGameStatus()
      console.log('Unmounting useDownloadManagerSync, cleaning up listeners');
      
    })
  })
}
