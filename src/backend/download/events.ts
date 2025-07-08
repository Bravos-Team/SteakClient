
import { sendFrontendMessage } from "../ipc";
import { DMQueueElement, DownloadManagerState, GameStatus } from "src/common/types/type";

export function updateFrontendQueue(queue: DMQueueElement[],state : DownloadManagerState) {
    sendFrontendMessage('changedDMQueueInformation', queue, state);
}

export function updateGameStatus(payload : GameStatus) {
    sendFrontendMessage('gameStatusUpdate', payload);
}