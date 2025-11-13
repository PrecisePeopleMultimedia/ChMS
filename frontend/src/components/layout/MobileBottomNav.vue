<template>
  <nav class="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border">
    <div class="flex items-center justify-around h-16 px-2">
      <button
        v-for="item in mobileBottomNavigation"
        :key="item.id"
        @click="handleNavClick(item)"
        :class="[
          'flex flex-col items-center justify-center gap-1',
          'touch-target no-select relative flex-1',
          'transition-colors duration-200',
          isActive(item.href)
            ? 'text-primary'
            : 'text-muted-foreground hover:text-foreground'
        ]"
      >
        <div class="relative">
          <q-icon
            :name="item.icon"
            :size="isActive(item.href) ? '20px' : '18px'"
            :color="isActive(item.href) ? 'primary' : 'currentColor'"
          />
          <q-badge
            v-if="notificationCounts[item.id] > 0"
            color="primary"
            :label="notificationCounts[item.id] > 9 ? '9+' : notificationCounts[item.id]"
            class="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
          />
        </div>
        <span class="text-[10px] font-medium">{{ item.label }}</span>
        
        <!-- Active indicator -->
        <div
          v-if="isActive(item.href)"
          class="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-12 bg-primary rounded-full"
        />
      </button>
    </div>

    <!-- Safe area spacing for iOS devices -->
    <div class="h-[env(safe-area-inset-bottom)]" />
  </nav>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mobileBottomNavigation, type NavigationItem } from '@/config/navigation'

const route = useRoute()
const router = useRouter()

// Mock notification counts (will be replaced with real data)
const notificationCounts = ref<Record<string, number>>({
  chat: 5,
  members: 2
})

const isActive = (href: string) => {
  return route.path === href || route.path.startsWith(href + '/')
}

const handleNavClick = (item: NavigationItem) => {
  router.push(item.href)
}
</script>

<style scoped>
.no-select {
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.touch-target {
  min-height: 48px;
  min-width: 48px;
}
</style>

