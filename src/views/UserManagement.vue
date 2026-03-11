<template>
  <div class="page-wrap">
    <div class="page-header">
      <div>
        <h2 class="page-title">用户管理</h2>
        <p class="page-desc">管理系统用户及其标签信息</p>
      </div>
      <div style="display:flex;gap:8px;">
        <el-button :icon="Refresh" @click="fetchUsers" :loading="loading">刷新</el-button>
        <el-button type="primary" :icon="Plus" @click="openAddDialog">添加用户</el-button>
      </div>
    </div>

    <el-table :data="users" v-loading="loading" border stripe class="data-table">
      <el-table-column prop="id" label="ID" width="130">
        <template #default="{ row }">
          <span class="mono-text">{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话" width="160" />
      <el-table-column prop="remark" label="备注" min-width="140">
        <template #default="{ row }">
          <span class="remark-text">{{ row.remark || '—' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签" min-width="220">
        <template #default="{ row }">
          <div class="tag-cell">
            <TagDisplay v-for="tag in row.tags" :key="tag.id" :tag="tag" />
            <span v-if="!row.tags?.length" class="empty-tag-hint">暂无标签</span>
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
          <el-button link type="danger" size="small" :icon="Delete" @click="deleteUser(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-wrap">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next"
        background
        @current-change="fetchUsers"
        @size-change="fetchUsers"
      />
    </div>

    <!-- ── Add User Dialog ── -->
    <el-dialog
      v-model="addDialogVisible"
      title="添加用户"
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
        <el-form-item label="用户 ID" prop="id">
          <el-input v-model="addForm.id" placeholder="请输入用户 ID" clearable />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="addForm.phone" placeholder="请输入手机号" clearable />
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
          <TagSelector v-model="addForm.tagIds" :options="tagOptions" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAdd" :loading="submitting">确认添加</el-button>
      </template>
    </el-dialog>

    <!-- ── Edit User Dialog ── -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑用户"
      width="500px"
      align-center
      destroy-on-close
    >
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editFormRef"
        label-width="76px"
        style="padding: 8px 0;"
      >
        <el-form-item label="用户 ID">
          <el-input :value="editForm.id" disabled />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="editForm.phone" placeholder="请输入手机号" clearable />
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
          <TagSelector v-model="editForm.tagIds" :options="tagOptions" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmEdit" :loading="submitting">保存修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Edit as EditIcon, Refresh } from '@element-plus/icons-vue'
import { getUserList, createUser, updateUser, deleteUser as apiDeleteUser } from '@/api/user'
import { getTagList } from '@/api/tag'
import TagDisplay from '@/components/TagDisplay.vue'
import TagSelector from '@/components/TagSelector.vue'

function apiTagToStore(t) {
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

function apiUserToLocal(u) {
  return {
    id: u.id,
    phone: u.phoneNumber || '',
    remark: u.remark || '',
    tags: (u.tags || []).map(apiTagToStore),
    tagIds: (u.tags || []).map(t => String(t.id))
  }
}

const users = ref([])
const loading = ref(false)
const submitting = ref(false)
const tagOptions = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

async function fetchUsers() {
  loading.value = true
  try {
    const data = await getUserList(currentPage.value, pageSize.value)
    users.value = (data.list || []).map(apiUserToLocal)
    total.value = Number(data.total) || 0
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  fetchUsers()
  try {
    const data = await getTagList()
    tagOptions.value = (data || []).map(apiTagToStore)
  } catch {}
})


// ── Add dialog ────────────────────────────────
const addDialogVisible = ref(false)
const addFormRef = ref()
const addForm = reactive({ id: '', phone: '', remark: '', tagIds: [] })

const addRules = {
  id: [{ required: true, message: '请输入用户 ID', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ]
}

function openAddDialog() {
  Object.assign(addForm, { id: '', phone: '', remark: '', tagIds: [] })
  addDialogVisible.value = true
}

function confirmAdd() {
  addFormRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      await createUser({
        id: addForm.id,
        phoneNumber: addForm.phone,
        remark: addForm.remark,
        tagIds: [...addForm.tagIds]
      })
      ElMessage.success('添加成功')
      addDialogVisible.value = false
      await fetchUsers()
    } catch {} finally {
      submitting.value = false
    }
  })
}

async function deleteUser(id) {
  try {
    await ElMessageBox.confirm('确认删除该用户？此操作不可撤销。', '删除确认', {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    })
  } catch {
    return
  }
  try {
    await apiDeleteUser(id)
    ElMessage.success('已删除')
    await fetchUsers()
  } catch {}
}

// ── Edit dialog ───────────────────────────────
const editDialogVisible = ref(false)
const editFormRef = ref()
const editForm = reactive({ id: '', phone: '', remark: '', tagIds: [] })

const editRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ]
}

function openEditDialog(row) {
  Object.assign(editForm, {
    id: row.id,
    phone: row.phone,
    remark: row.remark || '',
    tagIds: [...(row.tagIds || [])]
  })
  editDialogVisible.value = true
}

function confirmEdit() {
  editFormRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      await updateUser(editForm.id, {
        phoneNumber: editForm.phone,
        remark: editForm.remark,
        tagIds: [...editForm.tagIds]
      })
      ElMessage.success('修改已保存')
      editDialogVisible.value = false
      await fetchUsers()
    } catch {} finally {
      submitting.value = false
    }
  })
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

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
