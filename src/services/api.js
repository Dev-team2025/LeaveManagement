import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  try {
    const authData = JSON.parse(localStorage.getItem('lms_auth') || 'null')
    if (authData?.token) {
      config.headers.Authorization = `Bearer ${authData.token}`
    }
  } catch (error) {
    console.error('Error reading auth from localStorage:', error)
  }
  return config
})

export default api
