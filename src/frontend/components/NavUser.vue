<script setup lang="ts">
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  User,
} from 'lucide-vue-next'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { UserInfo } from '@/types/type'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import { computed } from 'vue'
const AuthStore = useAuthStore()
const user = computed(() => {
  const userData = AuthStore.getUser()
  return {
    displayName: userData?.displayName || 'Guest',
    avatarUrl: userData?.avatarUrl || '',
  } as UserInfo
})

const logout = () => {
  AuthStore.clearUser()
  window.api.logout()
}
const { isMobile } = useSidebar()
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="transition-transform duration-300 data-[state=open]:bg-sidebar-accent hover:bg-[#202024] data-[state=open]:text-sidebar-accent-foreground"
          >
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{{ user.displayName }}</span>
              <!-- <span class="truncate text-xs">{{ user.email }}</span> -->
            </div>
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarImage :src="user.avatarUrl as string" :alt="user.displayName" />
              <AvatarFallback class="rounded-lg">
                <User />
              </AvatarFallback>
            </Avatar>
            <ChevronsUpDown class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          align="end"
          :side-offset="4"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <div class="grid flex-1 pl-2 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{ user.displayName }}</span>
                <!-- <span class="truncate text-xs">{{ user.email }}</span> -->
              </div>
              <Avatar class="h-8 w-8 rounded-lg">
                <AvatarImage :src="user.avatarUrl as string" :alt="user.displayName" />
                <AvatarFallback class="rounded-lg">
                  <User />
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Sparkles />
              Upgrade to Pro
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <router-link to="/account" class="text-white">
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
            </router-link>
            <DropdownMenuItem>
              <CreditCard />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell />
              Notifications
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator v-if="userStore.isAuthenticated()" />
          <DropdownMenuItem v-if="userStore.isAuthenticated()" @click="logout">
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
