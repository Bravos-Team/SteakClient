I
<template>
  <Dialog v-model:open="isDialogOpen">
    <div
      v-if="installParamsInfo?.gameInfo?.details && !isGameInfoFetching"
      class="flex w-full h-full relative z-10"
    >
      <div
        class="absolute inset-0 max-h-[100rem] min-w-full bg-cover bg-center blur-xs z-0 2xl:block md:hidden"
        :style="{
          background: `url(${showBgUrl(installParamsInfo?.gameInfo?.details?.thumbnail)}) no-repeat center center / cover`,
        }"
      ></div>

      <div
        class="absolute inset-0 max-h-[200rem] min-h-[110rem] min-w-full bg-cover bg-center blur-xs z-0 md:block 2xl:hidden"
        :style="{
          background: `url(${showBgUrl(installParamsInfo?.gameInfo?.details?.thumbnail)}) no-repeat center center / cover`,
        }"
      ></div>
      <div class="absolute top-6 left-6 z-20">
        <Button
          @click="routeBackToLibrary"
          class="p- w-12 h-auto min-w-0 bg-[#1a1b1e] hover:bg-[#00a0bc] text-white rounded-md"
        >
          <ArrowLeft class="h-5 w-5" />
        </Button>
      </div>

      <div
        class="w-full h-full py-[5rem] m-auto flex 2xl:px-[2rem] px-0 sm:px-[1rem] flex-wrap 2xl:flex-nowrap gap-2"
      >
        <GameDetailHeader
          :game-info="installParamsInfo.gameInfo"
          :install-params="installParamsInfo"
          :last-played-at="lastPlayedAt"
          :play-seconds="playSeconds"
          @install="handleInstall"
        />
        <div class="w-full h-full 2xl:basis-6/12">
          <GameInfoTabs :install-params="installParamsInfo" :DMFinished="DMFinished" />
        </div>
      </div>
    </div>
    <InstallDialog
      v-if="isDialogOpen"
      :installParams="installParamsInfo"
      @open-folder="handleOpenFolder"
      @install="install"
      :is-installing="isInstalling"
      :is-fetching="false"
      :capacity-disks="capacityDisks"
    />
  </Dialog>
</template>
<script setup lang="ts">
import { nextTick, onBeforeMount, onMounted, ref, toRaw, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGetGameInfo, useGetGameDownloadInfo } from '@/hooks/library/useMyLibrary'
import type { DMQueueElement, DownloadInfo, InstallParams } from '@/types/type'
import GameDetailHeader from '../../components/library/GameDetailHeader.vue'
import { Dialog } from '@/components/ui/dialog'
import GameInfoTabs from '../../components/library/GameInfoTabs.vue'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-vue-next'
import InstallDialog from '@/components/library/InstallDialog.vue'
import { useGameLibrary } from '@/composables/useGameLibraryIpc'
import { toast } from 'vue-sonner'
import { useDownloadQueueStore } from '@/stores/download/useDownloadStore'
import { useSystemIpc } from '@/composables/useSystemIpc'
import { useSystemInfo } from '@/stores/util'
import { useLibraryStore } from '@/stores/library/useLibrary'
const LibraryStoreIpc = useGameLibrary()
const LibraryStore = useLibraryStore()
const QueueStore = useDownloadQueueStore()
const route = useRoute()
const {
  data: gameInfo,
  isFetching: isGameInfoFetching,
  refetch: refetchGameInfo,
} = useGetGameInfo(route.params.id as string)
const lastPlayedAt = ref(0)
const playSeconds = ref(0)
console.log('Game ID:', route.params.id)
console.log('Last Played At:', lastPlayedAt.value)
const DMFinished = ref<DMQueueElement>({} as DMQueueElement)

const {
  data: downloadParams,
  isFetching: isDownloadParamsFetching,
  refetch: refetchDownloadParams,
} = useGetGameDownloadInfo(route.params.id as string)

const router = useRouter()
const installParamsInfo = ref<InstallParams>({ ...gameInfo.value } as InstallParams)
const downloadParamsInfo = ref<DownloadInfo>({ ...downloadParams.value } as DownloadInfo)
const capacityDisks = ref<{ totalSize: number; freeSize: number; remaining: number }>({
  totalSize: 0,
  freeSize: 0,
  remaining: 0,
})
const isDialogOpen = ref(false)
const isInstalling = ref(false)
const isFetching = ref(false)

const routeBackToLibrary = () => {
  router.push('/library')
}

const { saveGame, openFolder, installGame } = LibraryStoreIpc
const handleOpenFolder = async () => {
  const folderPath = await openFolder()
  checkCapacity(folderPath)
  installParamsInfo.value.path = folderPath
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
  await useSystemIpc()
  const systemInfoStore = useSystemInfo()
  const systemInfo = systemInfoStore.getSystemInfo()
  const totalSize = systemInfo?.storage?.[0]?.size || 0
  const freeSize = systemInfo?.storage?.[0]?.available || 0

  if (!installParamsInfo.value.installSize) {
    installParamsInfo.value.installSize = 0
  }
  if (freeSize < installParamsInfo.value.installSize) {
    toast.error('Not enough space to install the game.')
    return
  }
  capacityDisks.value = {
    totalSize,
    freeSize,
    remaining: freeSize - installParamsInfo.value.installSize,
  }
}
const handleInstall = async (Id: string) => {
  console.log(installParamsInfo.value)
  if (await fetchGameData()) {
    isDialogOpen.value = true
  } else {
    // toast.error('Unable to find game information or download information.')
  }
}

const fetchGameData = async () => {
  if (installParamsInfo.value.gameInfo) {
    isFetching.value = true
    if (!installParamsInfo.value.gameInfo || !downloadParamsInfo.value) {
      toast.error('Unable to find game information or download information.')
      return
    }
    installParamsInfo.value.appName = gameInfo.value.details.id
    installParamsInfo.value.path = ''
    console.log(downloadParamsInfo.value)

    installParamsInfo.value.installSize = downloadParamsInfo.value?.installSize || 0
    isFetching.value = false
    return true
  } else {
    return false
  }
}

const showBgUrl = (url: string) => {
  return url ? url : 'https://ccdn.steak.io.vn/logo_steak.svg'
}
const install = async (params: InstallParams) => {
  if (!params.path) {
    toast.error('Please select an installation path')
    return
  }
  const clonedParams = JSON.parse(JSON.stringify(params))
  const clonedDownloadInfo = JSON.parse(JSON.stringify(downloadParams.value))
  isInstalling.value = true
  isDialogOpen.value = false

  QueueStore.addToQueue({
    type: 'install',
    params: toRaw(params),
    downloadInfo: toRaw(clonedDownloadInfo),
    addToQueueTime: Date.now(),
  })
  try {
    await installGame(toRaw(clonedParams), toRaw(clonedDownloadInfo))
    toast.success(`Installed game ${params.gameInfo.details.title} successfully!`)
  } catch (error: any) {
    toast.error('Error during installation: ' + error.message)
  } finally {
    isInstalling.value = false
  }
}

onBeforeMount(async () => {
  await nextTick()
  await refetchGameInfo()
  await refetchDownloadParams()
  installParamsInfo.value.gameInfo = { ...gameInfo.value }
  downloadParamsInfo.value = { ...downloadParams.value }
  installParamsInfo.value.size = downloadParams.value?.fileSize || 0
  installParamsInfo.value.installSize = downloadParams.value?.installSize || 0
})
onMounted(async () => {
  const info = await window.api.getDMQueueInformation()
  QueueStore.updateAll({
    elements: info.elements,
    finished: info.finished,
    state: info.state,
  })
  DMFinished.value =
    QueueStore.getFinished().find((el) => el.params.appName.toString() === route.params.id) ||
    ({} as DMQueueElement)
  // const rowTime =  new Date().getTime() -
  const gameLibrary = LibraryStore.getLibrary().find(
    (game) => game.gameId.toString() === route.params.id,
  )
  if (gameLibrary) {
    const lastPlayAt = gameLibrary.lastPlayedAt || 0

    const lastPlayedTime = new Date(lastPlayAt).getTime()
    const diffMs = Date.now() - lastPlayedTime // chênh lệch theo ms
    lastPlayedAt.value = new Date(diffMs).getTime()
    if (lastPlayAt === 0) {
      lastPlayedAt.value = 0
    }
    const playSecs = gameLibrary.playSeconds || 0
    console.log(playSecs)

    playSeconds.value = playSecs ? playSecs : 0
    console.log('lastPlayedAt.value:', lastPlayedAt.value)
  }
})
</script>
