import router from '@/router'
import axios from 'axios'

export const SteakApi = axios.create({
  baseURL: 'https://api.steak.io.vn/api/v1',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

SteakApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status
    if (status === 401) {
      console.log('Unauthorized access, redirecting to login...')
    }
  },
)
