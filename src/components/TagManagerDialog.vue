<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    :title="`Tag 管理 — ${entityName}`"
    width="980px"
    align-center
    destroy-on-close
    class="tag-manager-dialog"
  >
    <div class="tag-manager">
      <!-- ===== Left: Tag List ===== -->
      <div class="panel panel-list">
        <div class="panel-head">
          <span>标签列表</span>
          <el-button size="small" type="primary" :icon="Plus" @click="startAddTag">
            添加
          </el-button>
        </div>
        <div class="tag-scroll">
          <div
            v-for="tag in displayTags"
            :key="tag.id"
            class="list-item"
            :class="{ 'is-active': currentTag?.id === tag.id }"
            @click="selectTag(tag)"
          >
            <div class="list-item-tag">
              <TagDisplay :tag="tag" />
            </div>
            <div class="list-item-ops">
              <el-tooltip content="编辑" placement="top">
                <el-button
                  link
                  :icon="Edit"
                  size="small"
                  @click.stop="selectTag(tag)"
                />
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  link
                  type="danger"
                  :icon="Delete"
                  size="small"
                  @click.stop="removeTag(tag.id)"
                />
              </el-tooltip>
            </div>
          </div>
          <div v-if="!localTags.length && !isNewTag" class="list-empty">
            <el-icon style="font-size: 28px; color: #dcdfe6;"><CollectionTag /></el-icon>
            <p>暂无标签</p>
            <p>点击「添加」创建标签</p>
          </div>
        </div>
      </div>

      <!-- ===== Center: Editor ===== -->
      <div class="panel panel-editor">
        <div class="panel-head">
          <span>{{ isNewTag ? '创建标签' : (currentTag ? '编辑标签' : '标签编辑器') }}</span>
          <div v-if="currentTag" class="live-preview-badge">
            <span class="live-dot"></span>实时预览
          </div>
        </div>

        <div v-if="currentTag" class="editor-body">
          <!-- Current effect preview bar -->
          <div class="effect-bar">
            <span class="effect-label">当前效果</span>
            <div class="effect-display">
              <TagDisplay :tag="currentTag" />
            </div>
          </div>

          <!-- Name -->
          <div class="field-row">
            <span class="field-label">标签名称</span>
            <el-input
              v-model="currentTag.name"
              placeholder="输入标签名称"
              maxlength="45"
              show-word-limit
              style="flex: 1"
            />
          </div>

          <!-- Type selector -->
          <div class="field-row">
            <span class="field-label">类型</span>
            <el-radio-group v-model="currentTag.type" @change="onTypeChange">
              <el-radio value="text">
                <el-icon style="vertical-align: middle; margin-right:3px;"><Memo /></el-icon>
                文本标签
              </el-radio>
              <el-radio value="image">
                <el-icon style="vertical-align: middle; margin-right:3px;"><Picture /></el-icon>
                图片标签
              </el-radio>
            </el-radio-group>
          </div>

          <!-- ── Text fields ── -->
          <template v-if="currentTag.type === 'text'">
            <div class="field-row">
              <span class="field-label">标签内容</span>
              <el-input
                v-model="currentTag.text"
                placeholder="输入标签文本"
                maxlength="45"
                show-word-limit
                style="flex: 1"
              />
            </div>

            <div class="field-row align-start">
              <span class="field-label" style="padding-top: 6px;">文字颜色</span>
              <div class="color-group">
                <div class="color-row">
                  <el-color-picker
                    v-model="currentTag.color"
                    color-format="hex"
                    size="small"
                  />
                  <div class="color-swatch" :style="{ background: currentTag.color }" />
                  <span class="swatch-label">{{ currentTag.color }}</span>
                </div>
              </div>
            </div>

            <div class="field-row align-start">
              <span class="field-label" style="padding-top: 6px;">背景颜色</span>
              <div class="color-group">
                <div class="color-row">
                  <el-color-picker
                    v-model="currentTag.background_color"
                    color-format="hex"
                    size="small"
                  />
                  <div
                    class="color-swatch"
                    :style="{ background: hexToRgba(currentTag.background_color, currentTag.opacity * 100) }"
                  />
                  <span class="swatch-label">{{ currentTag.background_color }}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- ── Image fields ── -->
          <template v-if="currentTag.type === 'image'">
            <div class="field-row align-start">
              <span class="field-label" style="padding-top: 6px;">图片</span>
              <div class="image-area">
                <div v-if="currentTag.img_base64" class="image-preview">
                  <img :src="currentTag.img_base64" class="preview-img" />
                  <div class="image-ops">
                    <el-button
                      size="small"
                      type="danger"
                      plain
                      :icon="Delete"
                      @click="currentTag.img_base64 = ''"
                    >
                      移除
                    </el-button>
                    <el-upload
                      action="#"
                      :auto-upload="false"
                      :show-file-list="false"
                      :on-change="handleImageChange"
                      accept="image/*"
                    >
                      <el-button size="small" :icon="Refresh">更换</el-button>
                    </el-upload>
                  </div>
                </div>
                <el-upload
                  v-else
                  action="#"
                  :auto-upload="false"
                  :show-file-list="false"
                  :on-change="handleImageChange"
                  accept="image/*"
                  drag
                  class="image-uploader"
                >
                  <div class="upload-inner">
                    <el-icon style="font-size: 28px; color: #c0c4cc;"><Upload /></el-icon>
                    <p>点击或拖拽图片到此处</p>
                    <p class="upload-hint">支持 JPG / PNG / GIF / WebP</p>
                  </div>
                </el-upload>
              </div>
            </div>
          </template>

          <!-- ── 透明度 & 边框 ── -->
          <div class="field-row">
            <span class="field-label">透明度</span>
            <div class="color-group">
              <div class="opacity-row">
                <span class="opacity-label"><b>{{ Math.round(currentTag.opacity * 100) }}%</b></span>
                <el-slider
                  v-model="currentTag.opacity"
                  :min="0"
                  :max="1"
                  :step="0.01"
                  :show-tooltip="false"
                  size="small"
                  class="opacity-slider"
                />
              </div>
            </div>
          </div>

          <div class="field-row">
            <span class="field-label">边框宽度</span>
            <el-input-number
              v-model="currentTag.border_width"
              :min="0"
              :max="20"
              controls-position="right"
              size="small"
              style="width: 120px"
            />
            <span class="field-unit">px</span>
          </div>

          <div class="field-row">
            <span class="field-label">圆角</span>
            <el-input-number
              v-model="currentTag.border_radius"
              :min="0"
              :max="50"
              controls-position="right"
              size="small"
              style="width: 120px"
            />
            <span class="field-unit">px</span>
          </div>

          <template v-if="currentTag.border_width > 0">
            <div class="field-row">
              <span class="field-label">边框样式</span>
              <el-select v-model="currentTag.border_style" size="small" style="width: 120px">
                <el-option label="实线" value="solid" />
                <el-option label="虚线" value="dashed" />
                <el-option label="点线" value="dotted" />
                <el-option label="双线" value="double" />
                <el-option label="凹槽" value="groove" />
              </el-select>
            </div>
            <div class="field-row">
              <span class="field-label">边框颜色</span>
              <div class="color-row">
                <el-color-picker v-model="currentTag.border_color" color-format="hex" size="small" />
                <span class="swatch-label">{{ currentTag.border_color }}</span>
              </div>
            </div>
          </template>

          <div class="editor-actions">
            <el-button @click="cancelEdit" :icon="Close">取消</el-button>
            <el-button type="primary" @click="saveTag" :icon="Check">
              {{ isNewTag ? '添加标签' : '保存修改' }}
            </el-button>
          </div>
        </div>

        <div v-else class="editor-placeholder">
          <el-icon style="font-size: 40px; color: #dcdfe6;"><EditPen /></el-icon>
          <p>在左侧选择标签进行编辑</p>
          <p>或点击「添加」创建新标签</p>
        </div>
      </div>

      <!-- ===== Right: Multi-scene Preview ===== -->
      <div class="panel panel-preview">
        <div class="panel-head">
          <span>预览效果</span>
          <span v-if="currentTag" class="preview-hint">实时同步</span>
        </div>

        <div v-if="currentTag" class="preview-body">
          <!-- Scene 1: Standalone -->
          <div class="scene-block">
            <div class="scene-title">
              <span class="scene-dot"></span>
              标签样式
            </div>
            <div class="scene-content">
              <TagDisplay :tag="currentTag" />
            </div>
          </div>

          <!-- Scene 2: In list row -->
          <div class="scene-block">
            <div class="scene-title">
              <span class="scene-dot"></span>
              列表场景
            </div>
            <div class="scene-content">
              <div class="mock-list-row">
                <span class="mock-cell mono">U001</span>
                <span class="mock-cell">138****8001</span>
                <div class="mock-cell">
                  <TagDisplay :tag="currentTag" />
                </div>
              </div>
            </div>
          </div>

          <!-- Scene 3: Card -->
          <div class="scene-block">
            <div class="scene-title">
              <span class="scene-dot"></span>
              卡片场景
            </div>
            <div class="scene-content">
              <div class="mock-card">
                <div class="mock-avatar">U</div>
                <div class="mock-card-body">
                  <div class="mock-name">用户昵称</div>
                  <div class="mock-tags">
                    <TagDisplay :tag="currentTag" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Scene 4: Multi-tag (combined with existing saved tags) -->
          <div v-if="allPreviewTags.length > 1" class="scene-block">
            <div class="scene-title">
              <span class="scene-dot"></span>
              多标签场景
            </div>
            <div class="scene-content">
              <div class="mock-multi-tags">
                <TagDisplay
                  v-for="t in allPreviewTags"
                  :key="t.id"
                  :tag="t"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-else class="preview-placeholder">
          <el-icon style="font-size: 36px; color: #dcdfe6;"><View /></el-icon>
          <p>编辑标签后查看预览</p>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="$emit('update:visible', false)">关 闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Plus, Delete, Edit, Close, Check, Refresh,
  Upload, Picture, Memo, EditPen, CollectionTag, View
} from '@element-plus/icons-vue'
import TagDisplay from './TagDisplay.vue'
import { hexToRgba } from '@/utils/color'

const props = defineProps({
  visible: Boolean,
  entityName: { type: String, default: '' },
  tags: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:visible', 'update:tags'])

// ── State ──────────────────────────────────────
const localTags = ref([])
const currentTag = ref(null)
const isNewTag = ref(false)

// ── Sync on open ──────────────────────────────
watch(
  () => props.visible,
  (val) => {
    if (val) {
      localTags.value = props.tags.map(t => ({ ...t }))
      currentTag.value = null
      isNewTag.value = false
    }
  }
)

// ── displayTags: live preview in list ─────────
// While editing, the matching tag in the list reflects currentTag in real time
const displayTags = computed(() => {
  if (!currentTag.value || isNewTag.value) return localTags.value
  return localTags.value.map(t =>
    t.id === currentTag.value.id ? { ...currentTag.value } : t
  )
})

// Combined tags for multi-tag preview scene
const allPreviewTags = computed(() => {
  if (!currentTag.value) return localTags.value
  const others = localTags.value.filter(t => t.id !== currentTag.value.id)
  return [...others, currentTag.value]
})

// ── Helpers ───────────────────────────────────
function genId() {
  return 'tag_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7)
}

function makeDefaultTag() {
  return {
    id: genId(),
    name: '新标签',
    type: 'text',
    text: '新标签',
    color: '#ffffff',
    background_color: '#409eff',
    opacity: 1,
    img_base64: '',
    border_width: 0,
    border_radius: 4,
    border_color: '#409eff',
    border_style: 'solid'
  }
}

// ── Actions ───────────────────────────────────
function startAddTag() {
  isNewTag.value = true
  currentTag.value = makeDefaultTag()
}

function selectTag(tag) {
  isNewTag.value = false
  currentTag.value = { ...tag }
}

function onTypeChange() {
  if (!currentTag.value) return
  if (currentTag.value.type === 'text') {
    currentTag.value.text = currentTag.value.text || '新标签'
  }
}

function handleImageChange(file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    if (currentTag.value) currentTag.value.img_base64 = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

function saveTag() {
  if (!currentTag.value) return

  if (currentTag.value.type === 'text' && !currentTag.value.text.trim()) {
    ElMessage.warning('请输入标签内容')
    return
  }
  if (currentTag.value.type === 'image' && !currentTag.value.img_base64) {
    ElMessage.warning('请上传图片')
    return
  }

  const saved = { ...currentTag.value }

  if (isNewTag.value) {
    localTags.value.push(saved)
    ElMessage.success('标签已添加')
  } else {
    const idx = localTags.value.findIndex(t => t.id === saved.id)
    if (idx !== -1) localTags.value[idx] = saved
    ElMessage.success('标签已保存')
  }

  emit('update:tags', [...localTags.value])
  isNewTag.value = false
  currentTag.value = { ...saved }
}

function cancelEdit() {
  if (isNewTag.value) {
    currentTag.value = null
    isNewTag.value = false
  } else {
    const original = localTags.value.find(t => t.id === currentTag.value?.id)
    currentTag.value = original ? { ...original } : null
  }
}

function removeTag(id) {
  localTags.value = localTags.value.filter(t => t.id !== id)
  if (currentTag.value?.id === id) {
    currentTag.value = null
    isNewTag.value = false
  }
  emit('update:tags', [...localTags.value])
  ElMessage.success('标签已删除')
}
</script>

<style scoped>
/* ── Dialog container ── */
.tag-manager {
  display: flex;
  height: 560px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
}

/* ── Shared panel ── */
.panel {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #f8fafc;
  border-bottom: 1px solid #e4e7ed;
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  flex-shrink: 0;
}

/* ── Left list ── */
.panel-list {
  width: 200px;
  border-right: 1px solid #e4e7ed;
  flex-shrink: 0;
}

.tag-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  gap: 6px;
}

.list-item:hover {
  background: #f0f7ff;
}

.list-item.is-active {
  background: #ecf5ff;
  border: 1px solid #b3d8ff;
}

.list-item-tag {
  flex: 1;
  overflow: hidden;
  min-width: 0;
}

.list-item-ops {
  display: flex;
  gap: 0;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.15s;
}

.list-item:hover .list-item-ops,
.list-item.is-active .list-item-ops {
  opacity: 1;
}

.list-empty {
  padding-top: 40px;
  text-align: center;
  color: #c0c4cc;
  font-size: 12px;
  line-height: 1.8;
}

/* ── Center editor ── */
.panel-editor {
  flex: 1;
  border-right: 1px solid #e4e7ed;
  overflow: hidden;
}

.live-preview-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #67c23a;
  font-weight: 400;
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #67c23a;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.editor-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 18px;
}

/* Effect bar */
.effect-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: linear-gradient(135deg, #f0f7ff, #f8fafc);
  border: 1px solid #d9ecff;
  border-radius: 8px;
  margin-bottom: 16px;
}

.effect-label {
  font-size: 11px;
  color: #909399;
  white-space: nowrap;
}

.effect-display {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  flex: 1;
}

/* Form rows */
.field-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.field-row.align-start {
  align-items: flex-start;
}

.field-label {
  width: 68px;
  flex-shrink: 0;
  font-size: 13px;
  color: #606266;
  white-space: nowrap;
}

/* Color controls */
.color-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.color-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-swatch {
  width: 32px;
  height: 22px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(-45deg, #ccc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ccc 75%),
    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size: 6px 6px;
  background-position: 0 0, 0 3px, 3px -3px, -3px 0;
  position: relative;
}

.color-swatch::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 3px;
  background: inherit;
}

.swatch-label {
  font-size: 11px;
  color: #909399;
  font-family: monospace;
}

.opacity-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.opacity-label {
  font-size: 12px;
  color: #606266;
  white-space: nowrap;
  min-width: 48px;
}

.opacity-label b {
  color: #409eff;
  font-weight: 600;
}

.field-unit {
  font-size: 12px;
  color: #909399;
  flex-shrink: 0;
}

.opacity-slider {
  flex: 1;
}

/* Image fields */
.image-area {
  flex: 1;
}

.image-preview {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.preview-img {
  max-width: 140px;
  max-height: 100px;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
  object-fit: contain;
}

.image-ops {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.image-uploader {
  width: 100%;
}

.upload-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px;
  color: #909399;
}

.upload-inner p {
  font-size: 13px;
  margin: 0;
}

.upload-hint {
  font-size: 11px !important;
  color: #c0c4cc !important;
}

/* Actions */
.editor-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 14px;
  border-top: 1px solid #f0f2f5;
}

.editor-placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #c0c4cc;
  font-size: 13px;
  text-align: center;
  line-height: 1.8;
}

/* ── Right preview ── */
.panel-preview {
  width: 270px;
  flex-shrink: 0;
  background: #f8fafc;
  overflow: hidden;
}

.preview-hint {
  font-size: 11px;
  color: #67c23a;
  font-weight: 400;
}

.preview-body {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.scene-block {
  background: white;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  overflow: hidden;
}

.scene-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #909399;
  padding: 6px 10px;
  background: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.scene-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #409eff;
  flex-shrink: 0;
}

.scene-content {
  padding: 10px 12px;
}

/* Mock list row */
.mock-list-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #606266;
}

.mock-cell {
  white-space: nowrap;
}

.mock-cell.mono {
  font-family: monospace;
  color: #909399;
}

/* Mock card */
.mock-card {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mock-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409eff, #53a8ff);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

.mock-card-body {
  flex: 1;
  min-width: 0;
}

.mock-name {
  font-size: 12px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 5px;
}

.mock-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

/* Mock multi-tags */
.mock-multi-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  align-items: center;
}

.preview-placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #c0c4cc;
  font-size: 13px;
}
</style>

<style>
/* Override Element Plus dialog padding for this component */
.tag-manager-dialog .el-dialog__body {
  padding: 16px 20px;
}

.tag-manager-dialog .el-dialog__header {
  padding: 16px 20px 12px;
  border-bottom: 1px solid #f0f2f5;
}

.tag-manager-dialog .el-dialog__footer {
  padding: 12px 20px;
  border-top: 1px solid #f0f2f5;
}
</style>
