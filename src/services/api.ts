import axios from 'axios'
import router from '@/router'

const baseURL = process.env.NODE_ENV === 'production' 
  ? import.meta.env.VITE_API_BASE_URL  // 生产环境使用 Worker URL
  : '/apis'  // 开发环境使用代理

const api = axios.create({
  baseURL,
  withCredentials: true, // 允许跨域请求携带 cookie
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})


// 请求拦截器
api.interceptors.request.use(
  async config => {
    // 对于登录请求，先获取 CSRF token
    if (config.url === '/login') {
      try {
        await getCsrfCookie()
      } catch (error) {
        console.error('获取 CSRF token 失败:', error)
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status
    
    switch (status) {
      case 401:
        // 未授权，跳转到登录页
        router.push('/login')
        break
      case 403:
        // 禁止访问
        console.error('没有权限访问该资源')
        break
      case 404:
        // 资源不存在
        console.error('请求的资源不存在')
        break
      case 500:
        // 服务器错误
        console.error('服务器错误')
        break
      default:
        console.error('请求失败')
    }
    
    return Promise.reject(error)
  }
)

export const getServerInfo = () => api.get('/')
export const getCsrfCookie = () => api.get('/csrf-cookie', {
  withCredentials: true,
  headers: {
    'Access-Control-Allow-Credentials': 'true'
  }
})
export const login = (credentials: { email: string; password: string }) => {
  console.log(credentials)
  console.log(import.meta.env.VITE_API_BASE_URL)
  console.log(document.cookie,'document.cookie')
  // 直接发送登录请求，拦截器会处理 CSRF token
  return api.post('/login', credentials)
}
export const logout = () => api.post('/logout', {}, {
  withCredentials: true
})
export const getUserInfo = () => api.get('/api/user', {
  withCredentials: true
})

export default api 