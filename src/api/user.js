import request from '@/utils/request'

// 获取用户列表
export function getUserList(page = 1, size = 100) {
  return request.get('/signal/users', { params: { page, size } })
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
