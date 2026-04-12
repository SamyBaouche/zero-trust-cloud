import axios from 'axios'
import { getToken, removeToken } from './storage'

const API_BASE_URL = 'http://localhost:8081'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
})

apiClient.interceptors.request.use((config) => {
  const token = getToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken()
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }
    return Promise.reject(error)
  },
)

export default apiClient

