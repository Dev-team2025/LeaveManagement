import { useEffect, useRef } from 'react'
import axios from 'axios'
import { useAuth } from '@/hooks/useAuth'

export function useAxios() {
  const { token, logout } = useAuth()
  const instanceRef = useRef(
    axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  )

  useEffect(() => {
    const requestInterceptor = instanceRef.current.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    })

    const responseInterceptor = instanceRef.current.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout()
        }

        return Promise.reject(error)
      },
    )

    return () => {
      instanceRef.current.interceptors.request.eject(requestInterceptor)
      instanceRef.current.interceptors.response.eject(responseInterceptor)
    }
  }, [logout, token])

  return instanceRef.current
}

export default useAxios
