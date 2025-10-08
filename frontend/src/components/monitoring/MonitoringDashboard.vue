<template>
  <div class="monitoring-dashboard">
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">
          <q-icon name="monitoring" class="q-mr-sm" />
          System Monitoring
        </div>
        
        <!-- Connection Status -->
        <div class="row q-gutter-md q-mb-md">
          <div class="col-12 col-md-6">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2">Connection Status</div>
                <div class="flex items-center q-mt-sm">
                  <q-icon 
                    :name="isOnline ? 'wifi' : 'wifi_off'" 
                    :color="isOnline ? 'positive' : 'negative'"
                    size="sm"
                    class="q-mr-sm"
                  />
                  <span :class="isOnline ? 'text-positive' : 'text-negative'">
                    {{ isOnline ? 'Online' : 'Offline' }}
                  </span>
                </div>
                <div class="text-caption text-grey-6 q-mt-xs">
                  Network: {{ connectionType }}
                </div>
              </q-card-section>
            </q-card>
          </div>
          
          <div class="col-12 col-md-6">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2">Performance Metrics</div>
                <div class="q-mt-sm">
                  <div class="text-caption">
                    Page Load: {{ performanceMetrics.pageLoadTime }}ms
                  </div>
                  <div class="text-caption">
                    API Response: {{ performanceMetrics.apiResponseTime }}ms
                  </div>
                  <div class="text-caption">
                    Memory: {{ Math.round(performanceMetrics.memoryUsage) }}MB
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Health Check Status -->
        <div class="row q-gutter-md">
          <div class="col-12">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2">Backend Health</div>
                <div v-if="healthStatus" class="q-mt-sm">
                  <div class="flex items-center q-mb-sm">
                    <q-icon 
                      :name="healthStatus.status === 'healthy' ? 'check_circle' : 'error'"
                      :color="healthStatus.status === 'healthy' ? 'positive' : 'negative'"
                      size="sm"
                      class="q-mr-sm"
                    />
                    <span :class="healthStatus.status === 'healthy' ? 'text-positive' : 'text-negative'">
                      {{ healthStatus.status === 'healthy' ? 'Healthy' : 'Degraded' }}
                    </span>
                  </div>
                  
                  <div v-if="healthStatus.checks" class="q-gutter-sm">
                    <div class="flex items-center">
                      <q-icon 
                        :name="healthStatus.checks.database?.status === 'connected' ? 'check' : 'close'"
                        :color="healthStatus.checks.database?.status === 'connected' ? 'positive' : 'negative'"
                        size="xs"
                        class="q-mr-sm"
                      />
                      <span class="text-caption">Database: {{ healthStatus.checks.database?.status }}</span>
                    </div>
                    
                    <div class="flex items-center">
                      <q-icon 
                        :name="healthStatus.checks.cache?.status === 'operational' ? 'check' : 'close'"
                        :color="healthStatus.checks.cache?.status === 'operational' ? 'positive' : 'negative'"
                        size="xs"
                        class="q-mr-sm"
                      />
                      <span class="text-caption">Cache: {{ healthStatus.checks.cache?.status }}</span>
                    </div>
                    
                    <div class="flex items-center">
                      <q-icon 
                        :name="healthStatus.checks.storage?.status === 'writable' ? 'check' : 'close'"
                        :color="healthStatus.checks.storage?.status === 'writable' ? 'positive' : 'negative'"
                        size="xs"
                        class="q-mr-sm"
                      />
                      <span class="text-caption">Storage: {{ healthStatus.checks.storage?.status }}</span>
                    </div>
                  </div>
                </div>
                
                <div v-else class="text-caption text-grey-6">
                  Checking health status...
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Actions -->
        <div class="q-mt-md">
          <q-btn 
            color="primary" 
            icon="refresh" 
            label="Refresh Status"
            @click="refreshHealthStatus"
            :loading="loading"
          />
          <q-btn 
            color="secondary" 
            icon="memory" 
            label="Check Memory"
            @click="checkMemoryUsage"
            class="q-ml-sm"
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { usePerformance } from '@/composables/usePerformance'
import axios from '@/utils/apiMonitor'

const { 
  performanceMetrics, 
  isOnline, 
  connectionType, 
  trackMemoryUsage 
} = usePerformance()

const healthStatus = ref<any>(null)
const loading = ref(false)

// Check backend health status
async function refreshHealthStatus() {
  loading.value = true
  try {
    const response = await axios.get('/api/health')
    healthStatus.value = response.data
  } catch (error) {
    console.error('Failed to fetch health status:', error)
    healthStatus.value = {
      status: 'error',
      error: 'Failed to connect to backend'
    }
  } finally {
    loading.value = false
  }
}

// Check memory usage
function checkMemoryUsage() {
  trackMemoryUsage()
}

// Initialize monitoring
onMounted(() => {
  refreshHealthStatus()
  
  // Refresh health status every 30 seconds
  const interval = setInterval(refreshHealthStatus, 30000)
  
  // Cleanup on unmount
  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>

<style scoped>
.monitoring-dashboard {
  max-width: 800px;
  margin: 0 auto;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.text-caption {
  font-size: 0.75rem;
}

.text-subtitle2 {
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
