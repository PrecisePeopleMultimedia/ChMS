import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useOrganizationStore } from '@/stores/organization'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/LandingLayout.vue'),
      meta: {
        requiresGuest: true
      },
      children: [
        {
          path: '',
          name: 'Landing',
          component: () => import('@/pages/LandingPage.vue'),
          meta: {
            requiresGuest: true,
            title: 'ChurchAfrica - Church Management Made Simple'
          }
        }
      ]
    },
    {
      path: '/auth',
      name: 'Auth',
      component: () => import('@/views/AuthView.vue'),
      meta: {
        requiresGuest: true,
        title: 'Sign In - ChurchAfrica'
      }
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: () => import('@/views/ForgotPasswordView.vue'),
      meta: {
        requiresGuest: true,
        title: 'Forgot Password - ChurchAfrica'
      }
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: () => import('@/views/ResetPasswordView.vue'),
      meta: {
        requiresGuest: true,
        title: 'Reset Password - ChurchAfrica'
      }
    },
    // Legacy routes for backward compatibility
    {
      path: '/login',
      redirect: '/auth'
    },
    {
      path: '/register',
      redirect: '/auth?register=true'
    },
    {
      path: '/forgot-password',
      redirect: '/auth/forgot-password'
    },
    {
      path: '/reset-password',
      redirect: '/auth/reset-password'
    },
    // Organization setup route
    {
      path: '/setup',
      name: 'OrganizationSetup',
      component: () => import('@/views/OrganizationSetupView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Church Setup - ChurchAfrica'
      }
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
        },
        {
          path: '/members/attributes',
          name: 'MemberAttributes',
          component: () => import('@/components/members/AttributeManager.vue'),
          meta: {
            requiresAuth: true,
            title: 'Custom Attributes - ChurchAfrica'
          }
        },
        {
          path: '/members/badges',
          name: 'MemberBadges',
          component: () => import('@/components/members/BadgeManager.vue'),
          meta: {
            requiresAuth: true,
            title: 'Badge Management - ChurchAfrica'
          }
        },
        {
          path: '/members',
          name: 'MemberList',
          component: () => import('@/views/MemberListView.vue'),
          meta: {
            requiresAuth: true,
            title: 'Members - ChurchAfrica'
          }
        },
        {
          path: '/members/new',
          name: 'MemberCreate',
          component: () => import('@/views/MemberFormView.vue'),
          meta: {
            requiresAuth: true,
            title: 'Add Member - ChurchAfrica'
          }
        },
        {
          path: '/members/:id',
          name: 'MemberDetail',
          component: () => import('@/views/MemberDetailView.vue'),
          meta: {
            requiresAuth: true,
            title: 'Member Details - ChurchAfrica'
          }
        },
        {
          path: '/members/:id/edit',
          name: 'MemberEdit',
          component: () => import('@/views/MemberFormView.vue'),
          meta: {
            requiresAuth: true,
            title: 'Edit Member - ChurchAfrica'
          }
        },
        {
          path: '/attendance',
          name: 'Attendance',
          component: () => import('@/views/AttendanceView.vue'),
          meta: {
            requiresAuth: true,
            title: 'Attendance - ChurchAfrica'
          }
        },
        {
          path: '/attendance/checkin',
          name: 'AttendanceCheckIn',
          component: () => import('@/views/AttendanceCheckInView.vue'),
          meta: {
            requiresAuth: true,
            title: 'Attendance Check-In - ChurchAfrica'
          }
        },
        {
          path: '/attendance/reports',
          name: 'AttendanceReports',
          component: () => import('@/views/AttendanceReportsView.vue'),
          meta: {
            requiresAuth: true,
            title: 'Attendance Reports - ChurchAfrica'
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
  const organizationStore = useOrganizationStore()

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
    next({ path: '/auth', query: { redirect: to.fullPath } })
    return
  }

  // Redirect authenticated users away from guest-only pages
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // Check if organization setup is needed
    if (!organizationStore.isSetupComplete) {
      try {
        await organizationStore.fetchOrganization()
      } catch (error) {
        console.warn('Failed to check organization setup:', error)
      }
    }

    if (!organizationStore.isSetupComplete) {
      next({ name: 'OrganizationSetup' })
    } else {
      next({ name: 'Dashboard' })
    }
    return
  }

  // Check organization setup for authenticated users (except setup page and dashboard redirect)
  if (to.meta.requiresAuth && authStore.isAuthenticated && to.name !== 'OrganizationSetup') {
    if (!organizationStore.isSetupComplete) {
      try {
        await organizationStore.fetchOrganization()
      } catch (error) {
        console.warn('Failed to check organization setup:', error)
      }
    }

    // Allow dashboard access for redirect scenarios, but redirect to setup for other protected routes
    if (!organizationStore.isSetupComplete && to.name !== 'Dashboard') {
      next({ name: 'OrganizationSetup' })
      return
    }
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
