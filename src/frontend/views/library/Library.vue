<template>
  <Dialog v-model:open="isDialogOpen">
    <div class="flex mb-3">
      <div class="ml-4 w-full max-w-[500px]">
        <ComboboxSearch />
      </div>
    </div>
    <div class="w-full flex flex-1 flex-col h-full p-4 overflow-y-hidden">
      <div class="grid auto-rows-min gap-4 md:grid-cols-8">
        <GameCard
          v-for="game in games"
          :key="game.appName"
          :game="game"
          @install="handleInstall"
          @delete="handleDelete"
          @save="saveGame"
        />
      </div>
    </div>
    <DialogContent class="sm:max-w-[750px] p-8">
      <DialogHeader>
        <DialogTitle class="flex gap-8 font-semibold items-center text-3xl">
          {{ installInfo.gameInfo.title }} <AppWindow class="w-6 h-6" />
        </DialogTitle>
        <DialogDescription class="my-2">
          <span class="flex items-center gap-4">
            <Download class="w-8 h-8" />
            <span class="flex flex-col">
              <span class="text-lg font-semibold">Dung lượng tải</span>
              <span class="text-sm text-muted-foreground">
                {{ formatSize(installInfo.gameInfo.install.install_size) }}
              </span>
            </span>
            <CircleDot class="w-8 h-8" />
            <span class="flex flex-col">
              <span class="text-lg font-semibold">Phiên bản</span>
              <span class="text-sm text-muted-foreground">1.0.0</span>
            </span>
          </span>
        </DialogDescription>
      </DialogHeader>
      <div class="flex flex-col gap-4">
        <AlertTitle>Chọn đường dẫn cài đặt:</AlertTitle>
        <AlertDescription class="flex flex-col gap-2">
          <span class="flex items-center w-full">
            <Input v-model="installInfo.path" class="px-4 h-12 text-lg rounded-r-none" readonly />
            <button
              @click="handleOpenFolder"
              class="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-blue-500 transition-all backdrop-blur-sm shadow-lg rounded-r-md"
            >
              <Folder class="w-6 h-6" />
            </button>
          </span>
          <span>
            Dung lượng trống: <span class="text-green-500 font-semibold">1.2 TB</span> /
            <span class="text-red-500 font-semibold">2.0 TB</span> - Sau khi cài đặt, còn lại:
            <span class="text-red-500 font-semibold">1.5 TB</span>
          </span>
        </AlertDescription>
      </div>
      <DialogFooter class="flex mt-12 gap-2 justify-end">
        <Button variant="outline" class="w-32 h-12 text-lg hover:text-blue-500"> Nhập Save </Button>
        <Button
          @click="install"
          variant="default"
          class="w-32 h-12 text-lg hover:bg-green-500"
          :disabled="isInstalling"
        >
          {{ isInstalling ? 'Đang cài...' : 'Cài đặt' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, toRaw } from 'vue'
import { toast } from 'vue-sonner'
import ComboboxSearch from '@/components/ComboboxSearch.vue'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { InstallParams } from '@/types/type'
import { Download, AppWindow, CircleDot, Folder } from 'lucide-vue-next'

import GameCard from '@/components/library/GameCard.vue'
import { useGameLibrary } from '@/stores/library/useGameLibrary'
import wukongImage from '@/assets/image/backmythwukong.jpg'
import elderRingImage from '@/assets/image/elderring.webp'
// Trạng thái Dialog và cài đặt
const isDialogOpen = ref(false)
const isInstalling = ref(false)
// Danh sách game mẫu
const games = [
  {
    appName: 'fortnite',
    title: 'Fortnite Blitz Royale',
    image:
      'https://cdn2.unrealengine.com/fortnite-blitz-royale-1920x1080-9946411a3a9f.jpg?resize=1&w=1920',
    installable: false,
  },
  {
    appName: 'wukong',
    title: 'Black Myth: Wukong',
    image: wukongImage,
    installable: true,
  },
  {
    appName: 'elden-ring',
    title: 'Elden Ring',
    image: elderRingImage,
    installable: true,
  },
]

// Trạng thái cài đặt
const installInfo: InstallParams = reactive({
  appName: '',
  path: '',
  gameInfo: {
    app_name: '',
    install: {
      executable: '',
      install_path: '',
      install_size: '',
    },
    installable: false,
    is_installed: false,
    title: '',
  },
})

// Hàm mở thư mục
const handleOpenFolder = async () => {
  const folderPath = await openFolder()
  if (folderPath) {
    installInfo.path = folderPath
    installInfo.gameInfo.install.install_path = folderPath
  }
}
// Sử dụng composable
const { saveGame, openFolder, installGame } = useGameLibrary()

// Xử lý sự kiện cài đặt
const handleInstall = async (appName: string) => {
  const game = games.find((g) => g.appName === appName)
  if (!game) return

  installInfo.appName = appName
  installInfo.path = ''
  installInfo.gameInfo = {
    app_name: appName,
    install: {
      executable: `${appName}.exe`,
      install_path: '',
      install_size: '5000000000', // 5GB
    },
    installable: true,
    is_installed: false,
    title: game.title,
  }
  isDialogOpen.value = true
}

// Xử lý sự kiện xóa
const handleDelete = (appName: string) => {
  toast.success(`Đã xóa ${appName}`)
  // Logic xóa game (gọi API hoặc xử lý khác)
}

// Cài đặt game
const install = async () => {
  if (!installInfo.path) {
    toast.error('Vui lòng chọn đường dẫn cài đặt')
    return
  }
  isInstalling.value = true
  try {
    isDialogOpen.value = false
    await installGame(installInfo)
    
    
  } catch (error: any) {
    toast.error('Lỗi khi cài đặt: ' + error.message)
    isDialogOpen.value = false // Đóng Dialog khi lỗiu
  } finally {
    isInstalling.value = false
  }
}

// Định dạng kích thước file
const formatSize = (size: string) => {
  const bytes = parseInt(size)
  return `${(bytes / 1000000).toFixed(3)} MB`
}
</script>
