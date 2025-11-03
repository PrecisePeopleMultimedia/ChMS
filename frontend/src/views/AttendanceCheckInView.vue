<template>
  <div class="attendance-checkin-view">
    <div class="row q-col-gutter-md">
      <!-- Service Selector -->
      <div class="col-12">
        <ServiceSelector ref="serviceSelector" />
      </div>

      <!-- Check-In Methods -->
      <div class="col-12">
        <q-tabs
          v-model="activeTab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="qr" icon="qr_code_scanner" label="QR Code" />
          <q-tab name="manual" icon="person_add" label="Manual" />
          <q-tab name="family" icon="group" label="Family" />
        </q-tabs>

        <q-tab-panels v-model="activeTab" animated>
          <q-tab-panel name="qr">
            <QRScanner :service-id="currentServiceId" />
          </q-tab-panel>

          <q-tab-panel name="manual">
            <ManualCheckIn :service-id="currentServiceId" />
          </q-tab-panel>

          <q-tab-panel name="family">
            <FamilyCheckIn :service-id="currentServiceId" />
          </q-tab-panel>
        </q-tab-panels>
      </div>

      <!-- Live Dashboard -->
      <div class="col-12">
        <AttendanceDashboard />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAttendanceStore } from '@/stores/attendance'
import ServiceSelector from '@/components/attendance/ServiceSelector.vue'
import QRScanner from '@/components/attendance/QRScanner.vue'
import ManualCheckIn from '@/components/attendance/ManualCheckIn.vue'
import FamilyCheckIn from '@/components/attendance/FamilyCheckIn.vue'
import AttendanceDashboard from '@/components/attendance/AttendanceDashboard.vue'

const attendanceStore = useAttendanceStore()
const serviceSelector = ref<InstanceType<typeof ServiceSelector> | null>(null)

const activeTab = ref('qr')

const currentServiceId = computed(() => {
  return serviceSelector.value?.selectedServiceId || null
})

onMounted(async () => {
  // Fetch today's attendance
  try {
    const today = new Date().toISOString().split('T')[0]
    await attendanceStore.fetchAttendanceRecords({ today: true })
  } catch (error) {
    console.error('Failed to load attendance:', error)
  }
})
</script>

<style scoped lang="sass">
.attendance-checkin-view
  padding: 16px
  max-width: 1200px
  margin: 0 auto
</style>

