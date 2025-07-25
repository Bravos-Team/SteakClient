import { TitleBarOverlay } from 'electron'
export interface UserInfo {
  displayName: string | null
  avatarUrl: string | null
}
export interface WindowProps extends Electron.Rectangle {
  maximize: boolean
  frame?: boolean
  titleBarStyle?: 'default' | 'hidden' | 'hiddenInset'
  titleBarOverlay: TitleBarOverlay | boolean
}

export interface InstallArgs {
  path: string
  branch?: string
  buildId?: string
}

export interface InstallParams extends InstallArgs {
  appName: string
  gameInfo: GameDetails
  size?: number
  installSize?: number
}

export interface GameDetails {
  details: GameInfo
  publisherName: string
  genres: string[]
  tags: string[]
}
export interface GameInfo {
  id: string
  title: string
  thumbnail: string
  installable?: boolean
  is_installed?: boolean
  developersTeams: string[]
  save_path?: string
  version?: string
  shortDescription: string
  longDescription: string
  systemRequirements: SystemRequirements
  is_offline?: boolean
  languageSupported?: string[]
  platforms?: string[]
  updatedAt?: number
  regions: string[]
}

export interface SystemRequirementEntry {
  osVersion: string
  cpu: string
  memory: string
  gpu: string
  directX: string
  storage: string
}
export interface InstalledInfo {
  executable: string
  install_path: string
  install_size: string
  launch_path?: string
  version?: string
  appName?: string
  branch?: string
  pinnedVersion?: string
}

export type Status =
  | 'queued'
  | 'downloading'
  | 'installing'
  | 'updating'
  | 'uninstalling'
  | 'done'
  | 'error'
  | 'aborted'
  | 'paused'

export interface GameStatus {
  appName: string
  progress?: InstallProgress
  folder?: string
  context?: string
  status: Status
}

export interface InstallProgress {
  bytes: string
  eta: string
  folder?: string
  percent?: number
  downSpeed?: string
  diskWriteSpeed?: string
  file?: string
}
export type DMStatus = 'done' | 'error' | 'abort' | 'paused' | 'finished' | 'downloading'

export interface DMQueueElement {
  type: 'install' | 'update'
  params: InstallParams
  downloadInfo?: DownloadInfo
  addToQueueTime: number
  startTime?: number
  endTime?: number
  status?: DMStatus
}
export interface DownloadInfo {
  downloadUrl: string
  fileName: string
  execPath: string
  checksum: string
  fileSize: number
  installSize: number
}
export type DownloadManagerState = 'idle' | 'running' | 'paused' | 'stopped' | 'downloading'
export const Platforms = ['windows', 'linux', 'macos', 'android', 'ios'] as const
export type Platform = (typeof Platforms)[number]
export interface SystemRequirements {
  minimum: SystemRequirementEntry
  recommend?: SystemRequirementEntry
}

export interface AppSettings {
  defaultInstallPath: string
}
