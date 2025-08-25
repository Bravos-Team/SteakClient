<template>
  <Combobox by="label">
    <ComboboxAnchor :class="cn('w-full')">
      <div class="relative w-full bg-[#202024] rounded-2xl items-center">
        <ComboboxInput
          class="pl-5"
          :display-value="(val) => val?.label ?? ''"
          placeholder="Search ..."
        />
        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-3">
          <Search class="size-4 text-muted-foreground" />
        </span>
      </div>
    </ComboboxAnchor>

    <ComboboxList :class="cn('w-full min-w-[var(--reka-combobox-trigger-width)] max-w-full')">
      <ComboboxEmpty> No Game found. </ComboboxEmpty>

      <ComboboxGroup>
        <ComboboxItem v-for="game in games" :key="game.gameId" :value="game">
          <router-link class="w-full" :to="`/library/${game.gameId}`">
            {{ game.title }}

            <ComboboxItemIndicator> </ComboboxItemIndicator>
          </router-link>
        </ComboboxItem>
      </ComboboxGroup>
    </ComboboxList>
  </Combobox>
</template>
<script setup lang="ts">
import { Check, Search } from 'lucide-vue-next'
import { cn } from '@/libs/utils'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
} from '@/components/ui/combobox'

defineProps<{
  games: {
    gameId: string
    title: string
  }[]
}>()
</script>
