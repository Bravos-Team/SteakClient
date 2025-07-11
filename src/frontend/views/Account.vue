<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Globe } from 'lucide-vue-next' // Fallback to lucide-vue-next for icons; replace with ShaCDN icons if available
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const router = useRouter()
const version = ref('2.17.0')

const handleNavigation = (path: string) => {
    router.push(path)
}
</script>

<template>
    <Card class="w-[720px] bg-[#1a1b1e] text-white flex flex-col justify-center align-center m-auto">
        <!-- Header Section -->
        <CardHeader class="flex flex-col items-center mb-8">
            <img src="https://ccdn.steak.io.vn/logo_steak.svg" alt="Heroic Logo" class="w-16 h-16 mb-4" />
            <p class="text-sm text-gray-400">Games Launcher</p>
        </CardHeader>

        <CardContent class="space-y-6">
            <div class="flex items-center justify-between bg-[#25262b] p-3 rounded-lg">
                <div class="flex items-center gap-2">
                    <Globe class="w-5 h-5" />
                    <span>Chọn ngôn ngữ của ứng dụng</span>
                </div>
                <Select>
                    <SelectTrigger class="w-[120px] bg-[#25262b] border-none text-white">
                        <SelectValue placeholder="Tiếng Việt" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="vi">Tiếng Việt</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <!-- Add more languages as needed -->
                    </SelectContent>
                </Select>
            </div>

            <!-- Info Text -->
            <p class="text-sm text-gray-400">
                Login with your platform. You can login to more than one platform at the same time.
            </p>

            <!-- Updated Login Buttons -->
            <div class="space-y-3">
                <!-- Epic Games Login -->
                <div class="w-full h-14 bg-[#202427] hover:bg-[#2c2d32] rounded-lg flex items-center cursor-pointer transition-colors"
                    @click="handleNavigation('/epic-login')">
                    <div class="w-16 h-full flex items-center justify-center">
                        <img src="https://cdn2.unrealengine.com/eg-shield-logo-white-f8185c103d8d.svg" alt="Epic Games"
                            class="w-8 h-8" />
                    </div>
                    <div class="flex-1 text-center text-[15px] font-medium pr-16">
                        STEAK LOGIN
                    </div>
                </div>

                <!-- Epic Alternative Login -->
                <div class="w-full h-14 bg-[#202427] hover:bg-[#2c2d32] rounded-lg flex items-center cursor-pointer transition-colors"
                    @click="handleNavigation('/alternative-login')">
                    <div class="w-16 h-full flex items-center justify-center">
                        <img src="https://cdn2.unrealengine.com/eg-shield-logo-white-f8185c103d8d.svg" alt="Epic Games"
                            class="w-8 h-8" />
                    </div>
                    <div class="flex-1 text-center text-[15px] font-medium pr-16">
                        STEAK LOGIN METHOD
                    </div>
                </div>
            </div>

            <!-- Library Button -->
            <router-link to="/library" class="block">
                <div
                    class="w-30 h-10 bg-[#00b8d4] hover:bg-[#00a0bc] rounded-lg flex items-center justify-center float-end cursor-pointer transition-colors text-black">
                    <span class="text-[15px] font-medium">TỚI THƯ VIỆN</span>
                </div>
            </router-link>
        </CardContent>
    </Card>
</template>
