<template>
  <div class="w-full flex flex-col">
    <div class="flex">
      <div class="flex justify-center pl-4 gap-4">
        <ArrowLeft class="cursor-pointer" @click="handleNavigation('back')" />
        <ArrowRight class="cursor-pointer" @click="handleNavigation('forward')" />
        <RefreshCcw class="cursor-pointer" @click="handleNavigation('refresh')" />
      </div>
      <div class="grow flex justify-center items-center">

        <input class="w-full text-center font-serif italic focus:outline-none focus:border-none" type="text" readonly
          value="https://develop.steak.io.vn/store/home" />
      </div>
      <div class="flex justify-center pr-4">
        <ArrowUpFromLine class="cursor-pointer" @click="handleNavigation('openInBrowser')" />
      </div>
    </div>
    <hr class="h-px mt-2 w-ful bg-[#ffffff] border-0" />
  </div>
  <div class="w-full h-full">
    <iframe class="w-full h-full" src="https://develop.steak.io.vn/store/home" frameborder="0"></iframe>
  </div>
</template>
<script lang="ts" setup>
import { ArrowLeft, ArrowRight, RefreshCcw, ArrowUpFromLine } from 'lucide-vue-next'
import { useNavigation } from '@/composables/useNavigation';

const { handleNavigation } = useNavigation();
</script>
