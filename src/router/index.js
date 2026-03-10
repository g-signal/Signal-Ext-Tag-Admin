import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    {
      path: '/login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/admin',
      component: () => import('@/views/Layout.vue'),
      redirect: '/admin/users',
      meta: { requiresAuth: true },
      children: [
        {
          path: 'users',
          component: () => import('@/views/UserManagement.vue'),
          meta: { title: '用户管理' }
        },
        {
          path: 'groups',
          component: () => import('@/views/GroupManagement.vue'),
          meta: { title: '群组管理' }
        },
        {
          path: 'tags',
          component: () => import('@/views/TagManagement.vue'),
          meta: { title: 'Tag 管理' }
        }
      ]
    }
  ]
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !sessionStorage.getItem('isLoggedIn')) {
    return '/login'
  }
})

export default router
