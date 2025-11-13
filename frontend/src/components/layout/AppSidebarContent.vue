<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="p-4 border-b border-border">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <div class="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <q-icon name="church" color="primary" size="20px" />
          </div>
          <div>
            <h3 class="font-semibold text-sm">{{ churchInfo.name }}</h3>
            <p class="text-xs text-muted-foreground">{{ churchInfo.type }}</p>
          </div>
        </div>
        <q-btn
          v-if="isMobile"
          flat
          round
          dense
          icon="close"
          size="sm"
          @click="$emit('close')"
        />
      </div>

      <!-- User Profile -->
      <div
        class="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer touch-target"
        @click="handleProfileClick"
      >
        <q-avatar size="40px">
          <img v-if="user.avatar_url" :src="user.avatar_url" :alt="user.name" />
          <q-icon v-else name="person" color="primary" />
        </q-avatar>
        <div class="flex-1 min-w-0">
          <p class="font-medium text-sm truncate">{{ user.name }}</p>
          <p class="text-xs text-muted-foreground truncate capitalize">{{ user.role }}</p>
        </div>
        <q-icon name="expand_more" size="16px" color="muted" />
      </div>
    </div>

    <!-- Navigation -->
    <q-scroll-area class="flex-1">
      <div class="p-4 space-y-6">
        <!-- Primary Navigation -->
        <nav>
          <div class="space-y-1">
            <NavItem
              v-for="item in visiblePrimaryNav"
              :key="item.id"
              :item="item"
              :is-active="currentPath === item.href"
              @click="$emit('nav-click', item)"
            />
          </div>
        </nav>

        <div class="h-px bg-border my-4" />

        <!-- Secondary Navigation -->
        <nav>
          <h4 class="text-xs font-semibold text-muted-foreground mb-2 px-3">
            More
          </h4>
          <div class="space-y-1">
            <NavItem
              v-for="item in visibleSecondaryNav"
              :key="item.id"
              :item="item"
              :is-active="currentPath === item.href"
              @click="$emit('nav-click', item)"
            />
          </div>
        </nav>

        <div class="h-px bg-border my-4" />

        <!-- Utility Navigation -->
        <nav>
          <div class="space-y-1">
            <NavItem
              v-for="item in utilityNav"
              :key="item.id"
              :item="item"
              :is-active="currentPath === item.href"
              @click="$emit('nav-click', item)"
            />
          </div>
        </nav>
      </div>
    </q-scroll-area>

    <!-- Footer -->
    <div class="p-4 border-t border-border">
      <p class="text-xs text-muted-foreground text-center">
        ChurchAfrica ChMS v1.0
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOrganizationStore } from '@/stores/organization'
import type { NavigationItem } from '@/config/navigation'
import NavItem from './AppSidebarNavItem.vue'

interface Props {
  user: {
    name: string
    email: string
    role: string
    avatar_url: string
  }
  currentPath: string
  visiblePrimaryNav: NavigationItem[]
  visibleSecondaryNav: NavigationItem[]
  utilityNav: NavigationItem[]
  isMobile: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'nav-click': [item: NavigationItem]
  close: []
}>()

const router = useRouter()
const organizationStore = useOrganizationStore()

const churchInfo = computed(() => {
  const org = organizationStore.organization
  return {
    name: org?.name || 'Church Management System',
    type: 'Independent' // TODO: Add campus support
  }
})

const handleProfileClick = () => {
  router.push('/profile')
  if (props.isMobile) {
    emit('close')
  }
}
</script>

