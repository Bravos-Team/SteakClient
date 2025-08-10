import path from 'path'
import {
  CommonDependencies,
  VersionInfo,
  WineArchitecture,
  WineInstallInfo,
  WinePrefixConfig,
} from './type'
import { ColorLogger, fetchReleases, SystemUtils } from './util'
import { TypeCheckedStoreBackEnd } from '../electron_store'
import { remove } from 'fs-extra'
import { downloadFile, extractFileTar, extractFileTarXz, removeFolder } from '../utils'
import { appPath } from '../constants/path'
import { notify } from '../dialog/dialog'

export class WineManager {
  private logger: ColorLogger

  private currentPrefix?: WinePrefixConfig
  private currentWineInstallation?: WineInstallInfo
  private wineStore: TypeCheckedStoreBackEnd<'wineManager'>
  constructor() {
    this.logger = new ColorLogger()
    this.wineStore = new TypeCheckedStoreBackEnd('wineManager', {
      cwd: 'store',
      name: 'wine-manager',
    })
  }

  async createPreFix(
    name: string,
    pathSave: string,
    architecture: WineArchitecture = 'win64',
    customWinePath?: string,
  ): Promise<boolean> {
    const prefixPath = path.join(pathSave, `${name}`)

    this.logger.info(`Creating Wine prefix: ${name} (${architecture})`)
    this.logger.debug(`Path: ${prefixPath}`)

    if (customWinePath) {
      const wineBinary = path.join(customWinePath, 'bin', 'wine')
      const wineBootBin = path.join(customWinePath, 'bin', 'wineboot')
      if (!SystemUtils.fileExists(wineBinary)) {
        this.logger.error(`Wine binary not found at: ${wineBinary}`)
        return false
      }

      if (!SystemUtils.fileExists(wineBootBin)) {
        this.logger.error(`Wineboot binary not found at: ${wineBootBin}`)
        return false
      }
      this.logger.info(`🍷 Using custom Wine from: ${customWinePath}`)
    }

    if (SystemUtils.fileExists(prefixPath)) {
      this.logger.warn(`Wine prefix already exists: ${prefixPath}`)
      return false
    }
    try {
      // Create the Wine prefix directory
      await SystemUtils.createDirectory(prefixPath)
      const env: Record<string, string> = {
        WINEPREFIX: prefixPath,
        WINEARCH: architecture,
        WINEDEBUG: '-all',
      }
      let winebootCommand = 'wineboot'
      if (customWinePath) {
        const wineBinDir = path.join(customWinePath, 'bin')
        env.PATH = `${wineBinDir}:${process.env.PATH}`
        winebootCommand = path.join(customWinePath, 'bin', 'wineboot')
        this.logger.debug(`Using Wine from: ${customWinePath}`)
        this.logger.debug(`Wine bin directory: ${wineBinDir}`)
      }
      this.logger.debug(`Initializing Wine prefix...`)
      this.logger.debug(`Command: ${winebootCommand} --init`)

      const result = await SystemUtils.executeCommand(winebootCommand, ['--init'], { env })
      if (!result.success) {
        this.logger.error(`Failed to initialize Wine prefix: ${result.stderr}`)
        return false
      }

      const prefixConfig: WinePrefixConfig = {
        name,
        path: prefixPath,
        architecture,
        customWinePath,
        createdAt: new Date(),
      }
      this.wineStore.set('winePrefix', prefixConfig)

      this.logger.success(`✨ Prefix '${name}' created successfully!`)

      this.logger.info(`📍 Location: ${prefixPath}`)
      if (customWinePath) {
        this.logger.info(`🍷 Wine: ${customWinePath}`)
      }
      return true
    } catch (error) {
      this.logger.error(`Error creating prefix: ${error}`)

      // Cleanup nếu có lỗi
      try {
        if (SystemUtils.fileExists(prefixPath)) {
          await remove(prefixPath)
        }
      } catch (cleanupError) {
        this.logger.warn(`Failed to cleanup: ${cleanupError}`)
      }

      return false
    }
  }
  setActivePrefix(pathPrefix: string): boolean {
    if (!SystemUtils.fileExists(pathPrefix)) {
      this.logger.error(`Wine prefix not found: ${pathPrefix}`)
      return false
    }
    const prefixConfig: WinePrefixConfig = {
      name: 'Wine-Ge-Custom',
      path: pathPrefix,
      architecture: 'win64',
      createdAt: new Date(),
      lastUsed: new Date(),
    }
    this.currentPrefix = prefixConfig
    process.env.WINEPREFIX = pathPrefix
    this.wineStore.set('winePrefix', prefixConfig)
    this.logger.success(`🍷 Active Wine prefix set to: ${prefixConfig.name}`)
    this.logger.info(`📍 WINEPREFIX: ${pathPrefix}`)

    return true
  }
  setWineInstallation(info: WineInstallInfo): boolean {
    const wineBinPath = path.join(info.installPath, 'bin')
    if (!SystemUtils.fileExists(wineBinPath)) {
      this.logger.error(`Wine installation not found: ${wineBinPath}`)
      return false
    }
    this.currentWineInstallation = info
    const currentPath = process.env.PATH || ''
    process.env.PATH = `${path.join(info.installPath, 'bin')}:${currentPath}`
    this.logger.success(`🍷 Using Wine: ${info.name} (${info.version})`)
    this.logger.debug(`Wine path: ${info.installPath}`)
    return true
  }

  async installDependencies(packages: (string | CommonDependencies)[]): Promise<boolean> {
    if (!this.currentPrefix) {
      this.logger.error('No active Wine prefix. Please create or switch to a prefix first.')
      return false
    }
    this.logger.info(`📦 Installing dependencies: ${packages.join(', ')}`)
    this.logger.debug(`Target prefix: ${this.currentPrefix.path}`)
    const env: Record<string, string> = {
      WINEPREFIX: this.currentPrefix.path,
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const result = await SystemUtils.executeCommand('winetricks', [...packages], {
        env,
        timeout: 300000,
      })

      if (!result.success) {
        this.logger.error(`Failed to install dependencies: ${result.stderr}`)
        return false
      }
      this.logger.success(`All dependencies installed successfully!`)
      return true
    } catch (error) {
      return false
    }
  }

  async rungame(gamePath: string, args: string[] = []): Promise<boolean> {
    if (!SystemUtils.fileExists(gamePath)) {
      this.logger.error(`Game not found: ${gamePath}`)
      return false
    }

    this.logger.info(`🎮 Launching game: ${path.basename(gamePath)}`)
    this.logger.debug(`Game path: ${gamePath}`)
    this.logger.debug(`Arguments: ${args.join(' ')}`)

    if (this.currentPrefix) {
      this.logger.debug(`Using prefix: ${this.currentPrefix.name}`)
    }
    const env: Record<string, string> = {
      WINEDEBUG: '-all',
      WINE_FULL_SCREEN_FSR: '1',
    }
    if (this.currentPrefix) {
      env.WINEPREFIX = this.currentPrefix.path
    }

    try {
      const wineCommand = this.currentWineInstallation
        ? path.join(this.currentWineInstallation.installPath, 'bin', 'wine')
        : 'wine'
      const starttime = Date.now()
      const result = await SystemUtils.executeCommand(wineCommand, [gamePath, ...args], { env })
      const duration = Math.round((Date.now() - starttime) / 1000)
      if (!result.success) {
        this.logger.error(`Failed to launch game: ${result.stderr}`)
        return false
      }
      this.logger.info(`Game launched successfully in ${duration} seconds!`)
      return result.success
    } catch (error) {
      this.logger.error(`Error launching game: ${error}`)
      return false
    }
  }

  async saveWineFetchInfo(url: string) {
    const wineInfos = this.wineStore.get('wineInstallation', [] as WineInstallInfo[])
    if (wineInfos.length > 0) {
      this.logger.info(`🍷 Found ${wineInfos.length} Wine installations in store.`)
      return
    }
    const type = 'Wine-GE' as VersionInfo['type']
    const count = 1
    const fetch = await fetchReleases({ url, type, count })

    const item = fetch[1]
    wineInfos.push({
      name: item.version,
      version: item,
      installed: false,
      installPath: '',
      type: item.type,
    })

    this.wineStore.set('wineInstallation', wineInfos)
  }
  async downloadWine() {
    const wineInfo = this.wineStore.get('wineInstallation', [] as WineInstallInfo[])[0]
    const fileName = wineInfo.version.download.split('/').pop() || ''
    if (!wineInfo && !fileName) {
      this.logger.error('No Wine installation found to download.')
      return
    }
    const pathSaveWine = path.join(appPath, 'tools', 'wine')
    if (!SystemUtils.fileExists(pathSaveWine)) {
      this.logger.info(`Creating directory for Wine downloads: ${pathSaveWine}`)
      SystemUtils.createDirectory(pathSaveWine)
    }
    if (wineInfo.installed) {
      this.logger.info(`Wine already installed: ${wineInfo.name} (${wineInfo.version})`)
      return
    }
    try {
      notify({
        title: `Downloading Wine: ${wineInfo.name} (${wineInfo.version})`,
        body: `Please wait while we download Wine...`,
      })

      if (!SystemUtils.fileExists(path.join(pathSaveWine, fileName))) {
        await downloadFile({
          url: wineInfo.version.download,
          dest: pathSaveWine,
          fileName: fileName,
        })
      }
      notify({
        title: `Extracting Wine: ${wineInfo.name} (${wineInfo.version})`,
        body: `Please wait while we extract Wine...`,
      })
      await extractFileTarXz(path.join(pathSaveWine, fileName), pathSaveWine)
      console.log(`Extracted ${fileName} to ${pathSaveWine}`)

      removeFolder(pathSaveWine, fileName)
      wineInfo.installed = true
      wineInfo.installPath = path.join(
        pathSaveWine,
        fileName.replace('wine-', '').replace(/\.tar\..*$/, ''),
      )
      this.wineStore.set('wineInstallation', [wineInfo])
    } catch (error) {
      this.logger.error(`Error downloading Wine: ${error}`)
    }

    // Implement download logic here
  }
}
