import api from '@/lib/axios'

export const apiService = {
  get: async <T>(url: string, params?: Record<string, unknown>): Promise<T> => {
    const response = await api.get<T>(url, { params })
    return response.data
  },

  post: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await api.post<T>(url, data)
    return response.data
  },

  put: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await api.put<T>(url, data)
    return response.data
  },

  delete: async <T>(url: string): Promise<T> => {
    const response = await api.delete<T>(url)
    return response.data
  },
}

export default apiService
