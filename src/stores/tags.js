import { defineStore } from 'pinia'
import { ref } from 'vue'

function genId() {
  return 'tag_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7)
}

export const useTagsStore = defineStore('tags', () => {
  const tags = ref([
    {
      id: 'tag_u1',
      name: 'VIP',
      type: 'text',
      text: 'VIP',
      color: '#ffffff',
      background_color: '#e6a23c',
      opacity: 1,
      img_base64: '',
      border_width: 0,
      border_radius: 4,
      border_color: '#e6a23c',
      border_style: 'solid'
    },
    {
      id: 'tag_g1',
      name: '核心',
      type: 'text',
      text: '核心',
      color: '#ffffff',
      background_color: '#409eff',
      opacity: 1,
      img_base64: '',
      border_width: 0,
      border_radius: 4,
      border_color: '#409eff',
      border_style: 'solid'
    },
    {
      id: 'tag_new',
      name: '新人',
      type: 'text',
      text: '新人',
      color: '#ffffff',
      background_color: '#67c23a',
      opacity: 1,
      img_base64: '',
      border_width: 0,
      border_radius: 4,
      border_color: '#67c23a',
      border_style: 'solid'
    }
  ])

  function addTag(tagData) {
    const tag = {
      id: genId(),
      name: '',
      type: 'text',
      text: '',
      color: '#ffffff',
      background_color: '#409eff',
      opacity: 1,
      img_base64: '',
      border_width: 0,
      border_radius: 4,
      border_color: '#409eff',
      border_style: 'solid',
      ...tagData
    }
    tags.value.push(tag)
    return tag
  }

  function updateTag(id, tagData) {
    const idx = tags.value.findIndex(t => t.id === id)
    if (idx !== -1) {
      tags.value[idx] = { ...tags.value[idx], ...tagData }
    }
  }

  function deleteTag(id) {
    tags.value = tags.value.filter(t => t.id !== id)
  }

  function getTagById(id) {
    return tags.value.find(t => t.id === id)
  }

  return { tags, addTag, updateTag, deleteTag, getTagById }
})
