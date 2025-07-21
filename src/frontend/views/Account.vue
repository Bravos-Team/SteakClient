<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Globe, UserCheck, Link, LogOut, UserRoundPlus } from 'lucide-vue-next' // Fallback to lucide-vue-next for icons; replace with ShaCDN icons if available
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuthStore } from '@/stores/auth/useAuthStore'

const router = useRouter()
const version = ref('2.17.0')
const AuthStore = useAuthStore()
const handleNavigation = (path: string) => {
  router.push(path)
}
const handleOpenLoginWindow = async () => {
  console.log('Opening login window...')

  window.api.openLoginWindow()
}
const handleLogOut = () => {
  AuthStore.clearUser()
  window.api.logout()
  
}
</script>

<template>
  <div class="w-full h-full flex flex-col justify-center items-center m-auto relative">
    <img
      class="absolute z-0 w-full grayscale-60 h-full"
      src="../assets/image/backgroundgames.jpg"
    />
    <Card
      class="w-[720px] bg-[#202024]/98 text-white z-10 hover:scale-101 transition-transform duration-300"
    >
      <!-- Header Section -->
      <CardHeader class="flex flex-col items-center mb-8">
        <img
          src="https://ccdn.steak.io.vn/logo_steak.svg"
          alt="Heroic Logo"
          class="w-24 h-24 mb-4 ring-2 ring-gray-300 dark:ring-gray-500 p-1 rounded-full"
        />
        <p class="text-4xl font-mono font-extrabold text-white-400">Account Setting</p>
      </CardHeader>

      <CardContent class="space-y-6">
        <div
          class="flex h-18 items-center justify-between p-3 bg-[#25262b] hover:brightness-150 transition duration-300 rounded-lg"
        >
          <div class="flex w-18 justify-center items-center gap-2">
            <Globe class="w-8 h-8" />
          </div>
          <div class="flex-1 text-lg text-left font-medium">
            <span>Choose App language</span>
          </div>

          <Select>
            <SelectTrigger class="w-2/10 bg-[#25262b] ring-2 justify-center border-none text-white">
              <SelectValue placeholder="Vietnamese" />
            </SelectTrigger>
            <SelectContent class="bg-[#3b3b3b] justify-center text-white">
              <SelectItem value="vi">Vietnamese</SelectItem>
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
        <div class="space-y-4">
          <!-- Epic Games Login -->
          <div
            v-if="!AuthStore.isAuthenticated()"
            class="w-full h-18 bg-[#25262b] p-3 hover:brightness-150 rounded-lg flex items-center cursor-pointer transition duration-300"
            @click="handleOpenLoginWindow()"
          >
            <div class="w-18 h-full flex items-center justify-center">
              <UserRoundPlus class="w-8 h-8 text-white" />
            </div>
            <div class="flex-1 text-center text-lg font-medium pr-16">STEAK LOGIN</div>
          </div>

          <div
            v-if="AuthStore.isAuthenticated()"
            class="flex h-18 items-center justify-between p-3 bg-[#25262b] hover:brightness-150 transition duration-300 rounded-lg"
          >
            <div class="flex w-18 justify-center items-center gap-2">
              <UserCheck class="w-8 h-8" />
            </div>
            <div class="flex-1 text-lg flex justify-between px-12 text-left font-bold">
              <span class="text-center">vanthuatdaklak</span>
              <LogOut
                class="w-8 h-8 text-white cursor-pointer hover:text-red-900 transition duration-300"
                @click="handleLogOut"
              />
            </div>
          </div>
          <!-- Epic Alternative Login -->
          <div
            v-if="!AuthStore.isAuthenticated()"
            class="w-full h-18 bg-[#25262b] p-3 hover:brightness-150 rounded-lg flex items-center cursor-pointer transition duration-300"
            @click="handleNavigation('/alternative-login')"
          >
            <div class="w-18 h-full flex items-center justify-center">
              <Link class="w-8 h-8 text-white" />
            </div>
            <div class="flex-1 text-center text-lg font-medium pr-16">STEAK LOGIN METHOD</div>
          </div>
        </div>

        <!-- Library Button -->
        <router-link to="/library" class="block">
          <div
            class="w-35 h-12 bg-[#00b8d4] hover:bg-[#00a0bc] rounded-lg flex items-center justify-center float-end cursor-pointer transition-colors text-black"
          >
            <span class="text-lg font-sans font-medium">TỚI THƯ VIỆN</span>
          </div>
        </router-link>
      </CardContent>
    </Card>
  </div>
</template>
