import { ref, computed, readonly } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

// Configure axios defaults
axios.defaults.baseURL = API_URL
axios.defaults.withCredentials = true

export interface WidgetPosition {
  x: number
  y: number
  width: number
  height: number
}

export interface WidgetConfig {
  [key: string]: any
}

export interface Widget {
  id: string
  type: string
  name: string
  description: string
  component: string
  icon?: string
  defaultConfig: WidgetConfig
  dataSource?: string
  permissions?: string[]
  isSystemWidget: boolean
  isActive: boolean
}

export interface WidgetInstance {
  id: string
  widgetId: string
  position: WidgetPosition
  config: WidgetConfig
  isVisible: boolean
  widget?: Widget
}

export interface DashboardLayout {
  id: string
  name: string
  description?: string
  isDefault: boolean
  isShared: boolean
  layoutConfig: {
    columns: number
    rows: number
    gap: number
  }
  widgets: WidgetInstance[]
}

export interface WidgetData {
  [key: string]: any
}

export const useWidgetsStore = defineStore('widgets', () => {
  // State
  const availableWidgets = ref<Widget[]>([])
  const dashboardLayouts = ref<DashboardLayout[]>([])
  const currentLayout = ref<DashboardLayout | null>(null)
  const widgetData = ref<Map<string, WidgetData>>(new Map())
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isDragging = ref(false)
  const draggedWidget = ref<WidgetInstance | null>(null)

  // Computed
  const systemWidgets = computed(() => 
    availableWidgets.value.filter(w => w.isSystemWidget && w.isActive)
  )
  
  const customWidgets = computed(() => 
    availableWidgets.value.filter(w => !w.isSystemWidget && w.isActive)
  )
  
  const currentWidgets = computed(() => 
    currentLayout.value?.widgets || []
  )
  
  const visibleWidgets = computed(() => 
    currentWidgets.value.filter(w => w.isVisible)
  )

  // Actions
  const fetchAvailableWidgets = async (): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const response = await axios.get('/api/dashboard/widgets')
      availableWidgets.value = response.data
    } catch (err: any) {
      console.error('Failed to fetch available widgets:', err)
      error.value = err.response?.data?.message || 'Failed to fetch widgets'
    } finally {
      isLoading.value = false
    }
  }

  const fetchDashboardLayouts = async (): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const response = await axios.get('/api/dashboard/layouts')
      dashboardLayouts.value = response.data
      
      // Set default layout if none is current
      if (!currentLayout.value && dashboardLayouts.value.length > 0) {
        const defaultLayout = dashboardLayouts.value.find(l => l.isDefault) || dashboardLayouts.value[0]
        await setCurrentLayout(defaultLayout?.id)
      }
    } catch (err: any) {
      console.error('Failed to fetch dashboard layouts:', err)
      error.value = err.response?.data?.message || 'Failed to fetch layouts'
    } finally {
      isLoading.value = false
    }
  }

  const setCurrentLayout = async (layoutId: string): Promise<void> => {
    try {
      const layout = dashboardLayouts.value.find(l => l.id === layoutId)
      if (!layout) {
        throw new Error('Layout not found')
      }

      currentLayout.value = layout
      
      // Fetch widget data for current layout
      await fetchWidgetDataForLayout(layout)
    } catch (err: any) {
      console.error('Failed to set current layout:', err)
      error.value = err.response?.data?.message || 'Failed to set layout'
    }
  }

  const fetchWidgetDataForLayout = async (layout: DashboardLayout): Promise<void> => {
    try {
      const promises = layout.widgets.map(async (widgetInstance) => {
        const widget = availableWidgets.value.find(w => w.id === widgetInstance.widgetId)
        if (widget?.dataSource) {
          const response = await axios.get(widget.dataSource)
          widgetData.value.set(widgetInstance.id, response.data)
        }
      })

      await Promise.all(promises)
    } catch (err: any) {
      console.error('Failed to fetch widget data:', err)
      // Don't set error state for individual widget failures
    }
  }

  const createDashboardLayout = async (layout: Omit<DashboardLayout, 'id'>): Promise<DashboardLayout> => {
    try {
      isLoading.value = true
      error.value = null

      const response = await axios.post('/api/dashboard/layouts', layout)
      const newLayout = response.data
      
      dashboardLayouts.value.push(newLayout)
      return newLayout
    } catch (err: any) {
      console.error('Failed to create dashboard layout:', err)
      error.value = err.response?.data?.message || 'Failed to create layout'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateDashboardLayout = async (layoutId: string, updates: Partial<DashboardLayout>): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const response = await axios.put(`/api/dashboard/layouts/${layoutId}`, updates)
      const updatedLayout = response.data
      
      const index = dashboardLayouts.value.findIndex(l => l.id === layoutId)
      if (index !== -1) {
        dashboardLayouts.value[index] = updatedLayout
      }
      
      if (currentLayout.value?.id === layoutId) {
        currentLayout.value = updatedLayout
      }
    } catch (err: any) {
      console.error('Failed to update dashboard layout:', err)
      error.value = err.response?.data?.message || 'Failed to update layout'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteDashboardLayout = async (layoutId: string): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      await axios.delete(`/api/dashboard/layouts/${layoutId}`)
      
      dashboardLayouts.value = dashboardLayouts.value.filter(l => l.id !== layoutId)
      
      if (currentLayout.value?.id === layoutId) {
        const defaultLayout = dashboardLayouts.value.find(l => l.isDefault) || dashboardLayouts.value[0]
        if (defaultLayout) {
          await setCurrentLayout(defaultLayout.id)
        } else {
          currentLayout.value = null
        }
      }
    } catch (err: any) {
      console.error('Failed to delete dashboard layout:', err)
      error.value = err.response?.data?.message || 'Failed to delete layout'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const addWidgetToLayout = async (widgetId: string, position: WidgetPosition, config?: WidgetConfig): Promise<void> => {
    if (!currentLayout.value) return

    try {
      const widget = availableWidgets.value.find(w => w.id === widgetId)
      if (!widget) {
        throw new Error('Widget not found')
      }

      const widgetInstance: WidgetInstance = {
        id: `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        widgetId,
        position,
        config: config || widget.defaultConfig,
        isVisible: true,
        widget
      }

      const updatedWidgets = [...currentLayout.value.widgets, widgetInstance]
      await updateDashboardLayout(currentLayout.value.id, { widgets: updatedWidgets })
    } catch (err: any) {
      console.error('Failed to add widget to layout:', err)
      error.value = err.response?.data?.message || 'Failed to add widget'
      throw err
    }
  }

  const removeWidgetFromLayout = async (widgetInstanceId: string): Promise<void> => {
    if (!currentLayout.value) return

    try {
      const updatedWidgets = currentLayout.value.widgets.filter(w => w.id !== widgetInstanceId)
      await updateDashboardLayout(currentLayout.value.id, { widgets: updatedWidgets })
      
      // Remove widget data from cache
      widgetData.value.delete(widgetInstanceId)
    } catch (err: any) {
      console.error('Failed to remove widget from layout:', err)
      error.value = err.response?.data?.message || 'Failed to remove widget'
      throw err
    }
  }

  const updateWidgetPosition = async (widgetInstanceId: string, position: WidgetPosition): Promise<void> => {
    if (!currentLayout.value) return

    try {
      const updatedWidgets = currentLayout.value.widgets.map(w => 
        w.id === widgetInstanceId ? { ...w, position } : w
      )
      await updateDashboardLayout(currentLayout.value.id, { widgets: updatedWidgets })
    } catch (err: any) {
      console.error('Failed to update widget position:', err)
      error.value = err.response?.data?.message || 'Failed to update widget position'
      throw err
    }
  }

  const updateWidgetConfig = async (widgetInstanceId: string, config: WidgetConfig): Promise<void> => {
    if (!currentLayout.value) return

    try {
      const updatedWidgets = currentLayout.value.widgets.map(w => 
        w.id === widgetInstanceId ? { ...w, config } : w
      )
      await updateDashboardLayout(currentLayout.value.id, { widgets: updatedWidgets })
    } catch (err: any) {
      console.error('Failed to update widget config:', err)
      error.value = err.response?.data?.message || 'Failed to update widget config'
      throw err
    }
  }

  const refreshWidgetData = async (widgetInstanceId?: string): Promise<void> => {
    if (!currentLayout.value) return

    try {
      const widgetsToRefresh = widgetInstanceId 
        ? currentLayout.value.widgets.filter(w => w.id === widgetInstanceId)
        : currentLayout.value.widgets

      const promises = widgetsToRefresh.map(async (widgetInstance) => {
        const widget = availableWidgets.value.find(w => w.id === widgetInstance.widgetId)
        if (widget?.dataSource) {
          const response = await axios.get(widget.dataSource)
          widgetData.value.set(widgetInstance.id, response.data)
        }
      })

      await Promise.all(promises)
    } catch (err: any) {
      console.error('Failed to refresh widget data:', err)
      // Don't set error state for data refresh failures
    }
  }

  const getWidgetData = (widgetInstanceId: string): WidgetData | undefined => {
    return widgetData.value.get(widgetInstanceId)
  }

  const startDragging = (widget: WidgetInstance): void => {
    isDragging.value = true
    draggedWidget.value = widget
  }

  const stopDragging = (): void => {
    isDragging.value = false
    draggedWidget.value = null
  }

  const initializeWidgets = async (): Promise<void> => {
    try {
      await Promise.all([
        fetchAvailableWidgets(),
        fetchDashboardLayouts()
      ])
    } catch (err) {
      console.warn('Widget initialization failed:', err)
    }
  }

  return {
    // State
    availableWidgets: readonly(availableWidgets),
    dashboardLayouts: readonly(dashboardLayouts),
    currentLayout: readonly(currentLayout),
    isLoading: readonly(isLoading),
    error: readonly(error),
    isDragging: readonly(isDragging),
    draggedWidget: readonly(draggedWidget),
    
    // Computed
    systemWidgets,
    customWidgets,
    currentWidgets,
    visibleWidgets,
    
    // Actions
    fetchAvailableWidgets,
    fetchDashboardLayouts,
    setCurrentLayout,
    createDashboardLayout,
    updateDashboardLayout,
    deleteDashboardLayout,
    addWidgetToLayout,
    removeWidgetFromLayout,
    updateWidgetPosition,
    updateWidgetConfig,
    refreshWidgetData,
    getWidgetData,
    startDragging,
    stopDragging,
    initializeWidgets
  }
})
