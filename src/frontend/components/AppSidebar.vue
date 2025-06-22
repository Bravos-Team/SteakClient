<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Gamepad,
  ShoppingCart,
  Power,
  ArrowDownToLine,
} from 'lucide-vue-next'
import NavMain from '@/components/NavMain.vue'
import NavProjects from '@/components/NavProjects.vue'
import NavUser from '@/components/NavUser.vue'
import TeamSwitcher from '@/components/TeamSwitcher.vue'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Library',
      url: '/library',
      icon: Gamepad,
    },
    {
      title: 'Store',
      url: '/store',
      icon: ShoppingCart,
    },

    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
    },
    {
      title: 'Logout',
      url: '#',
      icon: Power,
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'LogOut',
      url: '#',
      icon: Power,
    },
  ],
  footer: [{ title: 'Download', url: '#', icon: ArrowDownToLine }],
}
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <!-- <TeamSwitcher :teams="data.teams" /> -->
      <img class="h-[75px] p-2" src="https://ccdn.steak.io.vn/logo_steak.svg" alt="" />
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.navMain" />
      <!-- <NavProjects :projects="data.projects" /> -->
    </SidebarContent>
    <SidebarFooter>

        <NavMain class="pb-4" :items="data.footer" />

      <NavUser :class="cn('block md:hidden')" :user="data.user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
