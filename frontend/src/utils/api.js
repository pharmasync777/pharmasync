import axios from 'axios'

const api = axios.create({
  // Di production: sama-sama satu domain, cukup /api
  // Di development: Vite proxy /api → localhost:5000
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

// Attach token ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 global
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
