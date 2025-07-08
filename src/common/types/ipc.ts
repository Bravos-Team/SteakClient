import { DMQueueElement, DownloadManagerState, GameStatus, InstallParams } from "./type"



interface SyncIPCFunctions {
  openDialog: () => Promise<string[] | null>
}

interface AsyncIPCFunctions {
  openDialog: () => Promise<string[] | null>
  install: (args: InstallParams) => Promise<void>
  pausedDownload: (appName: string) => Promise<void>
  resumeDownload: () => Promise<void>
  cancelDownload: (appName: string) => Promise<void>
  getDMQueueInformation: () => {
    queue: DMQueueElement[]
    finished: DMQueueElement[]
    state: DownloadManagerState
  }
  openFolder: (path: string) => Promise<string | null>
  openFile: (path: string) => Promise<string | null>
}
interface FrontendMessages {
  changedDMQueueInformation: (elements: DMQueueElement[], state: DownloadManagerState) => void
  gameStatusUpdate: (status: GameStatus) => void
  
}

export type { SyncIPCFunctions, AsyncIPCFunctions , FrontendMessages };
