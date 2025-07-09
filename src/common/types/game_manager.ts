import { GameInfo, GameStatus, InstallParams } from './type'

export interface InstallResult {
  status: 'done' | 'error' | 'aborted'
  error?: string
}

export interface GameManager {
  install: (appName: string, params: InstallParams) => Promise<InstallResult>
  uninstall: (appName: string) => Promise<void>
  update: (appName: string, params?: InstallParams) => Promise<InstallResult>
  getGameInfo: (appName: string) => GameInfo | null
  getGameInfoByFolder: (folderName: string) => GameInfo | null
  getInstalledGames: () => GameInfo[]
  getGameStatus: (appName: string) => GameStatus | null
}

export interface LibraryManager {
  refresh: () => Promise<void>
  getGameInfo: (appName: string) => GameInfo | null
  changeGameInstallPath: (appName: string, newPath: string) => Promise<void>
}


