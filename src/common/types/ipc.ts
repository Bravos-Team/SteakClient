import { DMQueueElement, DownloadManagerState, GameStatus, InstallParams } from './type'

interface SyncIPCFunctions {
  openDialog: () => Promise<string[] | null>
}

interface AsyncIPCFunctions {
  removeFinished: (appName: string) => Promise<void>
  openDialog: () => Promise<string[] | null>
  install: (args: InstallParams) => Promise<void>
  pausedDownload: (appName: string) => Promise<void>
  resumeDownload: (app_name: string) => Promise<void>
  cancelDownload: (appName: string) => Promise<void>
  getDMQueueInformation: () => {
    elements: DMQueueElement[]
    finished: DMQueueElement[]
    state: DownloadManagerState
  }
  openFolder: (path: string) => Promise<string | null>
  openFile: (path: string) => Promise<string | null>
}
interface FrontendMessages {
  changedDMQueueInformation: (
    elements: DMQueueElement[],
    finished: DMQueueElement[],
    state: DownloadManagerState,
  ) => void
  gameStatusUpdate: (status: GameStatus) => void
}

export type { SyncIPCFunctions, AsyncIPCFunctions, FrontendMessages }
