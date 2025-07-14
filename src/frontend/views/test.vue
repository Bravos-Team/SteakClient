<template>
  <button @click="login">click</button>
  <button @click="handle">get</button>
</template>
<script lang="ts" setup>
import { nextTick, onMounted } from 'vue'
import axios from 'axios'
import router from '@/router'

const handle = async () => {
  axios.get(`https://api.steak.io.vn/api/v1/dev/project/list?page=1&size=20`, {
    withCredentials: true,
  })
}

const login = async () => {
  await axios.post(
    `https://api.steak.io.vn/api/v1/dev/auth/username-login`,
    {
      username: 'dcphong2',
      password: 'Phong@1Aa',
      deviceId: '1q2w3whj4j3nk',
      deviceInfo: 'ubuntu chrome browser',
    },
    {
      withCredentials: true,
    },
  )
  router.push('/library')
}

onMounted(async () => {})
</script>
