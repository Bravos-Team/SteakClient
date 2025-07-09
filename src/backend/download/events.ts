import { sendFrontendMessage } from '../ipc'
import { DMQueueElement, DownloadManagerState, GameStatus } from 'src/common/types/type'

export function updateFrontendQueue(
  queue: DMQueueElement[],
  state: DownloadManagerState,
  finished?: DMQueueElement[] | null,
) {
    console.log( finished );
    
  sendFrontendMessage('changedDMQueueInformation', queue, finished || [], state)
}

export function updateGameStatus(payload: GameStatus) {
  sendFrontendMessage('gameStatusUpdate', payload)
}
