<template>
  <div class="w-full flex flex-col">
    <div class="flex">
      <div class="flex justify-center pl-4 gap-4">
        <ArrowLeft />
        <ArrowRight />
        <RefreshCcw />
      </div>
      <div class="grow flex justify-center items-center">
        <input
          class="w-full text-center font-serif italic focus:outline-none focus:border-none"
          type="text"
          readonly
          value=""
        />
      </div>
      <div class="flex justify-center pr-4"><ArrowUpFromLine /></div>
    </div>
    <hr class="h-px mt-2 w-ful bg-[#ffffff] border-0" />
  </div>
  <div class="w-full h-full">
    <iframe
      class="w-full h-full"
      src="https://develop.steak.io.vn/store/home"
      frameborder="0"
    ></iframe>
  </div>
</template>
<script lang="ts" setup>
import { ArrowLeft, ArrowRight, RefreshCcw, ArrowUpFromLine } from 'lucide-vue-next'
</script>
