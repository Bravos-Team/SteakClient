<!-- GameInfoTabs.vue -->
<template>
  <div class="w-full h-full rounded-md p-2">
    <Card class="h-full p-0 bg-black/75 border-0 relative">
      <div class="absolute inset-0 z-5">
        <div class="w-full h-full grayscale-25 rounded-md relative">
          <div
            class="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-black rounded-md via-black/65 to-transparent"
          ></div>
        </div>
      </div>
      <Tabs default-value="install" class="w-full z-10">
        <TabsList
          class="flex flex-row gap-x-4 justify-between w-full border-b rounded-b-none border-gray-700"
        >
          <TabsTrigger
            value="install"
            class="py-4 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-[#00b8d4] data-[state=active]:text-[#00b8d4] text-gray-400"
          >
            <Info class="w-6 h-6 mr-1" />
            <span class="text-sm font-bold font-sans">INSTALL INFO</span>
          </TabsTrigger>
          <TabsTrigger
            value="extra"
            class="py-4 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-[#00b8d4] data-[state=active]:text-[#00b8d4] text-gray-400"
          >
            <Star class="w-6 h-6 mr-1" />
            <span class="text-sm font-bold font-sans">EXTRA INFO</span>
          </TabsTrigger>
          <TabsTrigger
            value="system"
            class="py-4 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-[#00b8d4] data-[state=active]:text-[#00b8d4] text-gray-400"
          >
            <TvMinimal class="w-6 h-6 mr-1" />
            <span class="text-sm font-bold font-sans">SYSTEM REQUIREMENTS</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="install">
          <InstallInfoTab :install-params="installParams" :DMFinished="DMFinished" />
        </TabsContent>
        <TabsContent value="extra">
          <ExtraInfoTab :install-params="installParams" />
        </TabsContent>
        <TabsContent value="system">
          <SystemRequirementsTab :install-params="installParams" />
        </TabsContent>
      </Tabs>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

import type { DMQueueElement, InstallParams } from '@/types/type'
import InstallInfoTab from './InstallInfoTab.vue'
import ExtraInfoTab from './ExtraInfoTab.vue'
import SystemRequirementsTab from './SystemRequirementsTab.vue'
import { Info, Star, TvMinimal } from 'lucide-vue-next'

defineProps<{
  installParams: InstallParams
  DMFinished: DMQueueElement 
}>()
</script>
