
import { sendFrontendMessage } from '../ipc/manager'
import { DMQueueElement, DownloadManagerState, GameStatus } from './type'

export function updateFrontendQueue(
  queue: DMQueueElement[],
  state: DownloadManagerState,
  finished?: DMQueueElement[] | null,
) {
  sendFrontendMessage('changedDMQueueInformation', queue, finished || [], state)
}

export function updateGameStatus(payload: GameStatus) {
  sendFrontendMessage('gameStatusUpdate', payload)
}
