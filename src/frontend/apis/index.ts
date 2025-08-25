import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { renewUserRefreshToken } from './library/library'
import { useAuthStore } from '@/stores/auth/useAuthStore'
const AuthStore = useAuthStore()
export const SteakApi = axios.create({
  baseURL: 'https://api.steak.io.vn/api/v1',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let refreshSubscribers: Array<() => void> = []
const addRefreshSubscriber = (callback: () => void) => {
  refreshSubscribers.push(callback)
}
const onRefreshed = () => {
  refreshSubscribers.forEach((cb) => cb())
  refreshSubscribers = []
}

SteakApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry: boolean }

    if (error.response) {
      const status = error.response.status
      if (status === 401 && !originalRequest._retry && AuthStore.user) {
        if (isRefreshing) {
          return new Promise((resolve) => {
            addRefreshSubscriber(() => {
              resolve(SteakApi(originalRequest))
            })
          })
        }
        originalRequest._retry = true
        isRefreshing = true
        try {
          await renewUserRefreshToken()

          onRefreshed()
          window.api.setAuth()
          return SteakApi(originalRequest)
        } catch (refreshError) {
          return Promise.reject(refreshError)

        } finally {
          isRefreshing = false
        }
      }
    }
    return Promise.reject(error)
  },
)
export default SteakApi
