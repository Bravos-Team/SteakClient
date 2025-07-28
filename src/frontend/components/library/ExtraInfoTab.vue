<!-- ExtraInfoTab.vue -->
<template>
  <div class="space-y-4 mt-6 px-4 font-semibold text-white/75">
    <div class="flex items-start justify-between">
      <div class="flex items-center">
        <Building2 class="w-6 h-6 mr-2" />
        <span class="text-[#00b8d4] min-w-[120px]">Publisher:</span>
      </div>
      <span class="text-right">{{ installParams.gameInfo.publisherName || 'Unknown' }}</span>
    </div>
    <div class="border-b border-gray-700 my-4"></div>
    <div class="flex items-start justify-between">
      <div class="flex items-center">
        <Users class="w-6 h-6 mr-2" />
        <span class="text-[#00b8d4] min-w-[120px]">Developers:</span>
      </div>
      <span class="text-right">{{ installParams.gameInfo.details.developersTeams.join(', ') }}</span>
    </div>
    <div class="border-b border-gray-700 my-4"></div>
    <div class="flex items-start justify-between">
      <div class="flex items-center">
        <Rocket class="w-6 h-6 mr-2" />
        <span class="text-[#00b8d4] min-w-[120px]">Release Date:</span>
      </div>
      <span class="text-right">{{ convertTimestampToDate(installParams.gameInfo.details.updatedAt || 0) }}</span>
    </div>
    <div class="border-b border-gray-700 my-4"></div>
    <div class="flex items-start justify-between">
      <div class="flex items-start">
        <MonitorCog class="w-6 h-6 mr-2" />
        <span class="text-[#00b8d4] min-w-[120px]">Platforms:</span>
      </div>
      <div class="text-right">
        <span v-if="installParams.gameInfo.details.platforms?.length">
          {{ installParams.gameInfo.details.platforms.join(', ') }}
        </span>
        <span v-else>Unknown</span>
      </div>
    </div>
    <div class="border-b border-gray-700 my-4"></div>
    <div class="flex items-start justify-between">
      <div class="flex items-start">
        <Globe class="w-6 h-6 mr-2" />
        <span class="text-[#00b8d4] min-w-[120px]">Regions:</span>
      </div>
      <div class="text-right">
        <span v-if="installParams.gameInfo.details.regions?.length">
          {{ installParams.gameInfo.details.regions.join(', ') }}
        </span>
        <span v-else>Unknown</span>
      </div>
    </div>
    <div class="border-b border-gray-700 my-4"></div>
    <div class="flex items-start justify-between">
      <div class="flex items-start">
        <Languages class="w-6 h-6 mr-2" />
        <span class="text-[#00b8d4] min-w-[120px]">Language Supported:</span>
      </div>
      <div class="text-right">
        <span v-if="installParams.gameInfo.details.languageSupported?.length">
          {{ installParams.gameInfo.details.languageSupported?.join(', ') }}
        </span>
        <span v-else>Unknown</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Building2, Users, Rocket, MonitorCog, Globe, Languages } from 'lucide-vue-next'
import type { InstallParams } from '@/types/type'

defineProps<{
  installParams: InstallParams
}>()

const convertTimestampToDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
</script>