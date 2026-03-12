<template>
  <div class="tag-selector">
    <div v-if="displayTags.length === 0" class="no-tags-hint">
      暂无可选标签，请先在
      <router-link to="/admin/tags" @click.stop>Tag 管理</router-link>
      中创建标签
    </div>
    <el-select
      v-else
      :model-value="modelValue"
      @update:model-value="emit('update:modelValue', $event)"
      multiple
      collapse-tags
      collapse-tags-tooltip
      filterable
      placeholder="请选择标签"
      popper-class="tag-selector-container"
      style="width: 100%"
    >
      <el-option
        v-for="tag in displayTags"
        :key="tag.id"
        :label="tag.name"
        :value="tag.id"
      >
        <div class="option-content">
          <span style="margin-right: 10px;">{{ tag.name }}</span> <TagDisplay :tag="tag" />
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import TagDisplay from '@/components/TagDisplay.vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const displayTags = computed(() => props.options)
</script>

<style scoped>
.tag-selector {
  width: 100%;
}
.tag-selector-container .el-select-dropdown__item {
  display: flex;
  align-items: center;
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

.option-content {
  display: flex;
  align-items: center;
}
</style>
