<template>
  <div
    class="group/game transition-transform duration-300 hover:scale-105 flex flex-col aspect-[3/4] rounded-sm bg-muted/50 relative"
  >
    <img
      class="grayscale group-hover/game:grayscale-0 transition-all h-5/6 w-full rounded-sm object-cover"
      :src="game.image"
      @click="navigateToGameDetail(1)"
      alt=""
    />
    <div
      class="absolute bottom-10 left-0 flex items-center right-0 bg-[#202024]/30 backdrop-blur-sm text-white p-2 rounded-b-sm opacity-0 group-hover/game:opacity-100 group-hover/game:translate-y-0 translate-y-4 transition-all duration-300"
    >
      <h1 class="font-serif text-lg">{{ game.title }}</h1>
    </div>
    <div
      class="relative flex justify-between items-center h-2/12 bg-[#202024] w-full rounded-b-sm px-4"
    >
      <button
        v-if="game.installable"
        @click="$emit('delete', game.appName)"
        class="p-2 rounded-full bg-white/10 hover:bg-red-600 transition-all backdrop-blur-sm shadow hover:scale-105"
      >
        <Trash2 class="w-4 h-4 text-white" />
      </button>
      <DialogTrigger
        v-if="game.installable"
        as-child
        class="absolute left-1/2 -translate-x-1/2 p-3 rounded-full bg-white/10 hover:bg-green-600 transition-all backdrop-blur-sm shadow-lg hover:scale-105"
      >
        <button @click="$emit('install', game.appName)">
          <Play class="w-5 h-5 text-white" />
        </button>
      </DialogTrigger>
      <button
        v-else
        @click="$emit('save', game.appName)"
        class="absolute left-1/2 -translate-x-1/2 p-3 rounded-full bg-white/10 hover:bg-blue-500 transition-all backdrop-blur-sm shadow-lg hover:scale-105"
      >
        <ArrowDownToLine class="w-5 h-5 text-white" />
      </button>
      <button
        v-if="game.installable"
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
    appName: string
    title: string
    image: string
    installable: boolean
  }
}>()

defineEmits<{
  (e: 'install', appName: string): void
  (e: 'delete', appName: string): void
  (e: 'save', appName: string): void
}>()
</script>
