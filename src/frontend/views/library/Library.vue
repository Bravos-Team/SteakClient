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
          {{ installInfo.gameInfo?.details?.title || '' }} <AppWindow class="w-6 h-6" />
        </DialogTitle>
        <DialogDescription class="my-2">
          <span class="flex items-center gap-4">
            <Download class="w-8 h-8" />
            <span class="flex flex-col">
              <span class="text-lg font-semibold">Download size</span>
              <span class="text-sm text-muted-foreground">
                {{ formatSize(installInfo.installSize || 0) }}
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
import { ref, reactive, toRaw, onMounted, computed, nextTick } from 'vue'
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
import { DownloadInfo, GameLibrary, InstallParams } from '@/types/type'
import { Download, AppWindow, CircleDot, Folder } from 'lucide-vue-next'

import GameCard from '@/components/library/GameCard.vue'
import { useGameLibrary } from '@/composables/useGameLibrary'

import { useDownloadQueueStore } from '@/stores/download/useDownloadStore'
import { useGetLibraryList } from '@/stores/library/useMyLibrary'
import { useGameDetails, useGameDownloadInfo } from '@/composables/useGameDetail'

// Trạng thái Dialog và cài đặt
const isDialogOpen = ref(false)
const isInstalling = ref(false)
const LibraryStore = useGameLibrary()
const QueueStore = useDownloadQueueStore()
let installInfo = reactive<InstallParams>({} as InstallParams)
// Trạng thái cài đặt
const handleOpenFolder = async () => {
  const folderPath = await openFolder()
  if (folderPath) {
    installInfo.path = folderPath
    toast.success(`Đã chọn thư mục: ${folderPath}`)
  }
}
// Sử dụng composable
const { saveGame, openFolder, installGame } = LibraryStore
const selectId = ref('')
const { downloadParams } = useGameDownloadInfo('9074997337759744')
// Xử lý sự kiện cài đặt
const handleInstall = async (Id: string) => {
  // const game = games.value.find((g: { appName: string }) => g.appName === appName)
  // const queuedGame = QueueStore.getQueue().find((g) => g.params.appName === appName)
  // console.log(QueueStore.getQueue())
  // if (queuedGame) {
  //   toast.error(`Game ${appName} is already in the download queue.`)
  //   isInstalling.value = true
  //   return
  // }
  // if (!game) {
  //   toast.error(`Game ${appName} not found.`)
  //   return
  // }

  const { InstallParamsInfo } = useGameDetails(Id)
  installInfo = InstallParamsInfo
  isInstalling.value = true
  isInstalling.value = true
  try {
    // Gọi refetchDownloadInfo và chờ hoàn tất

    // Gán InstallParamsInfo vào installInfo

    console.log(`InstallParamsInfo: ${JSON.stringify(installInfo)}`)
  } catch (error) {
    console.error('Error fetching download info:', error)
    // toast.error('Failed to fetch download info.');
  } finally {
    isInstalling.value = false
    isDialogOpen.value = true
  }
}

// Xử lý sự kiện xóa
const handleDelete = (appName: string) => {
  toast.success(`Đã xóa ${appName}`)
  // Logic xóa game (gọi API hoặc xử lý khác)
}

// Cài đặt game
const install = async () => {
  if (!installInfo.value.path) {
    toast.error('Vui lòng chọn đường dẫn cài đặt')
    return
  }
  isInstalling.value = true

  isDialogOpen.value = false
  console.log(`Installing game: ${installInfo.value.appName} at ${installInfo.value.path}`)
  // const { downloadParams } = useGameDownloadInfo(installInfo.value.appName)
  QueueStore.addToQueue({
    params: installInfo.value,
    addToQueueTime: Date.now(),
    type: 'install',
    downloadInfo: downloadParams,
  })
  await installGame(installInfo.value, downloadParams)

  // catch (error: any) {
  //   toast.error('Lỗi khi cài đặt: ' + error.message)
  //   isDialogOpen.value = false // Đóng Dialog khi lỗiu
  // }
}

// Định dạng kích thước file
function formatSize(bytes: number): string {
  if (bytes >= 1024 ** 3) return (bytes / 1024 ** 3).toFixed(2) + ' GB'
  if (bytes >= 1024 ** 2) return (bytes / 1024 ** 2).toFixed(2) + ' MB'
  if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return bytes + ' B'
}

const { data: libraryData } = useGetLibraryList()

// const gameList = computed(() => libraryData.value?.data ?? [])
const games = computed(() => {
  return (
    libraryData.value?.data.map((game: GameLibrary) => ({
      id: game.gameId,
      title: game.title,
      image: game.thumbnailUrl,
      installable: true,
    })) ?? []
  )
})
</script>
