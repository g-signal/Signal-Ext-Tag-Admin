<template>
  <div class="layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="logo">
        <span class="logo-icon">⚡</span>
        <span class="logo-text">BA Signal Admin</span>
      </div>
      <el-menu
        router
        :default-active="route.path"
        background-color="#1e2a3a"
        text-color="#9aacbe"
        active-text-color="#ffffff"
        class="sidebar-menu"
      >
        <el-menu-item index="/admin/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/groups">
          <el-icon><Folder /></el-icon>
          <span>群组管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/tags">
          <el-icon><CollectionTag /></el-icon>
          <span>Tag 管理</span>
        </el-menu-item>
      </el-menu>
    </aside>

    <!-- Main -->
    <div class="main-wrap">
      <header class="header">
        <div class="breadcrumb">
          <span class="page-title">{{ route.meta.title || 'BA Signal Admin' }}</span>
        </div>
        <div class="header-right">
          <el-avatar :size="30" style="background: #409eff; font-size: 13px;">A</el-avatar>
          <span class="username">admin</span>
          <el-divider direction="vertical" />
          <el-button link type="danger" size="small" @click="logout">
            <el-icon><SwitchButton /></el-icon>
            退出
          </el-button>
        </div>
      </header>
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { User, Folder, CollectionTag, SwitchButton } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

function logout() {
  sessionStorage.removeItem('isLoggedIn')
  router.push('/login')
}
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 220px;
  background: #1e2a3a;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 100;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.logo-icon {
  font-size: 20px;
}

.logo-text {
  color: white;
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
  letter-spacing: 0.3px;
}

.sidebar-menu {
  border-right: none;
  flex: 1;
  padding-top: 8px;
}

:deep(.el-menu-item) {
  height: 48px;
  border-radius: 6px;
  margin: 2px 10px;
  width: calc(100% - 20px);
}

:deep(.el-menu-item.is-active) {
  background-color: #409eff !important;
}

:deep(.el-menu-item:hover) {
  background-color: rgba(255, 255, 255, 0.08) !important;
}

.main-wrap {
  flex: 1;
  margin-left: 220px;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 100vh;
  background: #f0f2f5;
}

.header {
  height: 64px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 99;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  color: #1d2939;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.username {
  font-size: 14px;
  color: #606266;
}

.content {
  flex: 1;
  padding: 24px;
}
</style>
