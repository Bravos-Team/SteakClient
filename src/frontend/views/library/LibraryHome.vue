<template>
  <Dialog>
    <div class="flex mb-3">
      <div class="ml-4 w-full max-w-[500px]">
        <ComboboxSearch />
      </div>
    </div>
    <div class="w-full flex flex-1 flex-col h-full p-4 overflow-y-hidden">
      <div class="grid auto-rows-min gap-4 md:grid-cols-8">
        <div
          class="group/game transition-transform duration-300 hover:scale-105 flex flex-col aspect-[3/4] rounded-sm bg-muted/50 relative"
        >
          <!-- Ảnh nền -->
          <img
            class="grayscale group-hover/game:grayscale-0 transition-all h-5/6 w-full rounded-sm object-cover"
            src="https://cdn2.unrealengine.com/fortnite-blitz-royale-1920x1080-9946411a3a9f.jpg?resize=1&w=1920"
            alt=""
          />
          <div
            class="absolute bottom-10 left-0 flex items-center right-0 bg-[#202024]/30 backdrop-blur-sm text-white p-2 rounded-b-sm opacity-0 group-hover/game:opacity-100 group-hover/game:translate-y-0 translate-y-4 transition-all duration-300"
          >
            <h1 class="font-serif text-lg">Fortnite Blitz Royale</h1>
          </div>
          <div
            class="relative flex justify-between items-center h-2/12 bg-[#202024] w-full rounded-b-sm px-4"
          >
            <!-- Icon giữa -->
            <button
              @click="saveGame"
              class="absolute left-1/2 -translate-x-1/2 p-3 rounded-full bg-white/10 hover:bg-blue-500 transition-all backdrop-blur-sm shadow-lg hover:scale-105"
            >
              <ArrowDownToLine class="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        <div
          class="group/game transition-transform duration-300 hover:scale-105 flex flex-col aspect-[3/4] rounded-sm bg-muted/50 relative"
        >
          <img
            class="group-hover/game:grayscale-0 transition-all h-5/6 w-full rounded-sm object-cover"
            src="../../assets/image/backmythwukong.jpg"
            alt=""
          />
          <div
            class="absolute bottom-10 left-0 flex items-center right-0 bg-[#202024]/30 backdrop-blur-sm text-white p-2 rounded-b-sm opacity-0 group-hover/game:opacity-100 group-hover/game:translate-y-0 translate-y-4 transition-all duration-300"
          >
            <h1 class="font-serif text-lg">Black Myth: Wukong</h1>
          </div>
          <div
            class="relative flex justify-between items-center h-2/12 bg-[#202024] w-full rounded-b-sm px-4"
          >
            <!-- Icon trái -->
            <button
              class="p-2 rounded-full bg-white/10 hover:bg-red-600 transition-all backdrop-blur-sm shadow hover:scale-105"
            >
              <Trash2 class="w-4 h-4 text-white" />
            </button>

            <!-- Icon giữa -->
            <DialogTrigger
              as-child
              class="absolute left-1/2 -translate-x-1/2 p-3 rounded-full bg-white/10 hover:bg-green-600 transition-all backdrop-blur-sm shadow-lg hover:scale-105"
            >
              <button>
                <Play @click="installGameWukong" class="w-5 h-5 text-white" />
              </button>
            </DialogTrigger>
            <!-- Icon phải -->
            <button
              class="p-2 rounded-full bg-white/10 hover:bg-blue-500 transition-all backdrop-blur-sm shadow hover:scale-105"
            >
              <SlidersHorizontal class="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
        <div
          class="group/game transition-transform duration-300 hover:scale-105 flex flex-col aspect-[3/4] rounded-sm bg-muted/50 relative"
        >
          <img
            class="group-hover/game:grayscale-0 transition-all h-5/6 w-full rounded-sm object-cover"
            src="../../assets/image/elderring.webp"
            alt=""
          />
          <div
            class="absolute bottom-10 left-0 flex items-center right-0 bg-[#202024]/30 backdrop-blur-sm text-white p-2 rounded-b-sm opacity-0 group-hover/game:opacity-100 group-hover/game:translate-y-0 translate-y-4 transition-all duration-300"
          >
            <h1 class="font-serif text-lg">Elden Ring</h1>
          </div>
          <div
            class="relative flex justify-between items-center h-2/12 bg-[#202024] w-full rounded-b-sm px-4"
          >
            <!-- Icon trái -->
            <button
              class="p-2 rounded-full bg-white/10 hover:bg-red-600 transition-all backdrop-blur-sm shadow hover:scale-105"
            >
              <Trash2 class="w-4 h-4 text-white" />
            </button>

            <!-- Icon giữa -->
            <DialogTrigger
              as-child
              class="absolute left-1/2 -translate-x-1/2 p-3 rounded-full bg-white/10 hover:bg-green-600 transition-all backdrop-blur-sm shadow-lg hover:scale-105"
            >
              <button>
                <Play @click="installGameElderRing" class="w-5 h-5 text-white" />
              </button>
            </DialogTrigger>
            <!-- Icon phải -->
            <button
              class="p-2 rounded-full bg-white/10 hover:bg-blue-500 transition-all backdrop-blur-sm shadow hover:scale-105"
            >
              <SlidersHorizontal class="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <DialogContent class="sm:max-w-[750px] p-8">
      <DialogHeader>
        <DialogTitle class="flex gap-8 font-semibold items-center text-3xl"
          >Black Myth: Wukong <AppWindow class="w-6 h-6" />
        </DialogTitle>
        <DialogDescription class="my-2">
          <span class="flex items-center gap-4">
            <Download class="w-8 h-8" />
            <span class="flex flex-col">
              <span class="text-lg font-semibold">Download Size</span>
              <span class="text-sm text-muted-foreground"> 500.123 MB </span>
            </span>

            <CircleDot class="w-8 h-8" />
            <span class="flex flex-col">
              <span class="text-lg font-semibold">Version</span>
              <span class="text-sm text-muted-foreground"> 1.0.0 </span>
            </span>
          </span>
        </DialogDescription>
      </DialogHeader>
      <div class="flex flex-col gap-4">
        <AlertTitle>Select Install Path :</AlertTitle>
        <AlertDescription class="flex flex-col gap-2">
          <span class="flex items-center w-full">
            <Input class="px-4 h-12 text-lg rounded-r-none" defaultValue="/home/tvt/Games/Heroic" />
            <!-- <input type="text" class="w-full bg-white/10 border-2 border-gray-500 rounded-sm h-12 outline-0 focus:outline-1 out"/> -->
            <button
              @click="openFolder"
              class="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-blue-500 transition-all backdrop-blur-sm shadow-lg rounded-r-md"
            >
              <Folder class="w-6 h-6" />
            </button>
          </span>
          <span>
            Space available: <span class="text-green-500 font-semibold"> 1.2 TB</span> /
            <span class="text-red-500 font-semibold"> 2.0 TB</span> - After installing this game,
            you will have:
            <span class="text-red-500 font-semibold"> 1.5 TB</span>
          </span>
        </AlertDescription>
      </div>
      <DialogFooter class="flex mt-12 gap-2 justify-end">
        <Button variant="outline" class="w-32 h-12 text-lg hover:text-blue-500">
          Import Save
        </Button>
        <Button
          @click="installWukong"
          variant="default"
          class="w-32 h-12 text-lg hover:bg-green-500"
        >
          Install
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
<script lang="ts" setup>
import ComboboxSearch from '@/components/ComboboxSearch.vue'
import Alert from '@/components/ui/alert/Alert.vue'
import AlertDescription from '@/components/ui/alert/AlertDescription.vue'
import AlertTitle from '@/components/ui/alert/AlertTitle.vue'
const visible = ref(false)
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/libs/utils'
import { InstallParams } from '@/types/type'
import {
  Play,
  Trash2,
  SlidersHorizontal,
  ArrowDownToLine,
  Download,
  AppWindow,
  CircleDot,
  Folder,
} from 'lucide-vue-next'
import { onMounted, reactive, ref, toRaw } from 'vue'

import { toast } from 'vue-sonner'

async function saveGame() {
  const fileName = await window.electronAPI.openFile()
  console.log(fileName)
}
async function openFolder() {
  const folderPath = await window.api.openFolder()
  if (folderPath) {
    toast.success(`Opened folder: ${folderPath}`)
  } else {
    toast.error('Failed to open folder')
  }
}
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
const installGameWukong = async () => {
  installInfo.appName = 'Wukong'
  installInfo.path = '/path/to/Wukong'
  installInfo.gameInfo = {
    app_name: 'Wukong',
    install: {
      executable: 'wukong.exe',
      install_path: '/path/to/wukong',
      install_size: '5000000000',
    },
    installable: true,
    is_installed: false,
    title: 'Wukong',
  }

  console.log('installInfo:', installInfo)
}

const installGameElderRing = async () => {
  installInfo.appName = 'elden-ring'
  installInfo.path = '/path/to/elden-ring'
  installInfo.gameInfo.app_name = 'elden-ring'
  installInfo.gameInfo.install.executable = 'elden-ring.exe'
  installInfo.gameInfo.install.install_path = '/path/to/elden-ring'
  installInfo.gameInfo.install.install_size = '5000000000' // 5 GB
  installInfo.gameInfo.installable = true
  installInfo.gameInfo.is_installed = false
  installInfo.gameInfo.title = 'Elden Ring'
  console.log('installInfo:', installInfo)
}

const installWukong = async () => {
  console.log('Installing Wukong with info:', installInfo)

  try {
    await window.api.install(toRaw(installInfo) )
    toast.success(`Installing ${installInfo.gameInfo.title}...`)
  } catch (error) {
    console.error('Installation failed:', error)
    toast.error(`Failed to install ${installInfo.gameInfo.title}`)
  }
}
</script>
