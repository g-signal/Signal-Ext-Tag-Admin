<template>
  <template v-if="tag.type === 'text'">
    <span class="tag-text" :style="textStyle">{{ tag.text }}</span>
  </template>
  <template v-else-if="tag.type === 'image'">
    <img
      v-if="tag.img_base64"
      :src="tag.img_base64"
      class="tag-image"
      :alt="tag.name || '标签图片'"
      :style="imageStyle"
    />
    <span v-else class="tag-placeholder">
      <el-icon style="font-size: 11px;"><Picture /></el-icon>
      图片
    </span>
  </template>
</template>

<script setup>
import { computed } from 'vue'
import { Picture } from '@element-plus/icons-vue'

const props = defineProps({
  tag: {
    type: Object,
    required: true
  }
})

const textStyle = computed(() => {
  if (props.tag.type !== 'text') return {}
  const borderWidth = props.tag.border_width || 0
  const style = {
    color: props.tag.color || '#ffffff',
    backgroundColor: props.tag.background_color || '#409eff',
    borderRadius: (props.tag.border_radius ?? 4) + 'px',
    opacity: props.tag.opacity ?? 1,
    borderWidth: borderWidth + 'px',
    borderStyle: props.tag.border_style || 'solid',
    borderColor: props.tag.border_color || 'transparent'
  }
  return style
})

const imageStyle = computed(() => ({
  // borderRadius: (props.tag.border_radius ?? 3) + 'px',
  // opacity: props.tag.opacity ?? 1
}))
</script>

<style scoped>
.tag-text {
  display: inline-block;
  padding: 3px 5px;
  font-size: 10px;
  font-weight: 500;
  white-space: nowrap;
  line-height: 1;
  transform: scale(0.9);
  vertical-align: middle;
}

.tag-image {
  height: 12px;
  width: auto;
  vertical-align: middle;
  object-fit: contain;
}

.tag-placeholder {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  background: #f0f2f5;
  color: #909399;
  vertical-align: middle;
}
</style>
