import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUsersStore = defineStore('users', () => {
  const users = ref([
    {
      id: 'U001',
      phone: '13800138001',
      remark: 'VIP 测试用户',
      tagIds: ['tag_u1']
    },
    {
      id: 'U002',
      phone: '13900139002',
      remark: '普通用户',
      tagIds: ['tag_new']
    },
    {
      id: 'U003',
      phone: '13700137003',
      remark: '',
      tagIds: []
    }
  ])

  function addUser(userData) {
    users.value.push({ ...userData, tagIds: userData.tagIds || [] })
  }

  function updateUser(id, userData) {
    const idx = users.value.findIndex(u => u.id === id)
    if (idx !== -1) {
      users.value[idx] = { ...users.value[idx], ...userData }
    }
  }

  function deleteUser(id) {
    users.value = users.value.filter(u => u.id !== id)
  }

  // Called when a tag is removed globally — strip it from all users
  function removeTagRef(tagId) {
    users.value.forEach(u => {
      u.tagIds = u.tagIds.filter(id => id !== tagId)
    })
  }

  return { users, addUser, updateUser, deleteUser, removeTagRef }
})
