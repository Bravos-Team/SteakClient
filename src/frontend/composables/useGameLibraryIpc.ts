import { toast } from 'vue-sonner'
import { DownloadInfo, InstallParams } from '@/types/type'

export function useGameLibrary() {
  async function saveGame() {
    try {
      const fileName = await window.electronAPI.openFile()
      console.log('Saved file:', fileName)
      toast.success(`Đã lưu: ${fileName}`)
    } catch (error) {
      console.error('Lưu game thất bại:', error)
      toast.error('Không thể lưu game')
    }
  }

  async function openFolder() {
    try {
      const homePath = await window.api.getHomePath()
      const folderPath = await window.api.openFolder(homePath)
      if (folderPath) {
        return folderPath
      } else {
        return ''
      }
    } catch (error) {
      return null
    }
  }

  async function installGame(installInfo: InstallParams, downloadParams: DownloadInfo) {
    try {
      // Kiểm tra các tham số cần thiết
      if (!installInfo.path || !installInfo.gameInfo || !downloadParams) {
        toast.error('Missing required installation parameters.')
        return
      }
      await window.api.install(installInfo, downloadParams)
    } catch (error) {
      console.error('Installation failed:', error)
      throw error
    }
  }

  return {
    saveGame,
    openFolder,
    installGame,
  }
}
