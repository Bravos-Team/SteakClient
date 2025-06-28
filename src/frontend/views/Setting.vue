<template>
  <div
    id="drop-zone"
    class="w-64 h-40 border-2 border-dashed border-gray-400 flex items-center justify-center"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
    :class="{ 'border-green-500': isDragging }"
  >
    <span>Kéo ảnh vào đây</span>
    <img v-if="previewUrl" :src="previewUrl" alt="Preview" class="mt-2 max-h-32" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const isDragging = ref(false)
const previewUrl = ref<string | null>(null)

const onDragOver = () => {
  isDragging.value = true
}

const onDragLeave = () => {
  isDragging.value = false
}

const onDrop = (e: DragEvent) => {
  isDragging.value = false

  const files = e.dataTransfer?.files
  if (!files || files.length === 0) return
  const file = files[0]

  let filePath: string | undefined = (file as any).path

  // Fallback khi dev (browser mode, không có file.path)
  if (!filePath && import.meta.env.DEV) {
    filePath = URL.createObjectURL(file)
  }

  if (!filePath) {
    console.error('❌ Không lấy được đường dẫn ảnh')
    return
  }

  if (file.type.startsWith('image/')) {
    previewUrl.value = filePath.startsWith('file://') ? filePath : filePath

    // Chỉ gửi path thật nếu có, không gửi blob URL
    if ((file as any).path) {
      window.electronAPI?.sendDroppedFile?.((file as any).path)
    }
  } else {
    alert('Chỉ hỗ trợ file ảnh.')
  }
}
</script>
