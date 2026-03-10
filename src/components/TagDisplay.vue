<template>
  <template v-if="tag.type === 'text'">
    <span class="tag-text" :style="textStyle">{{ tag.content }}</span>
  </template>
  <template v-else-if="tag.type === 'image'">
    <img
      v-if="tag.imageUrl"
      :src="tag.imageUrl"
      class="tag-image"
      :alt="tag.altText || '标签图片'"
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
import { hexToRgba } from '@/utils/color'

const props = defineProps({
  tag: {
    type: Object,
    required: true
  }
})

const textStyle = computed(() => {
  if (props.tag.type !== 'text') return {}
  return {
    color: hexToRgba(props.tag.textColor, props.tag.textOpacity ?? 100),
    backgroundColor: hexToRgba(props.tag.bgColor, props.tag.bgOpacity ?? 100)
  }
})
</script>

<style scoped>
.tag-text {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  line-height: 1.6;
  vertical-align: middle;
}

.tag-image {
  max-height: 24px;
  max-width: 90px;
  vertical-align: middle;
  border-radius: 3px;
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
