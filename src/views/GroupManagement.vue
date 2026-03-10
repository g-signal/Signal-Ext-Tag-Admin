<template>
  <div class="page-wrap">
    <div class="page-header">
      <div>
        <h2 class="page-title">群组管理</h2>
        <p class="page-desc">管理系统群组及其标签信息</p>
      </div>
      <el-button type="primary" :icon="Plus" @click="openAddDialog">添加群组</el-button>
    </div>

    <el-table :data="groupsStore.groups" border stripe class="data-table">
      <el-table-column prop="id" label="ID" width="130">
        <template #default="{ row }">
          <span class="mono-text">{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="200">
        <template #default="{ row }">
          <span class="remark-text">{{ row.remark || '—' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签" min-width="220">
        <template #default="{ row }">
          <div class="tag-cell">
            <template v-for="tagId in row.tagIds" :key="tagId">
              <TagDisplay
                v-if="tagsStore.getTagById(tagId)"
                :tag="tagsStore.getTagById(tagId)"
              />
            </template>
            <span v-if="!resolvedTags(row).length" class="empty-tag-hint">暂无标签</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140" fixed="right" align="center">
        <template #default="{ row }">
          <el-button
            link
            type="primary"
            size="small"
            :icon="EditIcon"
            @click="openEditDialog(row)"
          >
            编辑
          </el-button>
          <el-divider direction="vertical" />
          <el-popconfirm
            title="确认删除该群组？此操作不可撤销。"
            confirm-button-type="danger"
            @confirm="deleteGroup(row.id)"
          >
            <template #reference>
              <el-button link type="danger" size="small" :icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- ── Add Group Dialog ── -->
    <el-dialog
      v-model="addDialogVisible"
      title="添加群组"
      width="500px"
      align-center
      destroy-on-close
    >
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addFormRef"
        label-width="76px"
        style="padding: 8px 0;"
      >
        <el-form-item label="群组 ID" prop="id">
          <el-input v-model="addForm.id" placeholder="请输入群组 ID" clearable />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="addForm.remark"
            placeholder="选填"
            clearable
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="标签">
          <TagSelector v-model="addForm.tagIds" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAdd">确认添加</el-button>
      </template>
    </el-dialog>

    <!-- ── Edit Group Dialog ── -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑群组"
      width="500px"
      align-center
      destroy-on-close
    >
      <el-form
        :model="editForm"
        ref="editFormRef"
        label-width="76px"
        style="padding: 8px 0;"
      >
        <el-form-item label="群组 ID">
          <el-input :value="editForm.id" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="editForm.remark"
            placeholder="选填"
            clearable
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="标签">
          <TagSelector v-model="editForm.tagIds" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmEdit">保存修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Delete, Edit as EditIcon } from '@element-plus/icons-vue'
import { useGroupsStore } from '@/stores/groups'
import { useTagsStore } from '@/stores/tags'
import TagDisplay from '@/components/TagDisplay.vue'
import TagSelector from '@/components/TagSelector.vue'

const groupsStore = useGroupsStore()
const tagsStore = useTagsStore()

function resolvedTags(row) {
  return (row.tagIds || []).map(id => tagsStore.getTagById(id)).filter(Boolean)
}

// ── Add dialog ────────────────────────────────
const addDialogVisible = ref(false)
const addFormRef = ref()
const addForm = reactive({ id: '', remark: '', tagIds: [] })

const addRules = {
  id: [{ required: true, message: '请输入群组 ID', trigger: 'blur' }]
}

function openAddDialog() {
  Object.assign(addForm, { id: '', remark: '', tagIds: [] })
  addDialogVisible.value = true
}

function confirmAdd() {
  addFormRef.value.validate((valid) => {
    if (!valid) return
    if (groupsStore.groups.some(g => g.id === addForm.id)) {
      ElMessage.warning('群组 ID 已存在')
      return
    }
    groupsStore.addGroup({ ...addForm, tagIds: [...addForm.tagIds] })
    ElMessage.success('添加成功')
    addDialogVisible.value = false
  })
}

function deleteGroup(id) {
  groupsStore.deleteGroup(id)
  ElMessage.success('已删除')
}

// ── Edit dialog ───────────────────────────────
const editDialogVisible = ref(false)
const editFormRef = ref()
const editForm = reactive({ id: '', remark: '', tagIds: [] })

function openEditDialog(row) {
  Object.assign(editForm, {
    id: row.id,
    remark: row.remark || '',
    tagIds: [...(row.tagIds || [])]
  })
  editDialogVisible.value = true
}

function confirmEdit() {
  groupsStore.updateGroup(editForm.id, {
    remark: editForm.remark,
    tagIds: [...editForm.tagIds]
  })
  ElMessage.success('修改已保存')
  editDialogVisible.value = false
}
</script>

<style scoped>
.page-wrap {
  background: white;
  border-radius: 10px;
  padding: 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
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

.data-table {
  border-radius: 6px;
  overflow: hidden;
}

.mono-text {
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 13px;
  color: #606266;
}

.remark-text {
  color: #606266;
  font-size: 13px;
}

.tag-cell {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  align-items: center;
  min-height: 24px;
}

.empty-tag-hint {
  font-size: 12px;
  color: #dcdfe6;
}
</style>
