<template>
  <div
    class="group/game transition-transform duration-300 hover:scale-105 flex flex-col rounded-md bg-muted/50 overflow-hidden"
  >
    <RouterLink :to="`/library/${game.id}`" class="relative w-full aspect-[3/4]">
      <img
        class="grayscale group-hover/game:grayscale-0 transition-all w-full h-full object-cover"
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
        @click="$emit('delete', game.id)"
        class="p-2 rounded-full bg-white/10 hover:bg-red-600 transition-all backdrop-blur-sm shadow hover:scale-105"
      >
        <Trash2 class="w-4 h-4 text-white" />
      </button>

      <DialogTrigger
        v-if="game.isFinished"
        as-child
        class="p-2 rounded-full bg-white/10 hover:bg-green-600 transition-all backdrop-blur-sm shadow-lg hover:scale-105"
      >
        <button @click="$emit('install', game.id)">
          <Play class="w-6 h-6 text-white" />
        </button>
      </DialogTrigger>
      <DialogTrigger
        v-if="!game.isFinished"
        as-child
        @click="$emit('install', game.id)"
        class="p-2 rounded-full bg-white/10 hover:bg-blue-500 transition-all backdrop-blur-sm shadow-lg hover:scale-105"
      >
        <button @click="$emit('install', game.id)">
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
import { Play, Trash2, SlidersHorizontal, ArrowDownToLine } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
const router = useRouter()

const navigateToGameDetail = (gameId: number) => {
  console.log(123, gameId)

  router.push({ path: `/library/details` })
}
defineProps<{
  game: {
    id: string
    title: string
    image: string
    installable: boolean
    isInQueue: boolean
    isFinished: boolean
  }
}>()

defineEmits<{
  (e: 'install', appName: string): void
  (e: 'delete', appName: string): void
  (e: 'save', appName: string): void
}>()
</script>
