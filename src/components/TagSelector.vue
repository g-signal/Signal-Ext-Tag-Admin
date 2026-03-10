<template>
  <div class="tag-selector">
    <div v-if="tagsStore.tags.length === 0" class="no-tags-hint">
      暂无可选标签，请先在
      <router-link to="/admin/tags" @click.stop>Tag 管理</router-link>
      中创建标签
    </div>
    <div v-else class="tag-options">
      <div
        v-for="tag in tagsStore.tags"
        :key="tag.id"
        class="tag-option"
        :class="{ 'is-selected': modelValue.includes(tag.id) }"
        @click="toggle(tag.id)"
      >
        <TagDisplay :tag="tag" />
        <el-icon v-if="modelValue.includes(tag.id)" class="check-icon"><Check /></el-icon>
      </div>
    </div>
    <div v-if="modelValue.length" class="selected-hint">
      已选 {{ modelValue.length }} 个标签
    </div>
  </div>
</template>

<script setup>
import { Check } from '@element-plus/icons-vue'
import TagDisplay from '@/components/TagDisplay.vue'
import { useTagsStore } from '@/stores/tags'

const tagsStore = useTagsStore()

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

function toggle(tagId) {
  const current = [...props.modelValue]
  const idx = current.indexOf(tagId)
  if (idx === -1) {
    current.push(tagId)
  } else {
    current.splice(idx, 1)
  }
  emit('update:modelValue', current)
}
</script>

<style scoped>
.tag-selector {
  width: 100%;
}

.no-tags-hint {
  font-size: 12px;
  color: #909399;
  padding: 8px 0;
}

.no-tags-hint a {
  color: #409eff;
  text-decoration: none;
}

.no-tags-hint a:hover {
  text-decoration: underline;
}

.tag-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 4px 0;
}

.tag-option {
  position: relative;
  cursor: pointer;
  border-radius: 6px;
  padding: 5px 8px;
  border: 1.5px solid transparent;
  transition: border-color 0.15s, background 0.15s;
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f5f7fa;
}

.tag-option:hover {
  border-color: #c6e2ff;
  background: #ecf5ff;
}

.tag-option.is-selected {
  border-color: #409eff;
  background: #ecf5ff;
}

.check-icon {
  font-size: 12px;
  color: #409eff;
}

.selected-hint {
  font-size: 11px;
  color: #909399;
  margin-top: 6px;
}
</style>
