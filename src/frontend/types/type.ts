export interface UserInfo {
  displayName: string | null
  avatarUrl: string | null
}

export interface InstallArgs {
  path: string
  branch?: string
  buildId?: string
}

export interface InstallParams extends InstallArgs {
  appName: string
  gameInfo: GameDetails
  size?: number | 0
  installSize?: number | 0
}

export type GameLibrary = {
  gameId: string
  title: string
  thumbnailUrl: string
  ownedDate: number
  lastPlayedAt: number | null
  isInQueue?: boolean
  isInstalled?: boolean
}

export interface GameInfo {
  id: string
  title: string
  thumbnail: string
  installable?: boolean
  is_installed?: boolean
  developerTeams: string[]
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

export interface GameDetails {
  details: GameInfo
  publisherName: string
  genres: string[]
  tags: string[]
}
export interface DownloadInfo {
  downloadUrl: string
  fileName: string
  execPath: string
  checksum: string
  fileSize: number
  installSize: number
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
  launch_path?: string
  version?: string
  appName?: string
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
export type DMStatus = 'done' | 'error' | 'abort' | 'paused' | 'downloading'

export interface DMQueueElement {
  type: 'install' | 'update'
  params: InstallParams
  downloadInfo: DownloadInfo
  addToQueueTime: number
  startTime?: number
  endTime?: number
  status?: DMStatus
}
export type DownloadManagerState = 'idle' | 'running' | 'paused' | 'stopped'
export const Platforms = ['windows', 'linux', 'macos', 'android', 'ios'] as const
export type Platform = (typeof Platforms)[number]

export interface SystemRequirements {
  minimum: SystemRequirementEntry
  recommend?: SystemRequirementEntry
}
export interface SystemInfo {
  cpu: {
    manufacturer: string
    model: string
    brand: string
    cores: number
    speed: number
  }
  memory: {
    total: number
    free: number
    available: number
  }
  gpu: Array<{
    model: string
    vendor: string
    vram: number
  }> | null
  os: {
    platform: string
    distro: string
    release: string
    codename: string
  }
  wifi: {
    ssid: string
    signalLevel: number
  } | null
  storage: Array<{
    mount: string
    size: number
    used: number
    available: number
  }> | null
}

