<template>
  <div
    class="group/game transition-transform duration-300 hover:scale-105 flex flex-col rounded-md bg-muted/50 overflow-hidden"
  >
    <RouterLink :to="`/library/${game.gameId}`" class="relative w-full aspect-[3/4]">
      <img
        v-if="game.isFinished"
        class="group-hover/game:grayscale-0 transition-all w-full h-full object-cover"
        :src="game.image"
        alt=""
      />
      <img
        v-else
        class="grayscale opacity-50 group-hover/game:grayscale-0 transition-all w-full h-full object-cover"
        :src="game.image"
        alt=""
      />
      <div
        class="absolute bottom-0 left-0 flex items-center w-full bg-[#202024]/30 backdrop-blur-sm text-white px-3 py-2 opacity-0 group-hover/game:opacity-100 group-hover/game:translate-y-0 translate-y-4 transition-all duration-300"
      >
        <h1 class="font-serif text-lg truncate">{{ game.title }}</h1>
      </div>
    </RouterLink>

    <!-- Nút thao tác -->
    <div class="flex flex-wrap justify-between items-center gap-2 p-2 bg-[#202024] w-full">
      <button
        v-if="game.isFinished"
        @click="$emit('delete', game.gameId)"
        class="p-2 rounded-full bg-white/10 hover:bg-red-600 transition-all backdrop-blur-sm shadow hover:scale-105"
      >
        <Trash2 class="w-4 h-4 text-white" />
      </button>
      <span v-if="game.isFinished">
        <button
          v-if="GameStatusStore.getStatus(game.gameId.toString()) === 'launching'"
          as-child
          class="p-2 rounded-full bg-white/10 hover:bg-red-400 transition-all backdrop-blur-sm shadow-lg hover:scale-105"
          @click="$emit('exit', game.gameId)"
        >
          <X class="w-6 h-6 text-white" />
        </button>
        <button
          v-else
          as-child
          class="p-2 rounded-full bg-white/10 hover:bg-green-600 transition-all backdrop-blur-sm shadow-lg hover:scale-105"
          @click="$emit('launch', game.gameId)"
        >
          <Play class="w-6 h-6 text-white" />
        </button>
      </span>
      <DialogTrigger
        v-if="!game.isFinished"
        as-child
        @click="$emit('install', game.gameId)"
        class="p-2 rounded-full bg-white/10 hover:bg-blue-500 transition-all backdrop-blur-sm shadow-lg hover:scale-105"
      >
        <button @click="$emit('install', game.gameId)">
          <ArrowDownToLine class="w-6 h-6 text-white" />
        </button>
      </DialogTrigger>

      <button
        v-if="game.isFinished"
        class="p-2 rounded-full bg-white/10 hover:bg-blue-500 transition-all backdrop-blur-sm shadow hover:scale-105"
      >
        <SlidersHorizontal class="w-4 h-4 text-white" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DialogTrigger } from '@/components/ui/dialog'
import { useGameStatusStore } from '@/stores/download/useDownloadStore'
import { GameStatus } from '@/types/type'
import { Play, Trash2, SlidersHorizontal, ArrowDownToLine, X } from 'lucide-vue-next'
import { ref } from 'vue'
const GameStatusStore = useGameStatusStore()
import { useRouter } from 'vue-router'
const router = useRouter()

const navigateToGameDetail = (gameId: number) => {
  router.push({ path: `/library/details` })
}
defineProps<{
  game: {
    gameId: string
    title: string
    image: string
    lastPlayedAt: string
    installable: boolean
    isInQueue: boolean
    isFinished: boolean
  }
}>()

defineEmits<{
  (e: 'install', gameId: string): void
  (e: 'delete', gameId: string): void
  (e: 'save', gameId: string): void
  (e: 'launch', gameId: string): void
  (e: 'exit', gameId: string): void
}>()
</script>
