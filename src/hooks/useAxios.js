import { useEffect, useMemo } from 'react'
import axios from 'axios'
import { useAuth } from '@/hooks/useAuth'

export function useAxios() {
  const { token, logout } = useAuth()
  
  const instance = useMemo(
    () =>
      axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    []
  )

  useEffect(() => {
    const requestInterceptor = instance.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    })

    const responseInterceptor = instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout()
        }

        return Promise.reject(error)
      },
    )

    return () => {
      instance.interceptors.request.eject(requestInterceptor)
      instance.interceptors.response.eject(responseInterceptor)
    }
  }, [instance, logout, token])

  return instance
}

export default useAxios
