<template>
  <div class="min-h-screen bg-background">
    <!-- Header - Always visible -->
    <AppHeader
      @toggle-sidebar="toggleSidebar"
      @toggle-secondary-sidebar="toggleSecondarySidebar"
    />

    <!-- Main Layout Grid -->
    <div class="flex h-[calc(100vh-64px)]">
      <!-- Left Sidebar - Navigation -->
      <template v-if="!isMobile">
        <aside
          :class="[
            'bg-card border-r border-border flex-shrink-0 transition-all duration-300 ease-in-out',
            sidebarOpen ? 'w-[280px]' : 'w-0'
          ]"
        >
          <div :class="['w-[280px]', sidebarOpen ? 'block' : 'hidden']">
            <AppSidebar
              :open="sidebarOpen"
              :is-mobile="isMobile"
              @close="closeSidebar"
            />
          </div>
        </aside>

        <!-- Collapse/Expand Button for Left Sidebar -->
        <button
          @click="toggleSidebar"
          :class="[
            'absolute left-2 top-20 h-8 w-8 z-50 bg-card border border-border shadow-lg',
            'transition-all duration-300 hover:bg-accent hover:shadow-xl',
            'flex items-center justify-center rounded-md'
          ]"
          :style="{ left: sidebarOpen ? '272px' : '8px' }"
          :title="sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'"
        >
          <q-icon :name="sidebarOpen ? 'chevron_left' : 'chevron_right'" size="16px" />
        </button>
      </template>

      <!-- Mobile Left Sidebar (Overlay) -->
      <AppSidebar
        v-if="isMobile"
        :open="sidebarOpen"
        :is-mobile="isMobile"
        @close="closeSidebar"
      />

      <!-- Main Content Area -->
      <main
        :class="[
          'flex-1 overflow-y-auto relative',
          isMobile ? 'pb-16' : ''
        ]"
      >
        <div class="container mx-auto px-4 py-6">
          <slot />
        </div>
      </main>

      <!-- Right Sidebar - Chat/Secondary -->
      <template v-if="showSecondarySidebar">
        <!-- Collapse/Expand Button for Right Sidebar (Desktop only) -->
        <button
          v-if="!isMobile"
          @click="toggleSecondarySidebar"
          :class="[
            'absolute right-2 top-20 h-8 w-8 z-50 bg-card border border-border shadow-lg',
            'transition-all duration-300 hover:bg-accent hover:shadow-xl',
            'flex items-center justify-center rounded-md'
          ]"
          :style="{ right: secondarySidebarOpen ? '312px' : '8px' }"
          :title="secondarySidebarOpen ? 'Collapse activity panel' : 'Expand activity panel'"
        >
          <q-icon :name="secondarySidebarOpen ? 'chevron_right' : 'chevron_left'" size="16px" />
        </button>

        <template v-if="!isMobile">
          <aside
            :class="[
              'bg-card border-l border-border flex-shrink-0',
              'transition-all duration-300 ease-in-out',
              secondarySidebarOpen ? 'w-[320px]' : 'w-0'
            ]"
          >
            <div :class="['w-[320px]', secondarySidebarOpen ? 'block' : 'hidden']">
              <SecondarySidebar
                :open="secondarySidebarOpen"
                :is-mobile="isMobile"
                @close="closeSecondarySidebar"
              />
            </div>
          </aside>
        </template>

        <!-- Mobile Right Sidebar (Overlay) -->
        <SecondarySidebar
          v-if="isMobile"
          :open="secondarySidebarOpen"
          :is-mobile="isMobile"
          @close="closeSecondarySidebar"
        />
      </template>
    </div>

    <!-- Mobile Bottom Navigation -->
    <MobileBottomNav v-if="isMobile" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useIsMobile } from '@/composables/useIsMobile'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import SecondarySidebar from '@/components/layout/SecondarySidebar.vue'
import MobileBottomNav from '@/components/layout/MobileBottomNav.vue'
// Icons will be handled via Quasar or inline SVG

interface Props {
  showSecondarySidebar?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showSecondarySidebar: true
})

const isMobile = useIsMobile()
const sidebarOpen = ref(true)
const secondarySidebarOpen = ref(false)

// Load sidebar state from localStorage for desktop
onMounted(() => {
  if (isMobile.value) {
    sidebarOpen.value = false
    secondarySidebarOpen.value = false
  } else {
    const savedLeftSidebar = localStorage.getItem('sidebar-left-open')
    const savedRightSidebar = localStorage.getItem('sidebar-right-open')
    
    if (savedLeftSidebar !== null) {
      sidebarOpen.value = savedLeftSidebar === 'true'
    }
    if (savedRightSidebar !== null) {
      secondarySidebarOpen.value = savedRightSidebar === 'true'
    } else {
      secondarySidebarOpen.value = false
    }
  }
})

// Save sidebar state to localStorage (desktop only)
watch(sidebarOpen, (newValue) => {
  if (!isMobile.value) {
    localStorage.setItem('sidebar-left-open', newValue.toString())
  }
})

watch(secondarySidebarOpen, (newValue) => {
  if (!isMobile.value) {
    localStorage.setItem('sidebar-right-open', newValue.toString())
  }
})

// Watch for mobile changes
watch(isMobile, (newValue) => {
  if (newValue) {
    sidebarOpen.value = false
    secondarySidebarOpen.value = false
  } else {
    const savedLeftSidebar = localStorage.getItem('sidebar-left-open')
    if (savedLeftSidebar !== null) {
      sidebarOpen.value = savedLeftSidebar === 'true'
    }
  }
})

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const toggleSecondarySidebar = () => {
  secondarySidebarOpen.value = !secondarySidebarOpen.value
}

const closeSecondarySidebar = () => {
  secondarySidebarOpen.value = false
}
</script>

