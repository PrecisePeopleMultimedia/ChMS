import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/auth/login'
    },
    {
      path: '/auth',
      component: () => import('@/layouts/AuthLayout.vue'),
      children: [
        {
          path: '',
          redirect: '/auth/login'
        },
        {
          path: 'login',
          name: 'Login',
          component: () => import('@/views/LoginView.vue'),
          meta: {
            requiresGuest: true,
            title: 'Sign In - ChurchAfrica'
          }
        },
        {
          path: 'register',
          name: 'Register',
          component: () => import('@/views/RegisterView.vue'),
          meta: {
            requiresGuest: true,
            title: 'Sign Up - ChurchAfrica'
          }
        },
        {
          path: 'forgot-password',
          name: 'ForgotPassword',
          component: () => import('@/views/ForgotPasswordView.vue'),
          meta: {
            requiresGuest: true,
            title: 'Forgot Password - ChurchAfrica'
          }
        },
        {
          path: 'reset-password',
          name: 'ResetPassword',
          component: () => import('@/views/ResetPasswordView.vue'),
          meta: {
            requiresGuest: true,
            title: 'Reset Password - ChurchAfrica'
          }
        }
      ]
    },
    // Legacy routes for backward compatibility
    {
      path: '/login',
      redirect: '/auth/login'
    },
    {
      path: '/register',
      redirect: '/auth/register'
    },
    {
      path: '/forgot-password',
      redirect: '/auth/forgot-password'
    },
    {
      path: '/reset-password',
      redirect: '/auth/reset-password'
    },
    // Dashboard routes with Quasar Prime layout
    {
      path: '/dashboard',
      component: () => import('@/layouts/QuasarPrimeLayout.vue'),
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('@/views/QuasarPrimeDashboard.vue'),
          meta: {
            requiresAuth: true,
            title: 'Dashboard - ChurchAfrica'
          }
        },
        {
          path: '/profile',
          name: 'Profile',
          component: () => import('@/views/ProfileView.vue'),
          meta: {
            requiresAuth: true,
            title: 'Profile - ChurchAfrica'
          }
        }
      ]
    },
    // Catch-all route for 404
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue'),
      meta: {
        title: 'Page Not Found - ChurchAfrica'
      }
    }
  ],
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Set page title
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  // Initialize auth if not already done
  if (!authStore.isAuthenticated && localStorage.getItem('auth_token')) {
    try {
      await authStore.initializeAuth()
    } catch (error) {
      console.warn('Failed to initialize auth:', error)
    }
  }

  // Check authentication requirements
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ path: '/auth/login', query: { redirect: to.fullPath } })
    return
  }

  // Redirect authenticated users away from guest-only pages
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
    return
  }

  // Check role requirements
  if (to.meta.roles && authStore.isAuthenticated) {
    const userRole = authStore.userRole
    const requiredRoles = to.meta.roles as string[]

    if (!userRole || !requiredRoles.includes(userRole)) {
      next({ name: 'Dashboard' })
      return
    }
  }

  next()
})

export default router
