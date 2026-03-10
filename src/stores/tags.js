import { defineStore } from 'pinia'
import { ref } from 'vue'

function genId() {
  return 'tag_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7)
}

export const useTagsStore = defineStore('tags', () => {
  const tags = ref([
    {
      id: 'tag_u1',
      type: 'text',
      content: 'VIP',
      textColor: '#ffffff',
      textOpacity: 100,
      bgColor: '#e6a23c',
      bgOpacity: 100,
      imageUrl: '',
      altText: ''
    },
    {
      id: 'tag_g1',
      type: 'text',
      content: '核心',
      textColor: '#ffffff',
      textOpacity: 100,
      bgColor: '#409eff',
      bgOpacity: 100,
      imageUrl: '',
      altText: ''
    },
    {
      id: 'tag_new',
      type: 'text',
      content: '新人',
      textColor: '#ffffff',
      textOpacity: 100,
      bgColor: '#67c23a',
      bgOpacity: 100,
      imageUrl: '',
      altText: ''
    }
  ])

  function addTag(tagData) {
    const tag = {
      id: genId(),
      type: 'text',
      content: '',
      textColor: '#ffffff',
      textOpacity: 100,
      bgColor: '#409eff',
      bgOpacity: 100,
      imageUrl: '',
      altText: '',
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
