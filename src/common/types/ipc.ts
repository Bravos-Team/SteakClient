import { DMQueueElement, DownloadManagerState, GameStatus, InstallParams, UserInfo } from './type'

interface SyncIPCFunctions {
  openDialog: () => string[] | null
  openLoginWindow: () => void
}

interface AsyncIPCFunctions {
  login: (userInfo: UserInfo) => Promise<void>
  removeFinished: (appName: string) => Promise<void>
  openFolder: (path: string) => Promise<string | null>
  openFile: (path: string) => Promise<string | null>
  getHomePath: () => string
  install: (args: InstallParams) => Promise<void>
  pausedDownload: (appName: string) => Promise<void>
  resumeDownload: (app_name: string) => Promise<void>
  cancelDownload: (appName: string) => Promise<void>
  getDMQueueInformation: () => {
    elements: DMQueueElement[]
    finished: DMQueueElement[]
    state: DownloadManagerState
  }
}
interface FrontendMessages {
  sendUserInfo: (userInfo: UserInfo) => void
  changedDMQueueInformation: (
    elements: DMQueueElement[],
    finished: DMQueueElement[],
    state: DownloadManagerState,
  ) => void
  gameStatusUpdate: (status: GameStatus) => void
}

export type { SyncIPCFunctions, AsyncIPCFunctions, FrontendMessages }
