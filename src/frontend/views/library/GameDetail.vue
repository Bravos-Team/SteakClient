<script setup lang="ts">
import { ref, onMounted, reactive, computed, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  Download,
  Info,
  Star,
  TvMinimal,
  ArrowLeft,
  CloudDownload,
  FolderDown,
  MonitorCog,
  CircleDot,
  Wifi,
  Cable,
  Building2,
  Users,
  Rocket,
  Languages,
  Globe,
} from 'lucide-vue-next'
import { useGameDetails, useGameDownloadInfo } from '@/composables/useGameDetail'
import { useGetGameDownloadInfo } from '@/stores/library/useMyLibrary'
import { Dialog } from '@/components/ui/dialog'
const route = useRoute()
const router = useRouter()
const gameId = route.params.id as string

// Route back to library
const routeBackToLibrary = () => {
  router.push('/library')
}
const { InstallParamsInfo, isSuccess, isLoading, isError } = useGameDetails(gameId)
// InstallParamsInfo.size = downloadParams.fileSize || 0
// InstallParamsInfo.installSize = downloadParams.installSize || 0
const convertTimestampToDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
function formatSize(bytes: number): string {
  if (bytes >= 1024 ** 3) return (bytes / 1024 ** 3).toFixed(2) + ' GB'
  if (bytes >= 1024 ** 2) return (bytes / 1024 ** 2).toFixed(2) + ' MB'
  if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return bytes + ' B'
}
</script>
I

<template>
  <Dialog>
    <div class="flex w-full h-full relative">
      <!-- Back button -->
      <img
        :src="InstallParamsInfo.gameInfo.details.thumbnail"
        :alt="InstallParamsInfo.appName"
        class="w-full h-full object-cover absolute z-0 opacity-50 blur-sm rounded-t-md"
      />
      <div class="absolute inset-0 bg-black/50 z-10"></div>
      <div class="absolute top-6 left-6 z-20">
        <Button
          @click="routeBackToLibrary"
          class="p- w-12 h-auto min-w-0 bg-[#1a1b1e] hover:bg-[#00a0bc] text-white rounded-md"
        >
          <ArrowLeft class="h-5 w-5" />
        </Button>
      </div>

      <div class="min-w-[1600px] h-4/5 m-auto flex gap-2">
        <div class="w-8/12 h-full p-2 gap-4">
          <Card class="h-full p-0 gap-2 border-0 bg-[#1a1b1e] relative">
            <div class="absolute top-4 left-4 z-10 bg-[#1a1b1e] p-2 rounded-md">
              <img
                src="https://ccdn.steak.io.vn/logo_steak.svg"
                alt="Platform Logo"
                class="w-6 h-6 object-cover"
              />
            </div>
            <div class="absolute inset-0 z-5">
              <div class="w-full h-full grayscale-25 relative">
                <img
                  :src="InstallParamsInfo.gameInfo.details.thumbnail"
                  :alt="InstallParamsInfo.appName"
                  class="w-full h-full object-cover rounded-md"
                />
                <div
                  class="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-black via-black/95 rounded-md to-transparent"
                ></div>
              </div>
            </div>
            <div class="absolute w-full top-3/5 -translate-y-1/2 z-10">
              <!-- <div class="w-full h-[400px] p-4"></div> -->

              <div class="px-12 pt-2">
                <CardTitle class="text-4xl font-extrabold text-white mb-6"
                  >{{ InstallParamsInfo.gameInfo.details.title }}
                </CardTitle>
                <div class="mb-2 flex w-full gap-2">
                  <span
                    v-for="(value, key) in InstallParamsInfo.gameInfo.genres || []"
                    class="bg-[#303136] text-sm text-gray-300 px-2 py-1 rounded"
                    >{{ value }}
                  </span>
                </div>
                <CardDescription class="text-gray-400 mb-2">{{
                  InstallParamsInfo.gameInfo.publisherName
                }}</CardDescription>
                <p class="text-sm text-gray-300">
                  Release Date:
                  {{ convertTimestampToDate(InstallParamsInfo.gameInfo.details.updatedAt || 0) }}
                </p>

                <p class="text-gray-300 mt-4 mb-6">
                  {{ InstallParamsInfo.gameInfo.details.shortDescription }}
                </p>

                <div class="flex items-center text-sm text-gray-400 mb-6">
                  <span class="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Last Played: {{ InstallParamsInfo.gameInfo.details.id }}
                  </span>
                </div>
                <div class="mt-4">
                  <div v-if="InstallParamsInfo.gameInfo.details.is_installed">
                    <Button
                      class="w-full bg-[#00b8d4] hover:bg-[#00a0bc] text-black font-medium py-3"
                      >PLAY NOW</Button
                    >
                  </div>
                  <div v-else>
                    <Button
                      class="w-full bg-[#00b8d4] hover:bg-[#00a0bc] text-black font-medium py-3 flex items-center justify-center"
                    >
                      <Download class="w-4 h-4 mr-2" />
                      INSTALL
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
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
              <TabsContent class="backdrop-blur-sm" value="install">
                <div class="mt-6 px-4 h-full w-full font-semibold text-white/75">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <CloudDownload class="w-6 h-6 mr-2" />
                      <span>Download Size:</span>
                    </div>
                    <span class="text-[#00b8d4]">{{
                      formatSize(InstallParamsInfo.size || 0)
                    }}</span>
                  </div>

                  <div class="border-b border-gray-700 my-4"></div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <FolderDown class="w-6 h-6 mr-2" />
                      <span>Install Size:</span>
                    </div>
                    <span class="text-[#00b8d4]">{{
                      formatSize(InstallParamsInfo.installSize || 0)
                    }}</span>
                  </div>

                  <div class="border-b border-gray-700 my-4"></div>
                  <!-- 
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <MonitorCog class="w-6 h-6 mr-2" />
                    <span> Installed Platform:</span>
                  </div>

                  <span class="text-[#00b8d4]">{{
                    InstallParamsInfo.gameInfo.details.platforms?.length
                      ? InstallParamsInfo.gameInfo.details.platforms.join(', ')
                      : 'Unknown'
                  }}</span>
                </div>

                <div class="border-b border-gray-700 my-4"></div> -->
                  <span v-if="InstallParamsInfo.gameInfo.details.version">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center">
                        <CircleDot class="w-6 h-6 mr-2" />
                        <span>Version:</span>
                      </div>

                      <span class="text-[#00b8d4]">{{
                        InstallParamsInfo.gameInfo.details.version
                      }}</span>
                    </div>

                    <div class="border-b border-gray-700 my-4"></div>
                  </span>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <Wifi class="w-6 h-6 mr-2" />
                      <span>Online Required:</span>
                    </div>

                    <span class="text-[#00b8d4]">{{
                      InstallParamsInfo.gameInfo.details.is_offline ? 'Yes' : 'No'
                    }}</span>
                  </div>

                  <div class="border-b border-gray-700 my-4"></div>
                  <span v-if="InstallParamsInfo.gameInfo.details.version">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center">
                        <Cable class="w-6 h-6 mr-2" />
                        <span>Save Path:</span>
                      </div>

                      <span class="text-[#00b8d4]">{{
                        InstallParamsInfo.gameInfo.details.save_path
                      }}</span>
                    </div>

                    <div class="border-b border-gray-700 my-4"></div>
                  </span>
                  <!-- <div class="flex items-center justify-between">
                  <span>Wine:</span>
                  <span class="text-[#00b8d4]">{{ gameInfo.app_name }}</span>
                </div> -->

                  <!-- <div class="border-b border-gray-700 my-4"></div> -->

                  <!-- <div class="flex items-center justify-between">
                  <span>WinePrefix folder:</span>
                  <span class="text-[#00b8d4]">{{ gameInfo.app_name }}</span>
                </div> -->

                  <!-- <div class="border-b border-gray-700 my-4"></div> -->

                  <!-- <div class="flex items-center justify-between">
                  <span>Sync Saves:</span>
                  <span class="text-[#00b8d4]">{{ gameInfo.app_name }}</span>
                </div> -->
                </div>
              </TabsContent>
              <TabsContent value="extra">
                <div class="space-y-4 mt-6 px-4 font-semibold text-white/75">
                  <div class="flex items-start justify-between">
                    <div class="flex items-center">
                      <Building2 class="w-6 h-6 mr-2" />
                      <span class="text-[#00b8d4] min-w-[120px]">Publisher:</span>
                    </div>

                    <span class="text-right">{{
                      InstallParamsInfo.gameInfo.publisherName || 'Unknown'
                    }}</span>
                  </div>

                  <div class="border-b border-gray-700 my-4"></div>
                  <div class="flex items-start justify-between">
                    <div class="flex items-center">
                      <Users class="w-6 h-6 mr-2" />
                      <span class="text-[#00b8d4] min-w-[120px]">Developers:</span>
                    </div>
                    <span class="text-right">{{
                      InstallParamsInfo.gameInfo.details.developersTeams.join(', ')
                    }}</span>
                  </div>

                  <div class="border-b border-gray-700 my-4"></div>

                  <div class="flex items-start justify-between">
                    <div class="flex items-center">
                      <Rocket class="w-6 h-6 mr-2" />
                      <span class="text-[#00b8d4] min-w-[120px]">Release Date:</span>
                    </div>
                    <span class="text-right">{{
                      convertTimestampToDate(InstallParamsInfo.gameInfo.details.updatedAt || 0)
                    }}</span>
                  </div>

                  <div class="border-b border-gray-700 my-4"></div>

                  <div class="flex items-start justify-between">
                    <div class="flex items-start">
                      <MonitorCog class="w-6 h-6 mr-2" />
                      <span class="text-[#00b8d4] min-w-[120px]">Platforms:</span>
                    </div>
                    <div class="text-right">
                      <span v-if="InstallParamsInfo.gameInfo.details.platforms?.length">
                        {{ InstallParamsInfo.gameInfo.details.platforms.join(', ') }}
                      </span>
                      <span v-else>Unknown</span>
                    </div>
                  </div>

                  <div class="border-b border-gray-700 my-4"></div>

                  <!-- <div class="flex items-start justify-between">
                  <span class="text-[#00b8d4] min-w-[120px]">Genres:</span>
                  <div class="text-right">
                    <span v-if="InstallParamsInfo.gameInfo.genres?.length">
                      {{ InstallParamsInfo.gameInfo.genres.join(', ') }}
                    </span>
                    <span v-else>Unknown</span>
                  </div>
                </div>

                <div class="border-b border-gray-700 my-4"></div> -->

                  <div class="flex items-start justify-between">
                    <div class="flex items-start">
                      <Globe class="w-6 h-6 mr-2" />
                      <span class="text-[#00b8d4] min-w-[120px]">Regions:</span>
                    </div>
                    <div class="text-right">
                      <span v-if="InstallParamsInfo.gameInfo.details.regions?.length">
                        {{ InstallParamsInfo.gameInfo.details.regions.join(', ') }}
                      </span>
                      <span v-else>Unknown</span>
                    </div>
                  </div>

                  <div class="border-b border-gray-700 my-4"></div>
                  <!-- 
                <div class="flex items-start justify-between">
                  <span class="text-[#00b8d4] min-w-[120px]">Player Modes:</span>
                  <div class="text-right">
                    <span v-if="gameInfo.extraInfo?.playerModes?.length">
                      {{ gameInfo.extraInfo.playerModes.join(', ') }}
                    </span>
                    <span v-else>Unknown</span>
                  </div>
                </div>

                <div class="border-b border-gray-700 my-4"></div> -->

                  <div class="flex items-start justify-between">
                    <div class="flex items-start">
                      <Languages class="w-6 h-6 mr-2" />
                      <span class="text-[#00b8d4] min-w-[120px]">Language Supported:</span>
                    </div>
                    <div class="text-right">
                      <span v-if="InstallParamsInfo.gameInfo.details.languageSupported?.length">
                        {{ InstallParamsInfo.gameInfo.details.languageSupported?.join(', ') }}
                      </span>
                      <span v-else>Unknown</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="system">
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
                        InstallParamsInfo.gameInfo.details.systemRequirements?.minimum?.osVersion ||
                        'N/A'
                      }}</span>
                    </div>
                    <div class="flex items-start flex-col">
                      <span class="text-[#00b8d4] text-sm hidden sm:inline">&nbsp;</span>
                      <!-- <span>{{ gameInfo.systemRequirements?.recommended?.os || 'N/A' }}</span> -->
                      <span>{{
                        InstallParamsInfo.gameInfo.details.systemRequirements?.recommend
                          ?.osVersion || 'N/A'
                      }}</span>
                    </div>

                    <div class="flex items-start flex-col">
                      <span class="text-[#00b8d4] text-sm">PROCESSOR:</span>
                      <span>{{
                        InstallParamsInfo.gameInfo.details.systemRequirements?.minimum?.cpu || 'N/A'
                      }}</span>
                    </div>
                    <div class="flex items-start flex-col">
                      <span class="text-[#00b8d4] text-sm hidden sm:inline">&nbsp;</span>
                      <span>{{
                        InstallParamsInfo.gameInfo.details.systemRequirements?.recommend?.cpu ||
                        'N/A'
                      }}</span>
                    </div>

                    <div class="flex items-start flex-col">
                      <span class="text-[#00b8d4] text-sm">MEMORY:</span>
                      <span>{{
                        InstallParamsInfo.gameInfo.details.systemRequirements?.minimum?.memory ||
                        'N/A'
                      }}</span>
                    </div>
                    <div class="flex items-start flex-col">
                      <span class="text-[#00b8d4] text-sm hidden sm:inline">&nbsp;</span>
                      <span>{{
                        InstallParamsInfo.gameInfo.details.systemRequirements?.recommend?.memory ||
                        'N/A'
                      }}</span>
                    </div>

                    <div class="flex items-start flex-col">
                      <span class="text-[#00b8d4] text-sm">STORAGE:</span>
                      <span>{{
                        InstallParamsInfo.gameInfo.details.systemRequirements?.minimum?.storage ||
                        'N/A'
                      }}</span>
                    </div>
                    <div class="flex items-start flex-col">
                      <span class="text-[#00b8d4] text-sm hidden sm:inline">&nbsp;</span>
                      <span>{{
                        InstallParamsInfo.gameInfo.details.systemRequirements?.recommend?.storage ||
                        'N/A'
                      }}</span>
                    </div>

                    <div class="flex items-start flex-col">
                      <span class="text-[#00b8d4] text-sm">DIRECT X:</span>
                      <span>{{
                        InstallParamsInfo.gameInfo.details.systemRequirements?.minimum?.directX ||
                        'N/A'
                      }}</span>
                    </div>
                    <div class="flex items-start flex-col">
                      <span class="text-[#00b8d4] text-sm hidden sm:inline">&nbsp;</span>
                      <span>{{
                        InstallParamsInfo.gameInfo.details.systemRequirements?.recommend?.directX ||
                        'N/A'
                      }}</span>
                    </div>

                    <div class="flex items-start flex-col">
                      <span class="text-[#00b8d4] text-sm">GRAPHICS:</span>
                      <span>{{
                        InstallParamsInfo.gameInfo.details.systemRequirements?.minimum?.gpu || 'N/A'
                      }}</span>
                    </div>
                    <div class="flex items-start flex-col">
                      <span class="text-[#00b8d4] text-sm hidden sm:inline">&nbsp;</span>
                      <span>{{
                        InstallParamsInfo.gameInfo.details.systemRequirements?.recommend?.gpu ||
                        'N/A'
                      }}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
.container {
  max-width: 1600px;
}
</style>
