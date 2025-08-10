export interface fetchProps {
  url: string
  type: Type
  count: number
}
export type WineArchitecture = 'win32' | 'win64'

export type Type =
  | 'system'
  | 'Wine-GE'
  | 'GE-Proton'
  | 'Proton'
  | 'Wine-Lutris'
  | 'Wine-Kron4ek'
  | 'Wine-Crossover'
  | 'Wine-Staging-macOS'
  | 'Game-Porting-Toolkit'

export interface VersionInfo {
  version: string
  type: Type
  date: string
  download: string
  downsize: number
  disksize: number
  checksum: string
}
export interface WinePrefixConfig {
  name: string
  path: string
  architecture: WineArchitecture
  createdAt: Date
  customWinePath?: string
  lastUsed?: Date
  size?: string
}
export interface WineInstallInfo {
  name: string
  version: VersionInfo
  installPath: string
  type: Type
  installed: boolean
}
export interface SystemWineInfo {
  username: string
  homeDirectory: string
  currentWinePrefix: string
  currentWinePath: string
  installedWines: WineInstallInfo[]
  gpuInfo: string
  vulkanSupport: boolean
}

export interface CommandResult {
  success: boolean
  exitCode: number
  stdout: string
  stderr: string
  duration: number // milliseconds
}

export interface WineEnvironment {
  WINEPREFIX?: string
  WINEARCH?: string
  WINEDEBUG?: string
  WINE_FULL_SCREEN_FSR?: string
  DXVK_ENABLE_NVAPI?: string
  [key: string]: string | undefined
}

export enum CommonDependencies {
  VCRUN2019 = 'vcrun2019',
  VCRUN2022 = 'vcrun2022',
  DOTNET48 = 'dotnet48',
  D3DX9 = 'd3dx9',
  D3DX10 = 'd3dx10',
  DXVK = 'dxvk',
  COREFONTS = 'corefonts',
  LIBERATION = 'liberation',
  ARIAL = 'arial',
  TIMES = 'times',
  DINPUT8 = 'dinput8',
}
export interface Logger {
  info(message: string): void
  warn(message: string): void
  error(message: string): void
  success(message: string): void
  debug(message: string): void
}
