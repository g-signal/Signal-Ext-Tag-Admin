import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '@/router'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// ── 请求拦截器 ────────────────────────────────
request.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── 响应拦截器 ────────────────────────────────
// 成功时直接返回 res.data，调用方无需再手动取 .data
request.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.errorCode !== undefined && res.errorCode !== 0) {
      ElMessage.error(res.errorMsg || '请求失败')
      return Promise.reject(new Error(res.errorMsg || '请求失败'))
    }
    return res.data !== undefined ? res.data : res
  },
  (error) => {
    if (error.response) {
      const status = error.response.status
      if (status === 401) {
        ElMessageBox.confirm('登录已过期，请重新登录', '提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          sessionStorage.removeItem('isLoggedIn')
          sessionStorage.removeItem('token')
          router.push('/login')
        })
      } else if (status === 403) {
        ElMessage.error('无权限访问')
      } else if (status === 500) {
        ElMessage.error('服务器错误，请稍后再试')
      } else {
        ElMessage.error(error.response.data?.message || `请求错误 ${status}`)
      }
    } else if (error.code === 'ECONNABORTED') {
      ElMessage.error('请求超时，请检查网络')
    } else {
      ElMessage.error('网络异常，请检查网络连接')
    }
    return Promise.reject(error)
  }
)

export default request
