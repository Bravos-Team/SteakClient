<!-- GameInfoTabs.vue -->
<template>
  <div class="flex-1 rounded-md p-2">
    <Card class="h-full p-0 bg-black/25 border-0 relative">
      <div class="absolute inset-0 z-5">
        <div class="w-full h-full grayscale-25 rounded-md relative">
          <div
            class="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-black rounded-md via-black/95 to-transparent"
          ></div>
        </div>
      </div>
      <Tabs default-value="install" class="w-full z-10">
        <TabsList
          class="flex justify-between p-0 w-full h-10 border-b rounded-b-none border-gray-700"
        >
          <TabsTrigger
            value="install"
            class="px-4 flex-1 py-2 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-[#00b8d4] data-[state=active]:text-[#00b8d4] text-gray-400"
          >
            <Info class="w-6 h-6 mr-1" />
            <span class="text-sm font-bold font-sans">INSTALL INFO</span>
          </TabsTrigger>
          <TabsTrigger
            value="extra"
            class="px-4 flex-1 py-2 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-[#00b8d4] data-[state=active]:text-[#00b8d4] text-gray-400"
          >
            <Star class="w-6 h-6 mr-1" />
            <span class="text-sm font-bold font-sans">EXTRA INFO</span>
          </TabsTrigger>
          <TabsTrigger
            value="system"
            class="px-4 py-2 flex-1 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-[#00b8d4] data-[state=active]:text-[#00b8d4] text-gray-400"
          >
            <TvMinimal class="w-6 h-6 mr-1" />
            <span class="text-sm font-bold font-sans">SYSTEM REQUIREMENTS</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="install">
          <InstallInfoTab :install-params="installParams" />
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

import type { InstallParams } from '@/types/type'
import InstallInfoTab from './InstallInfoTab.vue'
import ExtraInfoTab from './ExtraInfoTab.vue'
import SystemRequirementsTab from './SystemRequirementsTab.vue'
import { Info, Star, TvMinimal } from 'lucide-vue-next'



defineProps<{
  installParams: InstallParams
}>()
</script>
