import request from '@/utils/request'

// 获取标签列表
export function getTagList(page = 1, size = 100) {
  return request.get('/signal/tags', { params: { page, size } })
}

// 创建标签
export function createTag(data) {
  return request.post('/signal/tags', data)
}

// 更新标签
export function updateTag(id, data) {
  return request.put(`/signal/tags/${id}`, data)
}

// 删除标签
export function deleteTag(id) {
  return request.delete(`/signal/tags/${id}`)
}
