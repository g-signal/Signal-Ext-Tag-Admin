import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGroupsStore = defineStore('groups', () => {
  const groups = ref([
    {
      id: 'G001',
      remark: '核心用户群',
      tagIds: ['tag_g1']
    },
    {
      id: 'G002',
      remark: '新人引导群',
      tagIds: ['tag_new']
    },
    {
      id: 'G003',
      remark: 'VIP专属群',
      tagIds: ['tag_u1', 'tag_g1']
    }
  ])

  function addGroup(groupData) {
    groups.value.push({ ...groupData, tagIds: groupData.tagIds || [] })
  }

  function updateGroup(id, groupData) {
    const idx = groups.value.findIndex(g => g.id === id)
    if (idx !== -1) {
      groups.value[idx] = { ...groups.value[idx], ...groupData }
    }
  }

  function deleteGroup(id) {
    groups.value = groups.value.filter(g => g.id !== id)
  }

  // Called when a tag is removed globally — strip it from all groups
  function removeTagRef(tagId) {
    groups.value.forEach(g => {
      g.tagIds = g.tagIds.filter(id => id !== tagId)
    })
  }

  return { groups, addGroup, updateGroup, deleteGroup, removeTagRef }
})
