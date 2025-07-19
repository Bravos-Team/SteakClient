<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Download, Info, Star, TvMinimal, ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const gameId = route.params.id as string

// Route back to library
const routeBackToLibrary = () => {
    router.push("/library")
}

// Define game information with defaults
const gameInfo = ref({
    title: "Loading...",
    developer: "",
    description: "Loading game information...",
    size: "",
    downloadSize: "",
    installSize: "",
    installedPlatform: "",
    version: "",
    onlineRequired: "",
    installPath: "",
    winePrefix: "",
    winePrefixFolder: "",
    lastPlayed: "Never",
    syncSaves: "Disabled",
    imageUrl: "",
    genre: "",
    releaseDate: "",
    isInstalled: false
})

// Mock data
const fetchGameInfo = (id: String | Number) => {
    const gameData: Record<string, any> = {
        1: {
            title: "Fortnite Blitz Royale",
            developer: "Epic Games",
            description: "A free-to-play battle royale game with numerous game modes for every type of player.",
            size: "26.4 GiB",
            downloadSize: "22.8 GiB",
            installSize: "26.4 GiB",
            installedPlatform: "Windows",
            version: "26.30.0",
            onlineRequired: "YES",
            installPath: "~/Games/Fortnite",
            winePrefix: "Wine Default",
            winePrefixFolder: "~/Games/Prefixes/Fortnite",
            lastPlayed: "Never",
            syncSaves: "Disabled",
            imageUrl: "https://cdn2.unrealengine.com/fortnite-blitz-royale-1920x1080-9946411a3a9f.jpg",
            genre: "Battle Royale",
            releaseDate: "26/09/2017",
            isInstalled: false,
            systemRequirements: {
                minimum: {
                    os: "Windows 7/8/10 64-bit",
                    processor: "Core i3-3225 3.3 GHz",
                    memory: "4 GB RAM",
                    storage: "15 GB available space",
                    directX: "DirectX 11",
                    graphics: "Intel HD 4000 on PC"
                },
                recommended: {
                    os: "Windows 10 64-bit",
                    processor: "Core i5-7300U 3.5 GHz",
                    memory: "8 GB RAM",
                    storage: "20 GB available space",
                    directX: "DirectX 11",
                    graphics: "NVIDIA GTX 660 or AMD Radeon HD 7870"
                }
            },
            extraInfo: {
                publisher: "Epic Games",
                releaseDate: "26/09/2017",
                platforms: ["Windows", "macOS", "PlayStation", "Xbox", "Switch", "Android", "iOS"],
                genres: ["Battle Royale", "Action", "Shooter"],
                ageRating: "T for Teen",
                playerModes: ["Single-player", "Multiplayer", "Online Multiplayer"],
                languages: ["English", "French", "German", "Spanish", "Italian", "Japanese"]
            }
        },
        2: {
            title: "Black Myth: Wukong",
            developer: "Game Science",
            description: "An action RPG rooted in Chinese mythology, featuring the Monkey King and other characters from Journey to the West.",
            size: "45.8 GiB",
            downloadSize: "42.3 GiB",
            installSize: "45.8 GiB",
            installedPlatform: "Windows",
            version: "1.0.0",
            onlineRequired: "NO",
            installPath: "~/Games/Wukong",
            winePrefix: "Wine Default",
            winePrefixFolder: "~/Games/Prefixes/Wukong",
            lastPlayed: "Never",
            syncSaves: "Disabled",
            imageUrl: new URL('../../assets/image/backmythwukong.jpg', import.meta.url).href,
            genre: "Action RPG",
            releaseDate: "20/08/2024",
            isInstalled: false,
            systemRequirements: {
                minimum: {
                    os: "Windows 10 64-bit",
                    processor: "Intel Core i5-8400 / AMD Ryzen 5 3600",
                    memory: "16 GB RAM",
                    storage: "100 GB available space",
                    directX: "DirectX 12",
                    graphics: "NVIDIA GeForce GTX 970 / AMD Radeon RX 570"
                },
                recommended: {
                    os: "Windows 10/11 64-bit",
                    processor: "Intel Core i7-10700K / AMD Ryzen 7 5800X",
                    memory: "16 GB RAM",
                    storage: "100 GB SSD",
                    directX: "DirectX 12",
                    graphics: "NVIDIA GeForce RTX 2080 / AMD Radeon RX 6800 XT"
                }
            },
            extraInfo: {
                publisher: "Game Science",
                releaseDate: "20/08/2024",
                platforms: ["Windows", "PlayStation 5"],
                genres: ["Action RPG", "Adventure"],
                ageRating: "M for Mature",
                playerModes: ["Single-player"],
                languages: ["Chinese", "English", "Japanese", "Korean"]
            }
        },
        3: {
            title: "Elden Ring",
            developer: "FromSoftware",
            description: "An action RPG developed by FromSoftware and published by Bandai Namco Entertainment.",
            size: "60.2 GiB",
            downloadSize: "58.5 GiB",
            installSize: "60.2 GiB",
            installedPlatform: "Windows",
            version: "1.10.1",
            onlineRequired: "NO",
            installPath: "~/Games/EldenRing",
            winePrefix: "Wine Default",
            winePrefixFolder: "~/Games/Prefixes/EldenRing",
            lastPlayed: "127.5 hours",
            syncSaves: "Disabled",
            imageUrl: new URL('../../assets/image/elderring.webp', import.meta.url).href,
            genre: "Action RPG",
            releaseDate: "25/02/2022",
            isInstalled: true,
            systemRequirements: {
                minimum: {
                    os: "Windows XP SP2",
                    processor: "2.6 GHz single core",
                    memory: "1 GB",
                    storage: "2 GB",
                    directX: "DirectX 9.0",
                    graphics: "DirectX 9.0c compatible graphics card"
                },
                recommended: {
                    os: "Windows 10",
                    processor: "3.0 GHz dual core",
                    memory: "2 GB",
                    storage: "2 GB",
                    directX: "DirectX 10.0",
                    graphics: "GeForce 8 series, ATI Radeon HD2xxx"
                }
            },
            extraInfo: {
                publisher: "Bandai Namco",
                releaseDate: "25/02/2022",
                platforms: ["Windows", "PlayStation 4", "PlayStation 5", "Xbox One", "Xbox Series X/S"],
                genres: ["Action RPG", "Soulslike", "Open World"],
                ageRating: "M for Mature",
                playerModes: ["Single-player", "Online Co-op"],
                languages: ["English", "French", "Italian", "German", "Spanish", "Japanese", "Korean"]
            }
        },

        // Default case for unknown game ID
        999: {
            title: "Unknown Game",
            developer: "Unknown",
            description: "Game information not found",
            size: "N/A",
            downloadSize: "N/A",
            installSize: "N/A",
            installedPlatform: "N/A",
            version: "N/A",
            onlineRequired: "N/A",
            installPath: "N/A",
            winePrefix: "N/A",
            winePrefixFolder: "N/A",
            lastPlayed: "9999999999999",
            syncSaves: "Disabled",
            imageUrl: new URL('../../assets/img/2.jpg', import.meta.url).href,
            genre: "Unknown",
            releaseDate: "Unknown",
            isInstalled: false
        }
    }

    return gameData[id] || gameData[999]
}

onMounted(() => {
    gameInfo.value = fetchGameInfo(gameId)
})
</script>

<template>


    <!-- Back button -->
    <div class="absolute top-30 left-52 z-20">
        <Button @click="routeBackToLibrary"
            class="p-2 h-auto w-auto min-w-0 bg-[#1a1b1e] hover:bg-[#303136] text-white rounded-md" variant="ghost">
            <ArrowLeft class="h-5 w-5" />
        </Button>
    </div>

    <div class="container m-auto p-4 flex flex-col md:flex-row gap-6">
        <!-- Game Info Card -->
        <Card class="md:w-1/2 bg-[#1a1b1e]">
            <div class="relative">
                <!-- Platform logo -->
                <div class="absolute top-4 left-4 z-10 bg-[#1a1b1e] p-2 rounded-md">
                    <img src="@/assets/logo.svg.ico" alt="Platform Logo" class="w-3 h-3" />
                </div>

                <!-- Game image -->
                <div class="w-full h-[300px] overflow-hidden">
                    <img :src="gameInfo.imageUrl" :alt="gameInfo.title"
                        class="w-full h-full object-cover rounded-t-lg" />
                </div>
            </div>

            <div class="p-6">
                <div class="mb-2">
                    <span class="bg-[#303136] text-sm text-gray-300 px-2 py-1 rounded">{{ gameInfo.genre }}</span>
                </div>

                <CardTitle class="text-2xl font-bold text-white mb-1">{{ gameInfo.title }}</CardTitle>
                <CardDescription class="text-gray-400 mb-2">{{ gameInfo.developer }}</CardDescription>
                <p class="text-sm text-gray-300">Release Date: {{ gameInfo.releaseDate }}</p>

                <p class="text-gray-300 mt-4 mb-6">{{ gameInfo.description }}</p>

                <div class="flex items-center text-sm text-gray-400 mb-6">
                    <span class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Last Played: {{ gameInfo.lastPlayed }}
                    </span>
                </div>

                <div class="mt-4">
                    <div v-if="gameInfo.isInstalled">
                        <Button class="w-full bg-[#00b8d4] hover:bg-[#00a0bc] text-black font-medium py-3">PLAY
                            NOW</Button>
                    </div>
                    <div v-else>
                        <Button
                            class="w-full bg-[#00b8d4] hover:bg-[#00a0bc] text-black font-medium py-3 flex items-center justify-center">
                            <Download class="w-4 h-4 mr-2" />
                            INSTALL
                        </Button>
                    </div>
                </div>
            </div>
        </Card>

        <!-- System Info Card (Right side) -->
        <Card class="md:w-1/2 bg-[#1a1b1e]">
            <CardContent class="p-4">
                <Tabs default-value="install" class="w-full">
                    <!-- Title List -->
                    <TabsList class="w-full flex mb-4 border-gray-800">
                        <TabsTrigger value="install"
                            class="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-[#00b8d4] data-[state=active]:text-[#00b8d4] text-gray-400">
                            <div class="flex items-center justify-center w-5 h-5 rounded-full">
                                <Download class="w-3 h-3" />
                            </div>
                            INSTALL INFO
                        </TabsTrigger>
                        <TabsTrigger value="extra"
                            class="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-[#00b8d4] data-[state=active]:text-[#00b8d4] text-gray-400">
                            <div
                                class="flex items-center justify-center w-5 h-5 rounded-full bg-transparent text-gray-400">
                                <Star class="w-3 h-3" />
                            </div>
                            EXTRA INFO
                        </TabsTrigger>
                        <TabsTrigger value="system"
                            class="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-[#00b8d4] data-[state=active]:text-[#00b8d4] text-gray-400">
                            <div
                                class="flex items-center justify-center w-5 h-5 rounded-full bg-transparent text-gray-400">
                                <TvMinimal class="w-3 h-3" />
                            </div>
                            SYSTEM REQUIREMENTS
                        </TabsTrigger>
                    </TabsList>

                    <!-- Content -->
                    <TabsContent value="install">
                        <div class="space-y-4 mt-6 text-gray-300">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <span>Download Size:</span>
                                </div>
                                <span class="text-[#00b8d4]">{{ gameInfo.downloadSize }}</span>
                            </div>

                            <div class="border-b border-gray-700 my-4"></div>

                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <span>Install Size:</span>
                                </div>
                                <span class="text-[#00b8d4]">{{ gameInfo.installSize }}</span>
                            </div>

                            <div class="border-b border-gray-700 my-4"></div>

                            <!-- Other install info -->
                            <div class="flex items-center justify-between">
                                <span>Installed Platform:</span>
                                <span class="text-[#00b8d4]">{{ gameInfo.installedPlatform }}</span>
                            </div>

                            <div class="border-b border-gray-700 my-4"></div>

                            <div class="flex items-center justify-between">
                                <span>Version:</span>
                                <span class="text-[#00b8d4]">{{ gameInfo.version }}</span>
                            </div>

                            <div class="border-b border-gray-700 my-4"></div>

                            <div class="flex items-center justify-between">
                                <span>Online Required:</span>
                                <span class="text-[#00b8d4]">{{ gameInfo.onlineRequired }}</span>
                            </div>

                            <div class="border-b border-gray-700 my-4"></div>

                            <div class="flex items-center justify-between">
                                <span>Install Path:</span>
                                <span class="text-[#00b8d4]">{{ gameInfo.installPath }}</span>
                            </div>

                            <div class="border-b border-gray-700 my-4"></div>

                            <div class="flex items-center justify-between">
                                <span>Wine:</span>
                                <span class="text-[#00b8d4]">{{ gameInfo.winePrefix }}</span>
                            </div>

                            <div class="border-b border-gray-700 my-4"></div>

                            <div class="flex items-center justify-between">
                                <span>WinePrefix folder:</span>
                                <span class="text-[#00b8d4]">{{ gameInfo.winePrefixFolder }}</span>
                            </div>

                            <div class="border-b border-gray-700 my-4"></div>

                            <div class="flex items-center justify-between">
                                <span>Sync Saves:</span>
                                <span class="text-[#00b8d4]">{{ gameInfo.syncSaves }}</span>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="extra">
                        <div class="space-y-4 mt-6 text-gray-300">
                            <!-- Publisher -->
                            <div class="flex items-start justify-between">
                                <span class="text-[#00b8d4] min-w-[120px]">Publisher:</span>
                                <span class="text-right">{{ gameInfo.extraInfo?.publisher || 'Unknown' }}</span>
                            </div>

                            <div class="border-b border-gray-700 my-4"></div>

                            <!-- Release Date -->
                            <div class="flex items-start justify-between">
                                <span class="text-[#00b8d4] min-w-[120px]">Release Date:</span>
                                <span class="text-right">{{ gameInfo.extraInfo?.releaseDate || gameInfo.releaseDate ||
                                    'Unknown' }}</span>
                            </div>

                            <div class="border-b border-gray-700 my-4"></div>

                            <!-- Platforms -->
                            <div class="flex items-start justify-between">
                                <span class="text-[#00b8d4] min-w-[120px]">Platforms:</span>
                                <div class="text-right">
                                    <span v-if="gameInfo.extraInfo?.platforms?.length">
                                        {{ gameInfo.extraInfo.platforms.join(', ') }}
                                    </span>
                                    <span v-else>Unknown</span>
                                </div>
                            </div>

                            <div class="border-b border-gray-700 my-4"></div>

                            <!-- Genres -->
                            <div class="flex items-start justify-between">
                                <span class="text-[#00b8d4] min-w-[120px]">Genres:</span>
                                <div class="text-right">
                                    <span v-if="gameInfo.extraInfo?.genres?.length">
                                        {{ gameInfo.extraInfo.genres.join(', ') }}
                                    </span>
                                    <span v-else>{{ gameInfo.genre || 'Unknown' }}</span>
                                </div>
                            </div>

                            <div class="border-b border-gray-700 my-4"></div>

                            <!-- Age Rating -->
                            <div class="flex items-start justify-between">
                                <span class="text-[#00b8d4] min-w-[120px]">Age Rating:</span>
                                <span class="text-right">{{ gameInfo.extraInfo?.ageRating || 'Not Rated' }}</span>
                            </div>

                            <div class="border-b border-gray-700 my-4"></div>

                            <!-- Player Modes -->
                            <div class="flex items-start justify-between">
                                <span class="text-[#00b8d4] min-w-[120px]">Player Modes:</span>
                                <div class="text-right">
                                    <span v-if="gameInfo.extraInfo?.playerModes?.length">
                                        {{ gameInfo.extraInfo.playerModes.join(', ') }}
                                    </span>
                                    <span v-else>Unknown</span>
                                </div>
                            </div>

                            <div class="border-b border-gray-700 my-4"></div>

                            <!-- Languages -->
                            <div class="flex items-start justify-between">
                                <span class="text-[#00b8d4] min-w-[120px]">Languages:</span>
                                <div class="text-right">
                                    <span v-if="gameInfo.extraInfo?.languages?.length">
                                        {{ gameInfo.extraInfo.languages.join(', ') }}
                                    </span>
                                    <span v-else>Unknown</span>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="system">
                        <div class="space-y-4 mt-6 text-gray-300">
                            <div class="grid grid-cols-2 gap-4">
                                <div class="text-center mb-4">
                                    <h3 class="text-[#00b8d4] font-medium">MINIMUM</h3>
                                </div>
                                <div class="text-center mb-4">
                                    <h3 class="text-[#00b8d4] font-medium">RECOMMENDED</h3>
                                </div>

                                <div class="flex items-start flex-col">
                                    <span class="text-[#00b8d4] text-sm">OS:</span>
                                    <span>{{ gameInfo.systemRequirements?.minimum?.os || 'N/A' }}</span>
                                </div>
                                <div class="flex items-start flex-col">
                                    <span class="text-[#00b8d4] text-sm hidden sm:inline">&nbsp;</span>
                                    <span>{{ gameInfo.systemRequirements?.recommended?.os || 'N/A' }}</span>
                                </div>

                                <div class="flex items-start flex-col">
                                    <span class="text-[#00b8d4] text-sm">PROCESSOR:</span>
                                    <span>{{ gameInfo.systemRequirements?.minimum?.processor || 'N/A' }}</span>
                                </div>
                                <div class="flex items-start flex-col">
                                    <span class="text-[#00b8d4] text-sm hidden sm:inline">&nbsp;</span>
                                    <span>{{ gameInfo.systemRequirements?.recommended?.processor || 'N/A' }}</span>
                                </div>

                                <div class="flex items-start flex-col">
                                    <span class="text-[#00b8d4] text-sm">MEMORY:</span>
                                    <span>{{ gameInfo.systemRequirements?.minimum?.memory || 'N/A' }}</span>
                                </div>
                                <div class="flex items-start flex-col">
                                    <span class="text-[#00b8d4] text-sm hidden sm:inline">&nbsp;</span>
                                    <span>{{ gameInfo.systemRequirements?.recommended?.memory || 'N/A' }}</span>
                                </div>

                                <div class="flex items-start flex-col">
                                    <span class="text-[#00b8d4] text-sm">STORAGE:</span>
                                    <span>{{ gameInfo.systemRequirements?.minimum?.storage || 'N/A' }}</span>
                                </div>
                                <div class="flex items-start flex-col">
                                    <span class="text-[#00b8d4] text-sm hidden sm:inline">&nbsp;</span>
                                    <span>{{ gameInfo.systemRequirements?.recommended?.storage || 'N/A' }}</span>
                                </div>

                                <div class="flex items-start flex-col">
                                    <span class="text-[#00b8d4] text-sm">DIRECT X:</span>
                                    <span>{{ gameInfo.systemRequirements?.minimum?.directX || 'N/A' }}</span>
                                </div>
                                <div class="flex items-start flex-col">
                                    <span class="text-[#00b8d4] text-sm hidden sm:inline">&nbsp;</span>
                                    <span>{{ gameInfo.systemRequirements?.recommended?.directX || 'N/A' }}</span>
                                </div>

                                <div class="flex items-start flex-col">
                                    <span class="text-[#00b8d4] text-sm">GRAPHICS:</span>
                                    <span>{{ gameInfo.systemRequirements?.minimum?.graphics || 'N/A' }}</span>
                                </div>
                                <div class="flex items-start flex-col">
                                    <span class="text-[#00b8d4] text-sm hidden sm:inline">&nbsp;</span>
                                    <span>{{ gameInfo.systemRequirements?.recommended?.graphics || 'N/A' }}</span>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    </div>
</template>

<style scoped>
.container {
    max-width: 1200px;
}
</style>

