<template>
  <q-card class="widget-library" style="min-width: 600px; max-width: 800px; max-height: 80vh;">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6">Widget Library</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>

    <q-card-section class="q-pt-none">
      <!-- Search and Filter -->
      <div class="library-controls q-mb-md">
        <q-input
          v-model="searchQuery"
          placeholder="Search widgets..."
          outlined
          dense
          clearable
          class="col-grow q-mr-sm"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        
        <q-select
          v-model="selectedCategory"
          :options="categoryOptions"
          label="Category"
          outlined
          dense
          clearable
          emit-value
          map-options
          style="min-width: 150px;"
        />
      </div>

      <!-- Widget Categories -->
      <q-tabs
        v-model="activeTab"
        dense
        class="text-grey-6 q-mb-md"
        active-color="primary"
        indicator-color="primary"
        align="left"
      >
        <q-tab name="all" label="All Widgets" />
        <q-tab name="system" label="System" />
        <q-tab name="metrics" label="Metrics" />
        <q-tab name="charts" label="Charts" />
        <q-tab name="lists" label="Lists" />
        <q-tab name="actions" label="Quick Actions" />
        <q-tab name="custom" label="Custom" />
      </q-tabs>

      <!-- Widget Grid -->
      <div class="widget-grid">
        <q-scroll-area style="height: 400px;">
          <div class="row q-col-gutter-md">
            <div
              v-for="widget in filteredWidgets"
              :key="widget.id"
              class="col-12 col-sm-6 col-md-4"
            >
              <WidgetLibraryCard
                :widget="widget as Widget"
                :is-selected="selectedWidgets.includes(widget.id)"
                @select="toggleWidgetSelection"
                @preview="previewWidget"
                @add="addWidget"
              />
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-if="!filteredWidgets.length" class="empty-state">
            <q-icon name="widgets" size="3rem" color="grey-5" />
            <h4 class="text-h6 text-grey-6 q-mt-md">No widgets found</h4>
            <p class="text-body2 text-grey-5">
              Try adjusting your search or filter criteria
            </p>
          </div>
        </q-scroll-area>
      </div>
    </q-card-section>

    <q-card-actions align="right" class="q-pa-md">
      <div class="row items-center full-width">
        <div class="col">
          <q-chip
            v-if="selectedWidgets.length"
            color="primary"
            text-color="white"
            icon="check_circle"
          >
            {{ selectedWidgets.length }} selected
          </q-chip>
        </div>
        
        <div class="col-auto">
          <q-btn
            flat
            label="Cancel"
            color="grey-6"
            @click="$emit('cancel')"
            class="q-mr-sm"
          />
          <q-btn
            unelevated
            label="Add Selected"
            color="primary"
            :disable="!selectedWidgets.length"
            @click="addSelectedWidgets"
            :loading="isAdding"
          />
        </div>
      </div>
    </q-card-actions>

    <!-- Widget Preview Dialog -->
    <q-dialog v-model="showPreview" persistent>
      <WidgetPreview
        v-if="previewedWidget"
        :widget="previewedWidget"
        @close="showPreview = false"
        @add="addWidget"
      />
    </q-dialog>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useWidgetsStore } from '@/stores/widgets'
import type { Widget } from '@/stores/widgets'
import WidgetLibraryCard from './WidgetLibraryCard.vue'
import WidgetPreview from './WidgetPreview.vue'

interface Emits {
  (e: 'add-widget', widget: Widget): void
  (e: 'add-widgets', widgets: Widget[]): void
  (e: 'cancel'): void
}

const emit = defineEmits<Emits>()

const widgetsStore = useWidgetsStore()

// Reactive state
const searchQuery = ref('')
const selectedCategory = ref<string | null>(null)
const activeTab = ref('all')
const selectedWidgets = ref<string[]>([])
const showPreview = ref(false)
const previewedWidget = ref<Widget | null>(null)
const isAdding = ref(false)

// Computed properties
const { availableWidgets, systemWidgets, customWidgets } = widgetsStore

const categoryOptions = [
  { label: 'All Categories', value: null },
  { label: 'System Widgets', value: 'system' },
  { label: 'Metrics', value: 'metrics' },
  { label: 'Charts', value: 'charts' },
  { label: 'Lists', value: 'lists' },
  { label: 'Quick Actions', value: 'actions' },
  { label: 'Custom', value: 'custom' }
]

const filteredWidgets = computed(() => {
  let widgets = availableWidgets

  // Filter by tab
  switch (activeTab.value) {
    case 'system':
      widgets = systemWidgets
      break
    case 'custom':
      widgets = customWidgets
      break
    case 'metrics':
      widgets = widgets.filter((w: any) => w.type === 'metric')
      break
    case 'charts':
      widgets = widgets.filter((w: any) => w.type === 'chart')
      break
    case 'lists':
      widgets = widgets.filter((w: any) => w.type === 'list')
      break
    case 'actions':
      widgets = widgets.filter((w: any) => w.type === 'action')
      break
    default:
      // All widgets
      break
  }

  // Filter by category
  if (selectedCategory.value) {
    widgets = widgets.filter((w: any) => {
      switch (selectedCategory.value) {
        case 'system':
          return w.isSystemWidget
        case 'custom':
          return !w.isSystemWidget
        default:
          return w.type === selectedCategory.value
      }
    })
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    widgets = widgets.filter((w: any) =>
      w.name.toLowerCase().includes(query) ||
      w.description.toLowerCase().includes(query) ||
      w.type.toLowerCase().includes(query)
    )
  }

  return widgets.filter((w: any) => w.isActive)
})

// Methods
const toggleWidgetSelection = (widgetId: string) => {
  const index = selectedWidgets.value.indexOf(widgetId)
  if (index > -1) {
    selectedWidgets.value.splice(index, 1)
  } else {
    selectedWidgets.value.push(widgetId)
  }
}

const previewWidget = (widget: Widget) => {
  previewedWidget.value = widget
  showPreview.value = true
}

const addWidget = async (widget: Widget) => {
  try {
    isAdding.value = true
    emit('add-widget', widget)
  } catch (error) {
    console.error('Failed to add widget:', error)
  } finally {
    isAdding.value = false
  }
}

const addSelectedWidgets = async () => {
  try {
    isAdding.value = true
    const widgets = selectedWidgets.value
      .map(id => availableWidgets.find((w: any) => w.id === id))
      .filter(Boolean) as Widget[]
    
    emit('add-widgets', widgets)
  } catch (error) {
    console.error('Failed to add selected widgets:', error)
  } finally {
    isAdding.value = false
  }
}

// Lifecycle
onMounted(async () => {
  // Ensure widgets are loaded
  if (!availableWidgets.length) {
    await widgetsStore.fetchAvailableWidgets()
  }
})
</script>

<style scoped>
.widget-library {
  overflow: hidden;
}

.library-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.widget-grid {
  min-height: 400px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
  padding: 32px;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .widget-library {
    min-width: 300px;
    max-width: 95vw;
  }
  
  .library-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .library-controls .q-input {
    margin-right: 0;
    margin-bottom: 8px;
  }
  
  .widget-grid .row .col-12 {
    /* Full width on mobile */
  }
}

/* Tablet optimizations */
@media (max-width: 1024px) {
  .widget-grid .row .col-md-4 {
    /* 2 columns on tablet */
    flex: 0 0 50%;
    max-width: 50%;
  }
}
</style>
