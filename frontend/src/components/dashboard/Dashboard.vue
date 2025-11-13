<template>
  <div class="space-y-6">
    <!-- Dashboard Header with Customization -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <q-icon name="dashboard" class="h-5 w-5 text-primary" />
        <div>
          <h2 class="text-2xl font-light">Dashboard Overview</h2>
          <p class="text-sm text-muted-foreground">
            {{ cardOrder.length }} cards • {{ config.density }} density • {{ config.cardsPerRow }} per row
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <ModernButton
          variant="ghost"
          size="sm"
          @click="openTour"
          class="gap-2"
        >
          <q-icon name="help" class="h-4 w-4" />
          <span class="hidden sm:inline">Help</span>
        </ModernButton>
        <ModernButton
          variant="outline"
          size="sm"
          @click="showCustomizer = true"
          class="gap-2"
        >
          <q-icon name="settings" class="h-4 w-4" />
          <span class="hidden sm:inline">Customize</span>
        </ModernButton>
      </div>
    </div>

    <!-- KPI Cards Grid - Draggable -->
    <DashboardKPIGrid
      :card-order="displayedCards"
      :cards-per-row="config.cardsPerRow"
      :density="config.density"
      :is-dragging-enabled="true"
      :card-data-map="cardDataMap"
      @order-change="handleOrderChange"
    />

    <!-- Empty State -->
    <div v-if="cardOrder.length === 0" class="border-2 border-dashed rounded-lg p-12 text-center">
      <q-icon name="settings" class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 class="mb-2">No cards selected</h3>
      <p class="text-muted-foreground mb-4">
        Click "Customize Dashboard" to add cards to your dashboard
      </p>
      <ModernButton
        variant="outline"
        @click="showCustomizer = true"
      >
        Customize Dashboard
      </ModernButton>
    </div>

    <!-- Quick Actions -->
    <QuickActions />

    <!-- Main Visitors Chart - Full Width -->
    <VisitorsChart />

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AttendanceChart />
      <GivingChart />
    </div>

    <!-- Activity and Events Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ActivityFeed />
      <UpcomingEvents />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import DashboardKPIGrid from './DashboardKPIGrid.vue'
import AttendanceChart from './AttendanceChart.vue'
import GivingChart from './GivingChart.vue'
import VisitorsChart from './VisitorsChart.vue'
import ActivityFeed from './ActivityFeed.vue'
import QuickActions from './QuickActions.vue'
import UpcomingEvents from './UpcomingEvents.vue'
import ModernButton from '@/components/ui/ModernButton.vue'
import {
  DEFAULT_DASHBOARD_CONFIG,
  getCardDataById,
  type DashboardConfig,
  type KPICardData,
} from '@/config/dashboard-config'

const showCustomizer = ref(false)
const showTour = ref(false)

// Load config from localStorage or use defaults
const config = ref<DashboardConfig>(() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('churchafrica-dashboard-config')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse saved dashboard config:', e)
      }
    }
  }
  return DEFAULT_DASHBOARD_CONFIG
})

const cardOrder = ref<string[]>(config.value.visibleCards)

// Sync card order with visible cards when config changes
watch(() => config.value.visibleCards, (newVisibleCards) => {
  // Add new cards that aren't in the current order
  const newCards = newVisibleCards.filter(id => !cardOrder.value.includes(id))
  // Remove cards that are no longer visible
  const updatedOrder = cardOrder.value.filter(id => newVisibleCards.includes(id))
  // Append new cards at the end
  cardOrder.value = [...updatedOrder, ...newCards]
}, { immediate: true })

// Save config to localStorage whenever it changes
watch(config, (newConfig) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('churchafrica-dashboard-config', JSON.stringify(newConfig))
  }
}, { deep: true })

// Create card data map
const cardDataMap = computed<Record<string, KPICardData>>(() => {
  const map: Record<string, KPICardData> = {}
  cardOrder.value.forEach(cardId => {
    const cardData = getCardDataById(cardId)
    if (cardData) {
      map[cardId] = cardData
    }
  })
  return map
})

// Get displayed cards (limited by row count)
const displayedCards = computed(() => {
  const maxCards = config.value.cardsPerRow * config.value.rowCount
  return cardOrder.value.slice(0, maxCards)
})

const handleOrderChange = (newOrder: string[]) => {
  cardOrder.value = newOrder
  // Update config with new order
  config.value.visibleCards = newOrder
}

const handleConfigChange = (newConfig: DashboardConfig) => {
  config.value = newConfig
}

const openTour = () => {
  showTour.value = true
}

onMounted(() => {
  // Show tour on first visit (optional)
  const hasSeenTour = localStorage.getItem('churchafrica-dashboard-tour-seen')
  if (!hasSeenTour) {
    // Auto-show tour after 1 second on first visit
    setTimeout(() => {
      // openTour() // Uncomment to enable auto-tour
    }, 1000)
  }
})
</script>

