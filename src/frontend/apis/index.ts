import axios from 'axios'
import { toast } from 'vue-sonner'

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
      toast.error('Unauthorized access. Please log in again.')
    }
  },
)
export default SteakApi
