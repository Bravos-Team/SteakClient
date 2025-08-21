<template>
  <Dialog>
    <div class="flex my-2">
      <div class="ml-4 w-full max-w-[500px]">
        <ComboboxSearch />
      </div>
    </div>
    <div class="w-full flex flex-1 flex-col h-screen p-4">
      <div
        class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4 auto-rows-min"
      >
        <GameCard
          v-for="game in games"
          :key="game.gameId"
          :game="game"
          @install="handleInstall"
          @delete="handleDelete"
          @save="saveGame"
          @launch="handleLaunch"
        />
      </div>
      <div></div>
      <InstallDialog
        v-if="isDialogOpen && !isQueryGameInfoFetching"
        :installParams="installState.params"
        @open-folder="handleOpenFolder"
        @install="install"
        :is-installing="isInstalling"
        :is-fetching="false"
        :capacity-disks="capacityDisks"
      />
    </div>
  </Dialog>
  <ul></ul>
</template>

<script lang="ts" setup>
import { ref, toRaw, computed, onBeforeMount, onMounted, onUnmounted } from 'vue'
import { toast } from 'vue-sonner'
import ComboboxSearch from '@/components/ComboboxSearch.vue'

import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { DMQueueElement, DownloadInfo, GameDetails, GameLibrary, InstallParams } from '@/types/type'

import GameCard from '@/components/library/GameCard.vue'

import { useGameLibrary } from '@/composables/useGameLibraryIpc'
import { useDownloadQueueStore } from '@/stores/download/useDownloadStore'
import {
  useGetGameDownloadInfo,
  useGetGameInfo,
  useGetLibraryList,
} from '@/hooks/library/useMyLibrary'
import InstallDialog from '@/components/library/InstallDialog.vue'
import { useSystemIpc } from '@/composables/useSystemIpc'
import { useSystemInfo } from '@/stores/util'
import { generateDeviceId } from '@/utils/fingerprint'
import { useLibraryStore } from '@/stores/library/useLibrary'

const isDialogOpen = ref(false)
const isInstalling = ref(false)
const isFetching = ref(false)
const capacityDisks = ref<{ totalSize: number; freeSize: number; remaining: number }>({
  totalSize: 0,
  freeSize: 0,
  remaining: 0,
})
const LibraryStoreIpc = useGameLibrary()
const LibraryStore = useLibraryStore()
const QueueStore = useDownloadQueueStore()
const DMQueueElements = ref([] as string[])
const DMFinished = ref([] as string[])
const selectedGameId = ref('')
const installPath = ref('')
const installState = ref<{ params: InstallParams; downloadInfo: DownloadInfo }>({
  params: {} as InstallParams,
  downloadInfo: {} as DownloadInfo,
})
const { setLibrary, addGame } = LibraryStore
const { saveGame, openFolder, installGame } = LibraryStoreIpc
const {
  data: gameInfo,
  refetch: refetchGameInfo,
  isFetching: isQueryGameInfoFetching,
} = useGetGameInfo(selectedGameId)

const handleOpenFolder = async () => {
  const folderPath = await openFolder()
  checkCapacity(folderPath)
  installState.value.params.path = folderPath
  if (folderPath) {
    toast.success(`Selected folder: ${folderPath}`)
  }
  if (folderPath === '') {
    return
  }
  if (!folderPath) {
    toast.error('Unable to open installation folder. Please try again.')
  }
}

const checkCapacity = async (path: string) => {
  await useSystemIpc(path)
  const systemInfoStore = useSystemInfo()
  console.log(systemInfoStore.getSystemInfo())

  const systemInfo = systemInfoStore.getSystemInfo()
  const totalSize = systemInfo?.storage?.[0]?.size || 0
  const freeSize = systemInfo?.storage?.[0]?.available || 0

  if (!installState.value.params.installSize) {
    installState.value.params.installSize = 0
  }
  if (freeSize < installState.value.params.installSize) {
    toast.error('Not enough space to install the game.')
    return
  }
  capacityDisks.value = {
    totalSize,
    freeSize,
    remaining: freeSize - installState.value.params.installSize,
  }
}
const { data: downloadParams, refetch: refetchDownloadParams } =
  useGetGameDownloadInfo(selectedGameId)

const { data: libraryData } = useGetLibraryList()
const games = computed(() => {
  return (
    libraryData.value?.data.map((game: GameLibrary) => ({
      gameId: game.gameId,
      title: game.title,
      image: game.thumbnailUrl,
      lastPlayedAt: game.lastPlayedAt,
      playSeconds: game.playSeconds,
      isInQueue: DMQueueElements.value.includes(game.gameId),
      isFinished: DMFinished.value.includes(game.gameId),
    })) ?? []
  )
})

const fetchGameData = async (id: string) => {
  try {
    isFetching.value = true
    selectedGameId.value = id
    await Promise.all([refetchGameInfo(), refetchDownloadParams()])

    if (!gameInfo.value || !downloadParams.value) {
      toast.error('Unable to find game information or download information.')
      return
    }
    installState.value.params = {
      gameInfo: { ...gameInfo.value } as GameDetails,
      id: gameInfo.value.details.id,
      path: '',
      installSize: downloadParams.value?.installSize || 0,
    }
    installState.value.downloadInfo = { ...downloadParams.value } as DownloadInfo

    isFetching.value = false
    return true
  } catch (error) {
    console.error('Error fetching game data:', error)
    return false
  }
}

const handleLaunch = async (Id: string) => {
  const deviceId = await generateDeviceId()
  await window.api.launchGame(Id, deviceId)
}
// Xử lý sự kiện cài đặt
const handleInstall = async (Id: string) => {
  if (await fetchGameData(Id)) {
    isInstalling.value = DMQueueElements.value.includes(Id)

    isDialogOpen.value = true
  } else {
    toast.error('Unable to fetch game data. Please try again later.')
  }
}

const handleDelete = (id: string) => {
  toast.success(`Deleted ${id}`)
}

const install = async (params: InstallParams) => {
  if (!params.path) {
    toast.error('Please select an installation path')
    return
  }
  const clonedParams = JSON.parse(JSON.stringify(params))
  const clonedDownloadInfo = JSON.parse(JSON.stringify(installState.value.downloadInfo))
  isInstalling.value = true
  isDialogOpen.value = false

  QueueStore.addToQueue({
    type: 'install',
    params: toRaw(params),
    downloadInfo: toRaw(installState.value.downloadInfo),
    addToQueueTime: Date.now(),
  })
  try {
    await installGame(toRaw(clonedParams), toRaw(clonedDownloadInfo))
  } catch (error: any) {
    toast.error('Error during installation: ' + error.message)
  } finally {
    isInstalling.value = false
  }
}

onMounted(async () => {
  const info = await window.api.getDMQueueInformation()
  QueueStore.updateAll({
    elements: info.elements,
    finished: info.finished,
    state: info.state,
  })

  DMQueueElements.value = QueueStore.getQueue().map(
    (item: DMQueueElement) => item.params.id as string,
  )
  DMFinished.value = QueueStore.getFinished().map(
    (item: DMQueueElement) => item.params.id as string,
  )
})
onUnmounted(() => {
 
  setLibrary(games.value)
  console.log('Library updated:', games.value);
  
})
</script>
