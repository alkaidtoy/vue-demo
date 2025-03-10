import { createRouter, createWebHistory, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import LoginForm from '@/components/LoginForm.vue'
import UserInfo from '@/components/UserInfo.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: LoginForm
    },
    {
      path: '/dashboard',
      component: UserInfo,
      meta: { requiresAuth: true }
    },
    {
      path: '/',
      redirect: '/login'
    }
  ]
})

// 路由守卫
router.beforeEach((
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (to.meta.requiresAuth) {
    // 这里可以检查用户是否已登录
    // 实际项目中可能需要检查 token 或其他认证信息
    next()
  } else {
    next()
  }
})

export default router 