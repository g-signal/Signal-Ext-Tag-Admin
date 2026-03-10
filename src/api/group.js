import request from '@/utils/request'

// 获取群组列表
export function getGroupList(page = 1, size = 100) {
  return request.get('/signal/groups', { params: { page, size } })
}

// 创建群组
export function createGroup(data) {
  return request.post('/signal/groups', data)
}

// 更新群组
export function updateGroup(id, data) {
  return request.put(`/signal/groups/${id}`, data)
}

// 删除群组
export function deleteGroup(id) {
  return request.delete(`/signal/groups/${id}`)
}
