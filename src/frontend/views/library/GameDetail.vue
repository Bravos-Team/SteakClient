<template>
    <div>
      <h1>Game Detail: {{ $route.params.appName }}</h1>
      <!-- Thêm nội dung chi tiết game ở đây -->
    </div>
  </template>
  
  <script setup>
  // Có thể lấy appName từ route params
  import { useRoute } from 'vue-router';
  const route = useRoute();
  console.log('App Name:', route.params.appName); // Debug
  </script>