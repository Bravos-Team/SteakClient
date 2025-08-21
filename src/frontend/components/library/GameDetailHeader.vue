<!-- GameDetailHeader.vue -->
<template>
  <div class="w-full min-h-full p-2 gap-4">
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
            :src="gameInfo?.details?.thumbnail"
            :alt="installParams?.id"
            class="w-full h-full object-cover rounded-md"
          />
          <div
            class="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-black via-black/95 rounded-md to-transparent"
          ></div>
        </div>
      </div>
      <div class="absolute w-full top-3/5 -translate-y-1/2 z-10">
        <div class="px-12 pt-2">
          <CardTitle class="text-4xl font-extrabold text-white mb-6">{{
            gameInfo.details.title
          }}</CardTitle>
          <div class="mb-2 flex w-full gap-2">
            <span
              v-for="(value, key) in gameInfo?.genres || []"
              :key="key"
              class="bg-[#303136] text-sm text-gray-300 px-2 py-1 rounded"
              >{{ value }}</span
            >
          </div>
          <CardDescription class="text-gray-400 mb-2">{{ gameInfo.publisherName }}</CardDescription>
          <p class="text-sm text-gray-300">
            Release Date: {{ convertTimestampToDate(gameInfo.details.updatedAt || 0) }}
          </p>
          <p class="text-gray-300 mt-4 mb-6">{{ gameInfo.details.shortDescription }}</p>
          <div class="flex flex-col gap-2 text-sm text-gray-400 mb-6">
            <span class="flex items-center">
              <CalendarClock class="h-5 w-5 mr-1" />
              Last Played:
              {{ lastPlayedAt ? formatDiff(lastPlayedAt) : 'Never Played' }}
            </span>
            <span class="flex items-center">
              <Timer class="h-5 w-5 mr-1" />

              Play Time:
              {{ playSeconds ? formatPlayTime(playSeconds) : '0 seconds' }}
            </span>
          </div>
          <div class="mt-4">
            <Button
              v-if="gameInfo.details.is_installed"
              class="w-full bg-[#00b8d4] hover:bg-[#00a0bc] text-black font-medium py-3"
              >PLAY NOW</Button
            >
            <Button
              v-else
              class="w-full bg-[#00b8d4] hover:bg-[#00a0bc] text-black font-medium py-3 flex items-center justify-center"
              @click="$emit('install', gameInfo.details.id)"
            >
              <Download class="w-4 h-4 mr-2" />
              INSTALL
            </Button>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download , Timer, CalendarClock } from 'lucide-vue-next'
import type { GameDetails, InstallParams } from '@/types/type'

defineProps<{
  gameInfo: GameDetails
  installParams: InstallParams
  lastPlayedAt?: number
  playSeconds?: number
}>()
defineEmits<{
  (e: 'install', gameId: string): void
}>()
const convertTimestampToDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
const formatDiff = (diffMs: number) => {
  const minutes = Math.floor(diffMs / (1000 * 60))
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} minutes ago`
  if (hours < 24) return `${hours} hours ago`
  return `${days} days ago`
}
const formatPlayTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (seconds < 60) return `${seconds} seconds`
  if (minutes < 60) return `${minutes} minutes`
  if (hours < 24) return `${hours} hours`
  return `${days} days`
}
</script>
