import request from '@/utils/request'

// 获取用户列表
export function getUserList(page = 1, size = 100, phoneNumber = '') {
  const params = { page, size }
  if (phoneNumber) params.phoneNumber = phoneNumber
  return request.get('/signal/users', { params })
}

// 创建用户
export function createUser(data) {
  return request.post('/signal/users', data)
}

// 更新用户
export function updateUser(id, data) {
  return request.put(`/signal/users/${id}`, data)
}

// 删除用户
export function deleteUser(id) {
  return request.delete(`/signal/users/${id}`)
}

// 更新封禁状态
export function blockUser(id, blocked, blockReason = '') {
  return request.put(`/signal/users/${id}/block`, { blocked, blockReason })
}
