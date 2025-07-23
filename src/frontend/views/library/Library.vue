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
              <span class="text-lg font-semibold">Download size</span>
              <span class="text-sm text-muted-foreground">
                {{ formatSize(installInfo.gameInfo.install.install_size) }}
              </span>
            </span>
            <CircleDot class="w-8 h-8" />
            <span class="flex flex-col">
              <span class="text-lg font-semibold">Version</span>
              <span class="text-sm text-muted-foreground">1.0.0</span>
            </span>
          </span>
        </DialogDescription>
      </DialogHeader>
      <div class="flex flex-col gap-4">
        <AlertTitle>Select installation path:</AlertTitle>
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
            Free space: <span class="text-green-500 font-semibold">1.2 TB</span> /
            <span class="text-red-500 font-semibold">2.0 TB</span> - After installation, remaining:
            <span class="text-red-500 font-semibold">1.5 TB</span>
          </span>
        </AlertDescription>
      </div>
      <DialogFooter class="flex mt-12 gap-2 justify-end">
        <Button variant="outline" class="w-32 h-12 text-lg hover:text-blue-500"> Enter Save</Button>
        <Button
          @click="install"
          variant="default"
          class="w-32 h-12 text-lg hover:bg-green-500"
          :disabled="isInstalling"
        >
          {{ isInstalling ? 'Installing...' : 'Install' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  <ul></ul>
</template>

<script lang="ts" setup>
import { ref, reactive, toRaw, onMounted, computed } from 'vue'
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
import { GameLibrary, InstallParams } from '@/types/type'
import { Download, AppWindow, CircleDot, Folder } from 'lucide-vue-next'

import GameCard from '@/components/library/GameCard.vue'
import { useGameLibrary } from '@/composables/useGameLibrary'
import wukongImage from '@/assets/image/backmythwukong.jpg'
import elderRingImage from '@/assets/image/elderring.webp'
import axios from 'axios'
import { useDownloadQueueStore } from '@/stores/download/useDownloadStore'
import { useGetLibraryList } from '@/stores/library/useMyLibrary'

// Trạng thái Dialog và cài đặt
const isDialogOpen = ref(false)
const isInstalling = ref(false)
const LibraryStore = useGameLibrary()
const QueueStore = useDownloadQueueStore()
// Danh sách game mẫu
// const games = [
//   {
//     appName: 'fortnite',
//     title: 'Fortnite Blitz Royale',
//     image:
//       'https://cdn2.unrealengine.com/fortnite-blitz-royale-1920x1080-9946411a3a9f.jpg?resize=1&w=1920',
//     installable: false,
//   },
//   {
//     appName: 'wukong',
//     title: 'Black Myth: Wukong',
//     image: wukongImage,
//     installable: true,
//   },
//   {
//     appName: 'elden-ring',
//     title: 'Elden Ring',
//     image: elderRingImage,
//     installable: true,
//   },
// ]

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
const { saveGame, openFolder, installGame } = LibraryStore

// Xử lý sự kiện cài đặt
const handleInstall = async (appName: string) => {
  const game = games.value.find((g: { appName: string }) => g.appName === appName)

  const queuedGame = QueueStore.getQueue().find((g) => g.params.appName === appName)
  console.log(QueueStore.getQueue())

  if (queuedGame) {
    toast.error(`Game ${appName} is already in the download queue.`)
    isInstalling.value = true
    return
  }
  if (!game) {
    toast.error(`Game ${appName} not found.`)
    return
  }
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
  isInstalling.value = false
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
    console.log(`Installing game: ${installInfo.appName} at ${installInfo.path}`)

    QueueStore.addToQueue({
      params: installInfo,
      addToQueueTime: Date.now(),
      type: 'install',
    })
    await installGame(installInfo)
  } catch (error: any) {
    toast.error('Lỗi khi cài đặt: ' + error.message)
    isDialogOpen.value = false // Đóng Dialog khi lỗiu
  }
}

// Định dạng kích thước file
const formatSize = (size: string) => {
  const bytes = parseInt(size)
  return `${(bytes / 1000000).toFixed(3)} MB`
}

const { data: libraryData } = useGetLibraryList()

// const gameList = computed(() => libraryData.value?.data ?? [])
const games = computed(() => {
  return (
    libraryData.value?.data.map((game: GameLibrary) => ({
      appName: game.gameId,
      title: game.title,
      image: game.thumbnailUrl,
      installable: false,
    })) ?? []
  )
})
</script>
