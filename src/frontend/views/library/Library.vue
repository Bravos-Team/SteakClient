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
          :key="game.id"
          :game="game"
          @install="handleInstall"
          @delete="handleDelete"
          @save="saveGame"
        />
      </div>
    </div>
    <DialogContent v-if="installParams.gameInfo?.details" class="sm:max-w-[750px] p-8">
      <DialogHeader>
        <DialogTitle class="flex gap-8 font-semibold items-center text-3xl">
          {{ installParams.gameInfo?.details?.title || '' }} <AppWindow class="w-6 h-6" />
        </DialogTitle>
        <DialogDescription class="my-2">
          <span class="flex items-center gap-4">
            <Download class="w-8 h-8" />
            <span class="flex flex-col">
              <span class="text-lg font-semibold">Download size</span>
              <span class="text-sm text-muted-foreground">
                {{ formatSize(installParams.installSize || 0) }}
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
            <Input v-model="installParams.path" class="px-4 h-12 text-lg rounded-r-none" readonly />
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
import { ref, reactive, toRaw, onMounted, computed, nextTick, watchEffect, watch } from 'vue'
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
import { DownloadInfo, GameDetails, GameLibrary, InstallParams } from '@/types/type'
import { Download, AppWindow, CircleDot, Folder } from 'lucide-vue-next'

import GameCard from '@/components/library/GameCard.vue'
import { useGameLibrary } from '@/composables/useGameLibrary'

import { useDownloadQueueStore } from '@/stores/download/useDownloadStore'
import {
  useGetGameDownloadInfo,
  useGetGameInfo,
  useGetLibraryList,
} from '@/stores/library/useMyLibrary'
import { useGameDetails, useGameDownloadInfo } from '@/composables/useGameDetail'

const isDialogOpen = ref(false)
const isInstalling = ref(false)
const LibraryStore = useGameLibrary()
const QueueStore = useDownloadQueueStore()
const selectedGameId = ref('')
const installParams = ref<InstallParams>({} as InstallParams)
const downloadInfo = ref<DownloadInfo>({} as DownloadInfo)
const installPath = ref('')

const handleOpenFolder = async () => {
  const folderPath = await openFolder()
  if (folderPath) {
    installParams.value.path = folderPath
    toast.success(`Đã chọn thư mục: ${folderPath}`)
  }
}

const { saveGame, openFolder, installGame } = LibraryStore
const { data: gameInfo, refetch: refetchGameInfo } = useGetGameInfo(selectedGameId)
const { data: downloadParams, refetch: refetchDownloadParams } =
  useGetGameDownloadInfo(selectedGameId)

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
  selectedGameId.value = Id
  await refetchGameInfo()

  installParams.value.gameInfo = JSON.parse(JSON.stringify(gameInfo.value || {}))
  installParams.value.appName = installParams.value.gameInfo.details.id
  installParams.value.path = installPath.value || ''
  await refetchDownloadParams()
  downloadInfo.value = JSON.parse(JSON.stringify(downloadParams.value || {}))
  installParams.value.installSize = downloadInfo.value?.installSize || 0

  console.log('Install Params:', installParams.value)

  installPath.value = ''
  isDialogOpen.value = true
  try {
  } catch (error) {
    console.error('Error fetching download info:', error)
  } finally {
    isInstalling.value = false
    isDialogOpen.value = true
  }
}

const handleDelete = (appName: string) => {
  toast.success(`Đã xóa ${appName}`)
}

// Cài đặt game
const install = async () => {
  if (!installParams.value.path) {
    toast.error('Vui lòng chọn đường dẫn cài đặt')
    return
  }

  isInstalling.value = true
  isDialogOpen.value = false
  console.log(downloadInfo.value);
  
  QueueStore.addToQueue({
    type: 'install',
    params: toRaw(installParams.value),
    downloadInfo: toRaw(downloadInfo.value),
    addToQueueTime: Date.now(),
  })

  try {
    await installGame(toRaw(installParams.value), toRaw(downloadInfo.value))
    toast.success(`Đã cài đặt game ${installParams.value.appName} thành công!`)
  } catch (error: any) {
    toast.error('Lỗi khi cài đặt: ' + error.message)
  } finally {
    isInstalling.value = false
  }
}

function formatSize(bytes: number): string {
  if (bytes >= 1024 ** 3) return (bytes / 1024 ** 3).toFixed(2) + ' GB'
  if (bytes >= 1024 ** 2) return (bytes / 1024 ** 2).toFixed(2) + ' MB'
  if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return bytes + ' B'
}

const { data: libraryData } = useGetLibraryList()

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
