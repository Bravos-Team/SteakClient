<template>
  <div class="p-4">
    <h1 class="font-semibold text-3xl font-sans">Global Settings</h1>
    <div class="flex flex-col lg:flex-row gap-4">
      <div class="flex flex-col w-6/12 gap-4 mt-4 font-semibold">
        <h1 class="text-2xl">General</h1>
        <form class="space-y-6" @submit.prevent="onSubmit">
          <FormField name="language">
            <FormItem class="flex flex-col">
              <FormLabel>Choose App Language</FormLabel>
              <Combobox v-model="selectedLanguage" by="label">
                <FormControl class="w-1/2 bg-[#52525c]">
                  <ComboboxAnchor>
                    <div class="relative items-center h-12">
                      <ComboboxInput
                        class="text-lg font-semibold h-full rounded-2xl"
                        placeholder="Select a language"
                        :display-value="(val) => val?.label ?? ''"
                      />
                      <ComboboxTrigger
                        class="absolute end-0 inset-y-0 flex items-center justify-center px-3"
                      >
                        <ChevronsUpDownIcon class="size-4 text-muted-foreground" />
                      </ComboboxTrigger>
                    </div>
                  </ComboboxAnchor>
                </FormControl>
                <ComboboxList
                  :class="cn('w-full  min-w-[var(--reka-combobox-trigger-width)] max-w-full')"
                >
                  <ComboboxEmpty>
                    <span>No languages found.</span>
                  </ComboboxEmpty>
                  <ComboboxGroup class="w-full bg-[#52525c]/30">
                    <ComboboxItem
                      class="text-lg font-semibold"
                      v-for="lang in languages"
                      :key="lang.value"
                      :value="lang"
                    >
                      {{ lang.label }}
                      <ComboboxItemIndicator>
                        <Check :class="cn('ml-auto h-4 w-4')" />
                      </ComboboxItemIndicator>
                    </ComboboxItem>
                  </ComboboxGroup>
                </ComboboxList>
              </Combobox>
            </FormItem>
          </FormField>
          <FormField name="theme">
            <FormItem class="flex flex-col">
              <FormLabel>Choose App Theme</FormLabel>
              <Combobox v-model="selectedTheme" by="label">
                <FormControl class="w-1/2 bg-[#52525c]">
                  <ComboboxAnchor>
                    <div class="relative items-center h-12">
                      <ComboboxInput
                        class="text-lg font-semibold h-full"
                        placeholder="Select a language"
                        :display-value="(val) => val?.label ?? ''"
                      />
                      <ComboboxTrigger
                        class="absolute end-0 inset-y-0 flex items-center justify-center px-3"
                      >
                        <ChevronsUpDownIcon class="size-4 text-muted-foreground" />
                      </ComboboxTrigger>
                    </div>
                  </ComboboxAnchor>
                </FormControl>
                <ComboboxList
                  :class="cn('w-full min-w-[var(--reka-combobox-trigger-width)] max-w-full')"
                >
                  <ComboboxEmpty>
                    <span>No themes found.</span>
                  </ComboboxEmpty>
                  <ComboboxGroup class="w-full">
                    <ComboboxItem
                      class="text-lg font-semibold"
                      v-for="theme in themes"
                      :key="theme.value"
                      :value="theme"
                    >
                      {{ theme.label }}
                      <ComboboxItemIndicator>
                        <Check :class="cn('ml-auto h-4 w-4')" />
                      </ComboboxItemIndicator>
                    </ComboboxItem>
                  </ComboboxGroup>
                </ComboboxList>
              </Combobox>
            </FormItem>
          </FormField>
          <Button
            size="lg"
            type="submit"
            class="bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300"
          >
            Save Settings
          </Button>
        </form>
      </div>
      <div class="flex-1 flex-col">
        <h1 class="text-2xl font-bold">System Information</h1>
        <div class="flex flex-wrap items-stretch pt-2">
          <!-- Wifi Connection -->
          <div class="flex w-1/2 flex-col p-2 gap-1">
            <span class="text-lg font-semibold font-sans">Wifi Connection</span>
            <hr class="bg-white h-1" />
            <div
              class="flex flex-col gap-2 bg-[#52525c] rounded-lg shadow-md h-full p-2 hover:bg-[#52525c]/80 hover:scale-105 transition-all duration-300"
            >
              <span class="flex h-full justify-between items-center gap-2">
                <span class="flex items-center text-xl gap-4">
                  <img
                    src="../assets/image/icons8-online.gif"
                    class="h-full object-cover rounded-full"
                  />
                  <span :class="['text-lg font-semibold', ,]">
                    {{ systemInfo.wifi?.ssid || 'No WiFi' }}</span
                  >
                </span>
                <span class="flex items-center gap-2">
                  <component
                    :is="getWifiSignalInfo(systemInfo.wifi?.signalLevel)?.icon"
                    :class="[
                      'size-6',
                      `text-${getWifiSignalInfo(systemInfo.wifi?.signalLevel)?.color}-500`,
                    ]"
                  />
                  <span
                    :class="[
                      'text-lg font-semibold',
                      `text-${getWifiSignalInfo(systemInfo.wifi?.signalLevel)?.color}-500`,
                      'hidden 2xl:block',
                    ]"
                  >
                    {{ getWifiSignalInfo(systemInfo.wifi?.signalLevel)?.label }}
                  </span>
                </span>
              </span>
            </div>
          </div>
          <!-- Cpu -->
          <div v-if="systemInfo.cpu" class="flex w-1/2 flex-col p-2 gap-1">
            <span class="flex gap-2 text-lg font-semibold font-sans">CPU</span>
            <hr class="bg-white h-1" />
            <div
              class="flex flex-col gap-2 bg-[#52525c] rounded-lg shadow-md h-full p-2 hover:bg-[#52525c]/80 hover:scale-105 transition-all duration-300"
            >
              <span class="flex pr-4 gap-2">
                <span class="flex items-center font-bold gap-2">
                  <span v-if="systemInfo.cpu?.brand.includes('Intel')">
                    <img
                      src="../assets/image/intel_2120.ico"
                      class="max-h-16 max-w-16 rounded-md object-contain"
                    />
                  </span>
                  <span v-else>
                    <img
                      src="../assets/image/icons8-windows-11.svg"
                      class="max-h-16 max-w-16 rounded-full object-contain"
                    />
                  </span>
                  <div class="flex flex-col">
                    {{ systemInfo.cpu?.brand || 'N/A' }}
                    {{ systemInfo.cpu?.model || 'N/A' }}
                    <span class="text-sm text-gray-400">
                      {{ systemInfo.cpu?.cores || 'N/A' }} Cores
                      <!-- {{ systemInfo.cpu?.threads || 'N/A' }} Threads -->
                      {{ systemInfo.cpu?.speed || 'N/A' }} GHz
                    </span>
                  </div>
                </span>
              </span>
            </div>
          </div>
          <!-- Operating System -->
          <div v-if="systemInfo.os" class="flex w-1/2 flex-col p-2 gap-1">
            <span class="flex gap-2 text-lg font-semibold font-sans">Operating System</span>
            <hr class="bg-white h-1" />
            <div
              class="flex flex-col gap-2 bg-[#52525c] rounded-lg shadow-md h-full p-2 hover:bg-[#52525c]/80 hover:scale-105 transition-all duration-300"
            >
              <span class="flex pr-4 gap-2">
                <span class="flex items-center font-bold gap-2">
                  <span v-if="systemInfo.os?.platform === 'linux'">
                    <img
                      src="../assets/image/icons8-linux.gif"
                      class="max-h-16 max-w-16 rounded-full object-contain"
                    />
                  </span>
                  <span v-else>
                    <img
                      src="../assets/image/icons8-windows-11.svg"
                      class="max-h-16 max-w-16 rounded-full object-contain"
                    />
                  </span>
                  <div class="flex flex-col"></div>
                  {{ systemInfo.os?.distro || 'N/A' }}
                  {{ systemInfo.os?.release || 'N/A' }}
                  ( {{ systemInfo.os?.codename.toLocaleUpperCase() || 'N/A' }} )
                </span>
              </span>
            </div>
          </div>
          <!-- Memory -->
          <div v-if="systemInfo.memory" class="flex w-1/2 flex-col p-2 gap-1">
            <span class="flex gap-2 text-lg font-semibold font-sans">Memory</span>
            <hr class="bg-white h-1" />
            <div
              class="flex flex-col gap-2 bg-[#52525c] rounded-lg shadow-md h-full p-2 hover:bg-[#52525c]/80 hover:scale-105 transition-all duration-300"
            >
              <span class="flex pr-4 gap-2">
                <span class="flex w-full items-center font-bold gap-2">
                  <span>
                    <img
                      src="../assets/image/memory-card-icon_30365.ico"
                      class="max-h-16 max-w-16 rounded-md object-contain"
                    />
                  </span>

                  <div class="flex w-full flex-col">
                    <!-- Progress Bar -->
                    <div class="w-full bg-gray-300 rounded-full h-2">
                      <div
                        class="bg-green-500 h-2 rounded-full transition-all duration-300"
                        :style="{
                          width: `${((1 - systemInfo.memory?.available / systemInfo.memory?.total) * 100).toFixed(1)}%`,
                        }"
                      ></div>
                      <span class="text-sm text-gray-400">
                        {{
                          (
                            (1 - systemInfo.memory?.available / systemInfo.memory?.total) *
                            100
                          ).toFixed(1)
                        }}% ({{
                          formatSize(systemInfo.memory?.total - systemInfo.memory?.available || 0)
                        }}
                        /
                        {{ formatSize(systemInfo.memory?.total || 0) }})
                      </span>
                    </div>
                  </div>
                </span>
              </span>
            </div>
          </div>
          <!-- Gpu -->
          <div
            v-if="systemInfo.gpu && systemInfo.gpu.length > 0"
            v-for="(gpu, index) in systemInfo.gpu"
            :key="index"
            class="flex w-1/2 flex-col p-2 gap-1"
          >
            <span class="flex gap-2 text-lg font-semibold font-sans">GPU {{ index + 1 }}</span>
            <hr class="bg-white h-1" />
            <div
              class="flex flex-col gap-2 bg-[#52525c] rounded-lg shadow-md h-full p-2 hover:bg-[#52525c]/80 hover:scale-105 transition-all duration-300"
            >
              <span class="flex pr-4 gap-2">
                <span class="flex items-center font-bold gap-2">
                  <span v-if="gpu.vendor.includes('Intel')">
                    <img
                      src="../assets/image/intel_2120.ico"
                      class="max-h-16 max-w-16 rounded-md object-contain"
                    />
                  </span>
                  <span v-else-if="gpu.vendor.includes('NVIDIA')">
                    <img
                      src="../assets/image/nvidia_settings_22459.png"
                      class="max-h-16 max-w-16 rounded-md object-contain"
                    />
                  </span>
                  <div class="flex flex-col">
                    {{ gpu.model || 'N/A' }}
                    <span class="text-sm text-gray-400">
                      {{ gpu.vendor || 'N/A' }} - {{ gpu.vram || 'N/A' }} GB
                    </span>
                  </div>
                </span>
              </span>
            </div>
          </div>
          <!-- Disk -->
          <div
            v-if="systemInfo.storage"
            v-for="(disk, index) in systemInfo.storage"
            :key="index"
            class="flex w-1/2 flex-col p-2 gap-1"
          >
            <span class="flex gap-2 text-lg font-semibold font-sans"
              >Disk ( {{ disk.mount }} )</span
            >
            <hr class="bg-white h-1" />
            <div
              class="flex flex-col gap-2 bg-[#52525c] rounded-lg shadow-md h-full p-2 hover:bg-[#52525c]/80 hover:scale-105 transition-all duration-300"
            >
              <span class="flex pr-4 gap-2">
                <span class="flex w-full items-center font-bold gap-2">
                  <span>
                    <img
                      src="../assets/image/save_78348.ico"
                      class="max-h-16 max-w-16 rounded-md object-contain"
                    />
                  </span>

                  <div class="flex w-full flex-col">
                    <!-- Progress Bar -->
                    <div class="w-full bg-gray-300 rounded-full h-2">
                      <div
                        class="bg-green-500 h-2 rounded-full transition-all duration-300"
                        :style="{
                          width: `${((1 - disk.available / disk.size) * 100).toFixed(1)}%`,
                        }"
                      ></div>
                      <span class="text-sm text-gray-400">
                        {{ ((1 - disk.available / disk.size) * 100).toFixed(1) }}% ({{
                          formatSize(disk.size - disk.available || 0)
                        }}
                        /
                        {{ formatSize(disk.size || 0) }})
                      </span>
                    </div>
                  </div>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Button } from '@/components/ui/button'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger,
} from '@/components/ui/combobox'
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { useSystemIpc } from '@/composables/useSystemIpc'
import { cn } from '@/libs/utils'
import { useSystemInfo } from '@/stores/util'
import { SystemInfo } from '@/types/type'
import {
  Check,
  ChevronsUpDown,
  ChevronsUpDownIcon,
  HouseWifi,
  LucideIcon,
  Waypoints,
  Wifi,
  WifiHigh,
  WifiLow,
  WifiOff,
  WifiZero,
} from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'
const systemStore = useSystemInfo()
const languages = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
] as const
const themes = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System Default', value: 'system' },
] as const
const selectedLanguage = ref(languages[0]) // Giá trị mặc định là English
const selectedTheme = ref(themes[0]) // Giá trị mặc định là Light
const onSubmit = () => {
  toast.success('Settings saved successfully!')
  console.log('Selected Language:', selectedLanguage.value)
  console.log('Selected Theme:', selectedTheme.value)
  // Here you would typically handle the form submission, e.g., sending data to an API
}

const systemInfo = ref<SystemInfo>({} as SystemInfo)

function formatSize(bytes: number): string {
  if (bytes >= 1024 ** 4) return (bytes / 1024 ** 4).toFixed(2) + ' TB'
  if (bytes >= 1024 ** 3) return (bytes / 1024 ** 3).toFixed(2) + ' GB'
  if (bytes >= 1024 ** 2) return (bytes / 1024 ** 2).toFixed(2) + ' MB'
  if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return bytes + ' B'
}
const statusSignalWifi = [
  {
    threshold: -50,
    color: 'green',
    icon: Wifi,
    label: 'Excellent',
  },
  {
    threshold: -65,
    color: 'green',
    icon: WifiHigh,
    label: 'Good',
  },
  {
    threshold: -70,
    color: 'yellow',
    icon: WifiLow,
    label: 'Fair',
  },
  {
    threshold: -90,
    color: 'red',
    icon: WifiZero,
    label: 'Poor',
  },
  {
    threshold: -100,
    color: 'gray',
    icon: WifiOff,
    label: 'No Signal',
  },
]

const getWifiSignalInfo = (dbm: number | null | undefined) => {
  if (dbm == null || isNaN(dbm)) return statusSignalWifi.at(-1) // No Signal
  return statusSignalWifi.find((s) => dbm >= s.threshold) ?? statusSignalWifi.at(-1)!
}

onMounted(async () => {
  await useSystemIpc()
  systemInfo.value = systemStore.getSystemInfo() as SystemInfo
  console.log('System Information:', systemInfo.value)
  const totalMemory = formatSize(systemInfo.value.memory?.total || 0)
  const freeMemory = formatSize(systemInfo.value.memory?.free || 0)
  const usedMemory = formatSize(systemInfo.value.memory?.available || 0)
  console.log(
    `Total Memory: ${totalMemory}, Free Memory: ${freeMemory}, Used Memory: ${usedMemory}`,
  )
})
</script>
