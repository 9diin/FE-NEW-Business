import axios, { type AxiosInstance, type AxiosError } from "axios"

// API Base URL (Can be set via env or defaults to standard base URL)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api"

/**
 * Base Axios Client Instance
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request Interceptor: Inject Auth token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken")

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: Format errors and handle auth failures
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken")
    }
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "네트워크 통신 중 오류가 발생했습니다."
    return Promise.reject(new Error(errorMessage))
  }
)

export default apiClient
