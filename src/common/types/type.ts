import { TitleBarOverlay } from 'electron'
export interface UserInfo {
  id: string | null
  username: string | null
  email: string | null
  avatarUrl: string | null
  displayName: string | null
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
  gameInfo: GameInfo
  size?: string
}

export interface GameInfo {
  app_name: string
  title: string
  art_cover?: string
  install: InstalledInfo
  installable: boolean
  is_installed: boolean
  save_path?: string
  version?: string
  system_requirements?: SystemRequirements
  short_description?: string
  is_offline?: boolean
  language?: string[]
  platforms?: Platform[]
}

export interface SystemRequirementEntry {
  os: string
  cpu: string
  memory: string
  graphics: string
  storage: string
  directX: string
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
export type DMStatus = 'done' | 'error' | 'abort' | 'paused' | 'finished'

export interface DMQueueElement {
  type: 'install' |  'update' 
  params: InstallParams
  addToQueueTime: number
  starTime?: number
  endTime?: number
  status?: DMStatus
}
export type DownloadManagerState = 'idle' | 'running' | 'paused' | 'stopped'
export const Platforms = [ 'windows', 'linux', 'macos', 'android', 'ios' ] as const
export type Platform = (typeof Platforms)[number]
export interface SystemRequirements {
  minimum: SystemRequirementEntry
  recommended?: SystemRequirementEntry
}


export interface AppSettings {
  defaultInstallPath: string
}