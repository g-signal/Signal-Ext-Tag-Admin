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
request.interceptors.response.use(
  (response) => {
    const res = response.data
    // 业务状态码约定：code === 0 或 200 为成功，可根据实际接口调整
    if (res.code !== undefined && res.code !== 0 && res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res
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
