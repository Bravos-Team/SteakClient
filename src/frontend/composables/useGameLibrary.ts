import { toRaw } from 'vue'
import { toast } from 'vue-sonner'
import { InstallParams } from '@/types/type'

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
      }
    } catch (error) {
      console.error('Mở thư mục thất bại:', error)
      toast.error('Không thể mở thư mục')
      return null
    }
  }

  async function installGame(installInfo: InstallParams) {
    try {
      await window.api.install(toRaw(installInfo))
      toast.success(`Cài đặt Thanh cong  ${installInfo.gameInfo.title}...`)
    } catch (error) {
      console.error('Cài đặt thất bại:', error)
      toast.error(`Cài đặt ${installInfo.gameInfo.title} thất bại`)
      throw error
    }
  }

  return {
    saveGame,
    openFolder,
    installGame,
  }
}
