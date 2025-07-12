<template>
  <div class="w-full flex flex-col">
    <div class="flex">
      <div class="flex justify-center pl-4 gap-4">
        <ArrowLeft class="cursor-pointer" @click="handleNavigation('back', currentUrl)" />
        <ArrowRight @click="handleNavigation('forward', currentUrl)"
          :class="{ 'cursor-pointer': canGoForward, 'opacity-30': !canGoForward }" />
        <RefreshCcw class="cursor-pointer" @click="refreshIframe" :class="{ 'animate-spin': isRefreshing }" />
      </div>
      <div class="grow flex justify-center items-center">
        <input class="w-full text-center font-serif italic focus:outline-none focus:border-none" type="text" readonly
          v-model="currentUrl" />
      </div>
      <div class="flex justify-center pr-4">
        <ArrowUpFromLine class="cursor-pointer" @click="handleNavigation('openInBrowser', currentUrl)" />
      </div>
    </div>
    <hr class="h-px mt-2 w-ful bg-[#ffffff] border-0" />
  </div>
  <div class="w-full h-full relative">
    <!-- Loading indicator -->
    <div v-if="isRefreshing" class="absolute inset-0 flex items-center justify-center bg-black/10 z-10">
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 bg-sky-500 rounded-full animate-bounce" style="animation-delay: 0s"></div>
        <div class="w-3 h-3 bg-sky-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        <div class="w-3 h-3 bg-sky-500 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
      </div>
    </div>
    <iframe ref="storeIframe" class="w-full h-full" :src="currentUrl" frameborder="0" @load="handleIframeLoad"></iframe>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ArrowLeft, ArrowRight, RefreshCcw, ArrowUpFromLine } from 'lucide-vue-next'
import { useNavigation } from '@/composables/useNavigation';

const { handleNavigation } = useNavigation();
const storeIframe = ref<HTMLIFrameElement | null>(null);
const currentUrl = ref('https://develop.steak.io.vn/store/home');
const isRefreshing = ref(false);
let refreshTimeout: number | null = null;


// Refresh button
const refreshIframe = () => {
  if (isRefreshing.value) return;
  isRefreshing.value = true;

  // Get current url
  if (storeIframe.value) {

    // Set url
    const url = storeIframe.value.src || currentUrl.value;
    storeIframe.value.src = 'about:blank';

    setTimeout(() => {
      if (storeIframe.value) {
        storeIframe.value.src = url;
      }
    }, 500);
  }

  refreshTimeout = window.setTimeout(() => {
    isRefreshing.value = false;
  }, 1000);
};

const handleIframeLoad = () => {
  isRefreshing.value = false;

  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
    refreshTimeout = null;
  }
};

// Refresh the iframe when the component is mounted
onBeforeUnmount(() => {
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
  }
});
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>