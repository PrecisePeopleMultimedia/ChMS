<template>
  <!-- Mobile: render as slide-out sheet -->
  <template v-if="isMobile">
    <!-- Backdrop -->
    <div
      v-if="open"
      class="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
      @click="$emit('close')"
    />

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed left-0 top-0 h-full w-[280px] bg-card border-r border-border z-50',
        'transform transition-transform duration-300 ease-in-out',
        open ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <SidebarContent
        :user="user"
        :current-path="currentPath"
        :visible-primary-nav="visiblePrimaryNav"
        :visible-secondary-nav="visibleSecondaryNav"
        :utility-nav="utilityNavigation"
        :is-mobile="isMobile"
        @nav-click="handleNavClick"
        @close="$emit('close')"
      />
    </aside>
  </template>

  <!-- Desktop: render as fixed sidebar -->
  <SidebarContent
    v-else
    :user="user"
    :current-path="currentPath"
    :visible-primary-nav="visiblePrimaryNav"
    :visible-secondary-nav="visibleSecondaryNav"
    :utility-nav="utilityNavigation"
    :is-mobile="isMobile"
    @nav-click="handleNavClick"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useOrganizationStore } from '@/stores/organization'
import {
  primaryNavigation,
  secondaryNavigation,
  utilityNavigation,
  filterNavigationByRole,
  type NavigationItem
} from '@/config/navigation'
import SidebarContent from './AppSidebarContent.vue'

interface Props {
  open: boolean
  isMobile: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const organizationStore = useOrganizationStore()

const currentPath = computed(() => route.path)

// Get user from auth store or fallback
const user = computed(() => {
  if (authStore.user) {
    return {
      name: authStore.user.name || 'User',
      email: authStore.user.email || '',
      role: authStore.userRole || 'member',
      avatar_url: authStore.user.avatar_url || ''
    }
  }
  
  // Fallback for demo
  return {
    name: 'Pastor John',
    email: 'admin@church.com',
    role: 'admin',
    avatar_url: ''
  }
})

// Get church info from organization store
const churchInfo = computed(() => {
  const org = organizationStore.organization
  return {
    name: org?.name || 'Church Management System',
    type: 'Independent' // TODO: Add campus support
  }
})

// Filter navigation based on user role
const visiblePrimaryNav = computed(() =>
  filterNavigationByRole(primaryNavigation, user.value.role)
)

const visibleSecondaryNav = computed(() =>
  filterNavigationByRole(secondaryNavigation, user.value.role)
)

const handleNavClick = (item: NavigationItem) => {
  router.push(item.href)
  if (props.isMobile) {
    emit('close')
  }
}
</script>

