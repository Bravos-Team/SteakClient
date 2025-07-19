import { DMQueueElement, DownloadManagerState, GameStatus, InstallParams, UserInfo } from './type'

interface SyncIPCFunctions {
  openDialog: () => string[] | null
  openLoginWindow: () => void
  logout: () => void
  removeFinished: (appName: string) => void
  pausedDownload: (appName: string) => void
  resumeDownload: (app_name: string) => void
  cancelDownload: (appName: string) => void
}

interface AsyncIPCFunctions {
  login: (userInfo: UserInfo) => Promise<void>
  getUser: () => UserInfo
  install: (args: InstallParams) => Promise<void>
  openFolder: (path: string) => Promise<string | null>
  openFile: (path: string) => Promise<string | null>
  getHomePath: () => Promise<string>
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
