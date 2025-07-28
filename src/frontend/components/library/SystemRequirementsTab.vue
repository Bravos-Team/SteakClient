<!-- SystemRequirementsTab.vue -->
<template>
  <div class="mt-6 px-4 text-white/75">
    <div class="grid grid-cols-2 gap-4">
      <div class="text-center mb-4">
        <h3 class="text-[#00b8d4] font-medium">MINIMUM</h3>
      </div>
      <div class="text-center mb-4">
        <h3 class="text-[#00b8d4] font-medium">RECOMMENDED</h3>
      </div>
      <div class="flex items-start flex-col">
        <span class="text-[#00b8d4] text-sm">OS:</span>
        <span>{{
          installParams.gameInfo.details.systemRequirements?.minimum?.osVersion || 'N/A'
        }}</span>
      </div>
      <div class="flex items-start flex-col">
        <span class="text-[#00b8d4] text-sm hidden sm:inline">&nbsp;</span>
        <span>{{
          installParams.gameInfo.details.systemRequirements?.recommend?.osVersion || 'N/A'
        }}</span>
      </div>
      <div class="flex items-start flex-col">
        <span class="text-[#00b8d4] text-sm">PROCESSOR:</span>
        <span>{{ installParams.gameInfo.details.systemRequirements?.minimum?.cpu || 'N/A' }}</span>
      </div>
      <div class="flex items-start flex-col">
        <span class="text-[#00b8d4] text-sm hidden sm:inline">&nbsp;</span>
        <span>{{
          installParams.gameInfo.details.systemRequirements?.recommend?.cpu || 'N/A'
        }}</span>
      </div>
      <div class="flex items-start flex-col">
        <span class="text-[#00b8d4] text-sm">MEMORY:</span>
        <span>{{
          installParams.gameInfo.details.systemRequirements?.minimum?.memory || 'N/A'
        }}</span>
      </div>
      <div class="flex items-start flex-col">
        <span class="text-[#00b8d4] text-sm hidden sm:inline">&nbsp;</span>
        <span>{{
          installParams.gameInfo.details.systemRequirements?.recommend?.memory || 'N/A'
        }}</span>
      </div>
      <div class="flex items-start flex-col">
        <span class="text-[#00b8d4] text-sm">STORAGE:</span>
        <span>{{
          installParams.gameInfo.details.systemRequirements?.minimum?.storage || 'N/A'
        }}</span>
      </div>
      <div class="flex items-start flex-col">
        <span class="text-[#00b8d4] text-sm hidden sm:inline">&nbsp;</span>
        <span>{{
          installParams.gameInfo.details.systemRequirements?.recommend?.storage || 'N/A'
        }}</span>
      </div>
      <div class="flex items-start flex-col">
        <span class="text-[#00b8d4] text-sm">DIRECT X:</span>
        <span>{{
          installParams.gameInfo.details.systemRequirements?.minimum?.directX || 'N/A'
        }}</span>
      </div>
      <div class="flex items-start flex-col">
        <span class="text-[#00b8d4] text-sm hidden sm:inline">&nbsp;</span>
        <span>{{
          installParams.gameInfo.details.systemRequirements?.recommend?.directX || 'N/A'
        }}</span>
      </div>
      <div class="flex items-start flex-col">
        <span class="text-[#00b8d4] text-sm">GRAPHICS:</span>
        <span>{{ installParams.gameInfo.details.systemRequirements?.minimum?.gpu || 'N/A' }}</span>
      </div>
      <div class="flex items-start flex-col">
        <span class="text-[#00b8d4] text-sm hidden sm:inline">&nbsp;</span>
        <span>{{
          installParams.gameInfo.details.systemRequirements?.recommend?.gpu || 'N/A'
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { InstallParams } from '@/types/type'

defineProps<{
  installParams: InstallParams
}>()
</script>
