<template>
  <div class="page-wrap">
    <div class="page-header">
      <div>
        <h2 class="page-title">Tag 管理</h2>
        <p class="page-desc">创建和管理全局标签，可在用户与群组中引用</p>
      </div>
    </div>

    <div class="tag-manager">
      <!-- ===== Left: Tag List ===== -->
      <div class="panel panel-list">
        <div class="panel-head">
          <span>标签列表 <em class="tag-count">{{ tags.length }}</em></span>
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
            <div class="list-item-content">
              <div class="list-item-name">{{ tag.name }}</div>
              <TagDisplay :tag="tag" />
            </div>
            <div class="list-item-ops">
              <el-tooltip content="编辑" placement="top">
                <el-button link :icon="EditIcon" size="small" @click.stop="selectTag(tag)" />
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  link
                  type="danger"
                  :icon="Delete"
                  size="small"
                  @click.stop="handleDelete(tag.id)"
                />
              </el-tooltip>
            </div>
          </div>
          <div v-if="!tags.length && !isNewTag" class="list-empty">
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
          <div v-if="currentTag" class="live-badge">
            <span class="live-dot"></span>实时预览
          </div>
        </div>

        <div v-if="currentTag" class="editor-body">
          <!-- Current effect bar -->
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

          <!-- Type -->
          <div class="field-row">
            <span class="field-label">类型</span>
            <el-radio-group v-model="currentTag.type" @change="onTypeChange">
              <el-radio value="text">
                <el-icon style="vertical-align: middle; margin-right: 3px;"><Memo /></el-icon>
                文本标签
              </el-radio>
              <el-radio value="image">
                <el-icon style="vertical-align: middle; margin-right: 3px;"><Picture /></el-icon>
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
                  <el-color-picker v-model="currentTag.color" color-format="hex" size="small" />
                  <div class="color-swatch" :style="{ background: currentTag.color }" />
                  <span class="swatch-label">{{ currentTag.color }}</span>
                </div>
              </div>
            </div>

            <div class="field-row align-start">
              <span class="field-label" style="padding-top: 6px;">背景颜色</span>
              <div class="color-group">
                <div class="color-row">
                  <el-color-picker v-model="currentTag.background_color" color-format="hex" size="small" />
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
                <div class="image-spec-hint">
                  建议尺寸 <b>60 × 60 px</b>，仅支持 <b>1:1</b> 比例
                </div>
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
                    <p class="upload-hint">支持 JPG / PNG / GIF / SVG / WebP</p>
                  </div>
                </el-upload>
              </div>
            </div>
          </template>

          <!-- ── 透明度 & 边框 & 优先级（仅文本标签）── -->
          <template v-if="currentTag.type === 'text'">
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

          <div class="field-row">
            <span class="field-label">优先级</span>
            <el-input-number
              v-model="currentTag.priority"
              :min="0"
              controls-position="right"
              size="small"
              style="width: 120px"
            />
            <span class="field-unit" style="color: #c0c4cc;">越小越优先</span>
          </div>

          <div class="editor-actions">
            <el-button @click="cancelEdit" :icon="Close">取消</el-button>
            <el-button type="primary" @click="saveTag" :icon="Check" :loading="submitting">
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
          <span v-if="currentTag" class="preview-sync">实时同步</span>
        </div>

        <div v-if="currentTag" class="preview-body">
          <!-- Scene 1: Standalone -->
          <div class="scene-block">
            <div class="scene-title">
              <span class="scene-dot"></span>标签样式
            </div>
            <div class="scene-content">
              <TagDisplay :tag="currentTag" />
            </div>
          </div>

          <!-- Scene 2: User list row -->
          <div class="scene-block">
            <div class="scene-title">
              <span class="scene-dot dot-user"></span>会话列表
            </div>
            <div class="scene-content scene-content-chat">
              <div class="mock-chat-item">
                <div class="mock-chat-avatar">
                  <svg viewBox="0 0 100 100" width="100%" height="100%">
                    <path d="M50,10 C35,10 22,23 22,40 C22,55 35,68 50,68 C65,68 78,55 78,40 C78,23 65,10 50,10 Z M50,75 C25,75 10,90 10,100 L90,100 C90,90 75,75 50,75 Z"/>
                  </svg>
                </div>
                <div class="mock-chat-content">
                  <div class="mock-chat-header">
                    <span class="mock-chat-username">用户昵称</span>
                    <TagDisplay :tag="currentTag" />
                    <span class="mock-chat-time">Nov 12</span>
                  </div>
                  <div class="mock-chat-message">最后一条消息内容预览…</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Scene 3: Group list row -->
          <div class="scene-block">
            <div class="scene-content " style="padding: 0;">
              <div class="mock-notification-item">
                <div class="mock-notif-avatar">
                  <svg class="mock-notif-icon" viewBox="0 0 24 24">
                    <path d="M16,11c1.66,0 2.99,-1.34 2.99,-3s-1.33,-3 -2.99,-3c-1.66,0 -3,1.34 -3,3s1.34,3 3,3m-8,0c1.66,0 2.99,-1.34 2.99,-3s-1.33,-3 -2.99,-3c-1.66,0 -3,1.34 -3,3s1.34,3 3,3m0,2c-2.33,0 -7,1.17 -7,3.5v1.5h14v-1.5c0,-2.33 -4.67,-3.5 -7,-3.5m8,0c-2.33,0 -7,1.17 -7,3.5v1.5h14v-1.5c0,-2.33 -4.67,-3.5 -7,-3.5z"/>
                  </svg>
                </div>
                <div class="mock-notif-content">
                  <div class="mock-notif-top">
                    <span class="mock-notif-name">某某用户群</span>
                    <TagDisplay :tag="currentTag" />
                  </div>
                  <div class="mock-notif-message">You receivedasecure message</div>
                </div>
                <div class="mock-notif-date">Feb 5</div>
              </div>
            </div>
          </div>

          <!-- Scene 4: User card -->
          <div class="scene-block">
            <div class="scene-title">
              <span class="scene-dot dot-card"></span>聊天页面
            </div>
            <div class="scene-content scene-content-flush">
              <div class="mock-chat-header-bar">
                <div class="mock-hdr-back">
                  <el-icon><ArrowLeftBold /></el-icon>
                </div>
                <div class="mock-hdr-title-wrapper">
                  <div class="mock-hdr-title-row">
                    <span class="mock-hdr-name">Attendance</span>
                    <TagDisplay :tag="currentTag" />
                    <el-icon><CaretRight /></el-icon>
                  </div>
                  <div class="mock-hdr-subtitle">For efficient leave and attendance management</div>
                </div>
                <div class="mock-hdr-more">
                  <el-icon><MoreFilled /></el-icon>
                </div>
              </div>
            </div>
          </div>

          <!-- Scene 5: Multi-tag (if other tags exist) -->
          <div v-if="allPreviewTags.length > 1" class="scene-block">
            <div class="scene-title">
              <span class="scene-dot dot-multi"></span>多标签场景
            </div>
            <div class="scene-content">
              <div class="mock-multi-tags">
                <TagDisplay v-for="t in allPreviewTags" :key="t.id" :tag="t" />
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus, Delete, Edit as EditIcon, Close, Check, Refresh,
  Upload, Picture, Memo, EditPen, CollectionTag, View,
  CaretRight, ArrowLeftBold, MoreFilled
} from '@element-plus/icons-vue'
import TagDisplay from '@/components/TagDisplay.vue'
import { getTagList, createTag, updateTag, deleteTag } from '@/api/tag'
import { hexToRgba } from '@/utils/color'

function apiToStore(t) {
  return {
    id: String(t.id),
    name: t.name || '',
    type: t.type === 0 ? 'text' : 'image',
    text: t.text || '',
    color: t.color || '#ffffff',
    background_color: t.backgroundColor || '#409eff',
    opacity: t.opacity ?? 1,
    img_base64: t.imgBase64 || '',
    border_width: t.borderWidth || 0,
    border_radius: t.borderRadius ?? 4,
    border_color: t.borderColor || '',
    border_style: t.borderStyle || 'solid',
    priority: t.priority ?? 0
  }
}

function storeToApi(t) {
  return {
    name: t.name,
    type: t.type === 'text' ? 0 : 1,
    text: t.type === 'text' ? t.text : null,
    imgBase64: t.type === 'image' ? t.img_base64 : null,
    backgroundColor: t.background_color || null,
    color: t.color || null,
    opacity: t.opacity ?? 1,
    borderWidth: t.border_width ?? null,
    borderRadius: t.border_radius ?? null,
    borderColor: t.border_color || null,
    borderStyle: t.border_style || null,
    priority: t.priority ?? 0
  }
}

const tags = ref([])
const loading = ref(false)
const submitting = ref(false)

async function fetchTags() {
  loading.value = true
  try {
    const data = await getTagList()
    tags.value = (data || []).map(apiToStore)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTags()
})

const currentTag = ref(null)
const isNewTag = ref(false)

const displayTags = computed(() => {
  if (!currentTag.value || isNewTag.value) return tags.value
  return tags.value.map(t =>
    t.id === currentTag.value.id ? { ...currentTag.value } : t
  )
})

const allPreviewTags = computed(() => {
  if (!currentTag.value) return tags.value
  const others = tags.value.filter(t => t.id !== currentTag.value.id)
  return [...others, currentTag.value]
})

function makeDefaultTag() {
  return {
    id: '__new__',
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
    border_style: 'solid',
    priority: 0
  }
}

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
  const maxSize = 2 * 1024 * 1024 // 2MB
  if (file.size > maxSize) {
    ElMessage.error('图片大小不能超过 2MB')
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      if (img.width !== img.height) {
        ElMessage.error(`图片比例必须为 1:1，当前为 ${img.width}×${img.height}`)
        return
      }
      if (currentTag.value) currentTag.value.img_base64 = e.target.result
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

async function saveTag() {
  if (!currentTag.value) return
  if (currentTag.value.type === 'text' && !currentTag.value.text.trim()) {
    ElMessage.warning('请输入标签内容')
    return
  }
  if (currentTag.value.type === 'image' && !currentTag.value.img_base64) {
    ElMessage.warning('请上传图片')
    return
  }

  submitting.value = true
  try {
    if (isNewTag.value) {
      const apiTag = await createTag(storeToApi(currentTag.value))
      const saved = apiToStore(apiTag)
      isNewTag.value = false
      await fetchTags()
      currentTag.value = { ...(tags.value.find(t => t.id === saved.id) || saved) }
      ElMessage.success('标签已创建')
    } else {
      const savedId = currentTag.value.id
      await updateTag(savedId, storeToApi(currentTag.value))
      await fetchTags()
      currentTag.value = { ...(tags.value.find(t => t.id === savedId) || currentTag.value) }
      ElMessage.success('标签已保存')
    }
  } catch {} finally {
    submitting.value = false
  }
}

function cancelEdit() {
  if (isNewTag.value) {
    currentTag.value = null
    isNewTag.value = false
  } else {
    const original = tags.value.find(t => t.id === currentTag.value?.id)
    currentTag.value = original ? { ...original } : null
  }
}

function handleDelete(id) {
  ElMessageBox.confirm(
    '确认删除该标签？此操作不可撤销。',
    '删除确认',
    {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      confirmButtonClass: 'el-button--danger',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deleteTag(id)
      tags.value = tags.value.filter(t => t.id !== id)
      if (currentTag.value?.id === id) {
        currentTag.value = null
        isNewTag.value = false
      }
      ElMessage.success('标签已删除')
    } catch {}
  }).catch(() => {})
}
</script>

<style scoped >
.page-wrap {
  background: white;
  border-radius: 10px;
  padding: 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  height: calc(100vh - 112px);
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.page-title {
  font-size: 17px;
  font-weight: 700;
  color: #1d2939;
  margin-bottom: 3px;
}

.page-desc {
  font-size: 12px;
  color: #909399;
}

/* ── 3-panel layout ── */
.tag-manager {
  display: flex;
  flex: 1;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  min-height: 0;
}

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
  width: 250px;
  border-right: 1px solid #e4e7ed;
  flex-shrink: 0;
}

.tag-count {
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  color: #909399;
  margin-left: 4px;
  background: #f0f2f5;
  padding: 1px 6px;
  border-radius: 10px;
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
  padding: 8px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  gap: 6px;
  border: 1px solid transparent;
}

.list-item:hover {
  background: #f0f7ff;
}

.list-item.is-active {
  background: #ecf5ff;
  border-color: #b3d8ff;
}

.list-item-content {
  flex: 1;
  overflow: hidden;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.list-item-name {
  font-size: 11px;
  color: #606266;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 0;
  max-width: 110px;
  /* margin-right: 5px; */
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
  padding-top: 50px;
  text-align: center;
  color: #c0c4cc;
  font-size: 12px;
  line-height: 2;
}

/* ── Center editor ── */
.panel-editor {
  flex: 1;
  border-right: 1px solid #e4e7ed;
  overflow: hidden;
}

.live-badge {
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

.image-area {
  flex: 1;
}

.image-spec-hint {
  font-size: 11px;
  color: #909399;
  margin-bottom: 8px;
  padding: 4px 8px;
  /* background: #f5f7fa; */
  /* border-radius: 4px; */
  /* border-left: 3px solid #409eff; */
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
  width: 370px;
  flex-shrink: 0;
  background: #f8fafc;
  overflow: hidden;
}

.preview-sync {
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

.scene-dot.dot-user { background: #67c23a; }
.scene-dot.dot-group { background: #e6a23c; }
.scene-dot.dot-card { background: #f56c6c; }
.scene-dot.dot-multi { background: #909399; }

.scene-content {
  padding: 10px 12px;
}

.scene-content-chat {
  padding: 0 12px;
}

.mock-chat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.mock-chat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f7c340;
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mock-chat-avatar svg {
  width: 60%;
  height: 60%;
  fill: #000000;
}

.mock-chat-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.mock-chat-header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mock-chat-username {
  font-size: 13px;
  font-weight: 500;
  color: #1d1d1f;
  flex-shrink: 0;
}

.mock-chat-time {
  margin-left: auto;
  font-size: 11px;
  color: #888888;
  flex-shrink: 0;
}

.mock-chat-message {
  font-size: 11px;
  color: #888888;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.scene-content-notification {
  padding: 8px 12px;
}

.mock-notification-item {
  display: flex;
  align-items: flex-start;
  background-color: #ffffff;
  padding: 10px 12px;
  border-radius: 8px;
  gap: 10px;
  border: 1px solid #f0f0f0;
}

.mock-notif-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 2px solid #e91e63;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mock-notif-icon {
  width: 20px;
  height: 20px;
  fill: #e91e63;
}

.mock-notif-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.mock-notif-top {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.mock-notif-name {
  font-size: 13px;
  font-weight: 500;
  color: #333333;
  flex-shrink: 0;
}

.mock-notif-message {
  font-size: 11px;
  color: #666666;
}

.mock-notif-date {
  font-size: 11px;
  color: #999999;
  flex-shrink: 0;
}

.mock-chat-header-bar {
  display: flex;
  align-items: center;
  background: #ffffff;
  padding: 0 16px;
  height: 56px;
  border-bottom: 1px solid #e8e8e8;
  position: relative;
}

.mock-hdr-back {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mock-hdr-back-arrow {
  width: 16px;
  height: 16px;
  stroke: #1a1a1a;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}

.mock-hdr-title-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
}

.mock-hdr-title-row {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 2px;
}

.mock-hdr-name {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
}

.mock-hdr-right-arrow {
  width: 11px;
  height: 11px;
  stroke: #888;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}

.mock-hdr-subtitle {
  font-size: 9px;
  color: #999;
  text-align: center;
  letter-spacing: 0.2px;
}

.mock-hdr-more {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mock-hdr-more-icon {
  width: 16px;
  height: 16px;
  fill: #1a1a1a;
}

.scene-content-flush {
  padding: 0;
}

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
