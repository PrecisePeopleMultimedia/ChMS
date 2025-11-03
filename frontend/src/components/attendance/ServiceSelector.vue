<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="row items-center q-gutter-md">
        <q-icon name="event" size="24px" color="primary" />
        <div class="col">
          <div class="text-subtitle2 text-weight-bold">Current Service</div>
          <div v-if="selectedService" class="text-body2 text-grey-7">
            {{ selectedService.name }} - {{ formatDate(selectedService.scheduled_date) }}
            {{ formatTime(selectedService.start_time) }}
          </div>
          <div v-else class="text-body2 text-grey-7">No service selected</div>
        </div>
        <q-btn
          flat
          icon="settings"
          label="Select Service"
          color="primary"
          @click="showServiceDialog = true"
        />
      </div>
    </q-card-section>

    <q-dialog v-model="showServiceDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Select Service</div>
        </q-card-section>

        <q-card-section>
          <q-select
            v-model="selectedServiceId"
            :options="serviceOptions"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            label="Service"
            :loading="attendanceStore.loading"
            @update:model-value="onServiceSelected"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No services available
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <div v-if="todayServices.length === 0" class="q-mt-md">
            <q-banner class="bg-warning text-white">
              No services scheduled for today. Would you like to create one?
            </q-banner>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            label="Create New Service"
            color="primary"
            @click="showCreateServiceDialog = true"
            v-if="todayServices.length === 0"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAttendanceStore, type Service } from '@/stores/attendance'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const attendanceStore = useAttendanceStore()

const selectedServiceId = ref<number | null>(null)
const showServiceDialog = ref(false)
const showCreateServiceDialog = ref(false)

const selectedService = computed(() => {
  if (!selectedServiceId.value) return null
  return attendanceStore.services.find(s => s.id === selectedServiceId.value) || null
})

const todayServices = computed(() => attendanceStore.todayServices)

const serviceOptions = computed(() => {
  return todayServices.value.map(service => ({
    label: `${service.name} - ${formatDate(service.scheduled_date)} ${formatTime(service.start_time)}`,
    value: service.id,
    service
  }))
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

const formatTime = (timeString: string) => {
  if (!timeString) return ''
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const onServiceSelected = (serviceId: number) => {
  selectedServiceId.value = serviceId
  showServiceDialog.value = false
  // Emit event for parent component
  // emit('service-selected', serviceId)
}

onMounted(async () => {
  try {
    await attendanceStore.fetchServices({ today: true })
    // Auto-select first service if available
    if (todayServices.value.length === 1) {
      selectedServiceId.value = todayServices.value[0].id
    }
  } catch (error) {
    console.error('Failed to load services:', error)
  }
})

defineExpose({
  selectedService,
  selectedServiceId
})
</script>

<style scoped lang="sass">
</style>

