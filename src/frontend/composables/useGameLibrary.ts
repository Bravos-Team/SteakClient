import { toRaw } from 'vue'
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
      console.log(`Home path: ${homePath}`)
      const folderPath = await window.api.openFolder(homePath)
      if (folderPath) {
        console.log(`Opened folder: ${folderPath}`)
        toast.success(`Đã mở: ${folderPath}`)
        return folderPath
      } else {
        toast.error('Không chọn thư mục')
        return null
      } Y
    } catch (error) {
      console.error('Mở thư mục thất bại:', error)
      toast.error('Không thể mở thư mục')
      return null
    }
  }

  async function installGame(installInfo: InstallParams, downloadParams: DownloadInfo) {
    console.log(`Installing game: ${installInfo.gameInfo.details.title} at ${installInfo.path}`)
    console.log(`Download params:`, downloadParams)

    await window.api.install(installInfo, downloadParams)
    toast.success(`Cài đặt Thành công  ${installInfo.gameInfo.details.title}...`)

    // catch (error) {
    //   console.error('Cài đặt thất bại:', error)
    //   toast.error(`Cài đặt ${installInfo.gameInfo.details.title} thất bại`)
    //   throw error
    // }
  }

  return {
    saveGame,
    openFolder, 
    installGame,
  }
}
