import axios from 'axios'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // 允许跨域请求携带 cookie
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})


// 请求拦截器
api.interceptors.request.use(
  config => {
    // 从 cookie 中获取 XSRF-TOKEN
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1]
    
    if (token) {
      // 解码 cookie 值
      const decodedToken = decodeURIComponent(token)
      // 设置 X-XSRF-TOKEN 头
      config.headers['X-XSRF-TOKEN'] = decodedToken
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
export const login = async (credentials: { email: string; password: string }) => {
  // 先获取 CSRF cookie
  await getCsrfCookie()
  // 然后进行登录
  return api.post('/login', credentials)
}
export const logout = () => api.post('/logout', {}, {
  withCredentials: true
})
export const getUserInfo = () => api.get('/api/user', {
  withCredentials: true
})

export default api 