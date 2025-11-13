<template>
  <ModernDialog
    :model-value="true"
    @update:model-value="!$event && emit('cancel')"
    :title="isEditing ? 'Edit Service' : 'Create New Service'"
    :description="isEditing ? 'Update service details and schedule' : 'Set up a new church service with schedule and location details'"
  >
    <form @submit.prevent="handleSubmit">
      <ModernTabs
        v-model="activeTab"
        :tabs="[
          { value: 'basic', label: 'Basic Info' },
          { value: 'schedule', label: 'Schedule' },
          { value: 'location', label: 'Location' }
        ]"
      >
        <!-- Basic Info Tab -->
        <template #panel-basic>
          <div class="space-y-4">
            <div class="space-y-2">
              <label for="name" class="text-sm font-medium">Service Name *</label>
              <ModernInput
                id="name"
                v-model="formData.name"
                placeholder="e.g., Sunday Morning Worship"
                required
              />
            </div>

            <div class="space-y-2">
              <label for="serviceType" class="text-sm font-medium">Service Type *</label>
              <ModernSelect
                id="serviceType"
                v-model="formData.serviceType"
                :options="serviceTypeOptions"
              />
            </div>

            <div class="space-y-2">
              <label for="description" class="text-sm font-medium">Description</label>
              <q-input
                id="description"
                v-model="formData.description"
                type="textarea"
                placeholder="Describe the service (optional)"
                :rows="3"
                outlined
                dense
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label for="capacity" class="text-sm font-medium">Capacity</label>
                <ModernInput
                  id="capacity"
                  v-model.number="formData.capacity"
                  type="number"
                  placeholder="Maximum capacity"
                />
              </div>

              <div class="space-y-2">
                <label for="expectedAttendance" class="text-sm font-medium">Expected Attendance</label>
                <ModernInput
                  id="expectedAttendance"
                  v-model.number="formData.expectedAttendance"
                  type="number"
                  placeholder="Estimated attendees"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label for="notes" class="text-sm font-medium">Notes</label>
              <q-input
                id="notes"
                v-model="formData.notes"
                type="textarea"
                placeholder="Additional notes (optional)"
                :rows="2"
                outlined
                dense
              />
            </div>
          </div>
        </template>

        <!-- Schedule Tab -->
        <template #panel-schedule>
          <div class="space-y-4">
            <div class="space-y-2">
              <label for="scheduledDate" class="text-sm font-medium">Date *</label>
              <ModernInput
                id="scheduledDate"
                v-model="formData.scheduledDate"
                type="date"
                required
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label for="startTime" class="text-sm font-medium">Start Time *</label>
                <ModernInput
                  id="startTime"
                  v-model="formData.startTime"
                  type="time"
                  required
                />
              </div>

              <div class="space-y-2">
                <label for="endTime" class="text-sm font-medium">End Time *</label>
                <ModernInput
                  id="endTime"
                  v-model="formData.endTime"
                  type="time"
                  required
                />
              </div>
            </div>

            <div class="space-y-2">
              <label for="frequency" class="text-sm font-medium">Frequency</label>
              <ModernSelect
                id="frequency"
                v-model="formData.frequency"
                :options="frequencyOptions"
              />
            </div>

            <div v-if="formData.frequency !== 'one-time'" class="space-y-2">
              <label for="dayOfWeek" class="text-sm font-medium">Day of Week</label>
              <ModernSelect
                id="dayOfWeek"
                v-model="formData.dayOfWeek"
                :options="dayOfWeekOptions"
              />
            </div>

            <div class="space-y-2">
              <label for="status" class="text-sm font-medium">Status</label>
              <ModernSelect
                id="status"
                v-model="formData.status"
                :options="statusOptions"
              />
            </div>
          </div>
        </template>

        <!-- Location Tab -->
        <template #panel-location>
          <div class="space-y-4">
            <div class="space-y-2">
              <label for="locationType" class="text-sm font-medium">Location Type</label>
              <ModernSelect
                id="locationType"
                v-model="locationType"
                :options="locationTypeOptions"
              />
            </div>

            <div v-if="locationType === 'physical' || locationType === 'hybrid'" class="space-y-2">
              <label for="venue" class="text-sm font-medium">Venue</label>
              <ModernInput
                id="venue"
                v-model="venue"
                placeholder="e.g., Main Sanctuary, Youth Hall"
              />
            </div>

            <div v-if="locationType === 'online' || locationType === 'hybrid'" class="space-y-2">
              <label for="onlineUrl" class="text-sm font-medium">Online Link</label>
              <ModernInput
                id="onlineUrl"
                v-model="onlineUrl"
                type="url"
                placeholder="https://zoom.us/j/123456789"
              />
            </div>

            <ModernCard class="bg-accent/50 border-primary/20">
              <ModernCardContent class="pt-6">
                <div class="flex items-start gap-3">
                  <q-icon name="place" class="h-5 w-5 text-primary mt-0.5" />
                  <div class="space-y-1">
                    <p class="text-sm font-medium">Location Tracking</p>
                    <p class="text-xs text-muted-foreground">
                      Advanced location features (buildings, rooms, capacity tracking) will be available 
                      in Milestone 3: Location-Specific Tracking.
                    </p>
                  </div>
                </div>
              </ModernCardContent>
            </ModernCard>
          </div>
        </template>
      </ModernTabs>

      <template #footer>
        <div class="flex justify-end gap-2">
          <ModernButton
            type="button"
            variant="outline"
            @click="emit('cancel')"
          >
            Cancel
          </ModernButton>
          <ModernButton
            type="submit"
            class="bg-[#1CE479] hover:bg-[#1CE479]/90 text-[#0A0A0F]"
          >
            <q-icon name="save" class="h-4 w-4 mr-2" />
            {{ isEditing ? 'Update Service' : 'Create Service' }}
          </ModernButton>
        </div>
      </template>
    </form>
  </ModernDialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ModernDialog from '@/components/ui/ModernDialog.vue'
import ModernTabs from '@/components/ui/ModernTabs.vue'
import ModernInput from '@/components/ui/ModernInput.vue'
import ModernSelect from '@/components/ui/ModernSelect.vue'
import ModernButton from '@/components/ui/ModernButton.vue'
import ModernCard from '@/components/ui/ModernCard.vue'
import ModernCardContent from '@/components/ui/ModernCardContent.vue'
import {
  SERVICE_TYPE_LABELS,
  SERVICE_FREQUENCY_LABELS,
  DAY_OF_WEEK_LABELS,
  SERVICE_STATUS_LABELS,
  type Service,
  type ServiceType,
  type ServiceStatus,
  type ServiceFrequency,
  type DayOfWeek,
} from '@/types/service'

interface Props {
  service?: Service | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'save', service: Partial<Service>): void
  (e: 'cancel'): void
}>()

const isEditing = computed(() => !!props.service)
const activeTab = ref('basic')

const formData = ref<Partial<Service>>({
  name: props.service?.name || '',
  serviceType: props.service?.serviceType || 'sunday_morning',
  scheduledDate: props.service?.scheduledDate || new Date().toISOString().split('T')[0],
  startTime: props.service?.startTime || '09:00',
  endTime: props.service?.endTime || '11:00',
  status: props.service?.status || 'scheduled',
  frequency: props.service?.frequency || 'weekly',
  dayOfWeek: props.service?.dayOfWeek || 'sunday',
  capacity: props.service?.capacity,
  expectedAttendance: props.service?.expectedAttendance,
  location: props.service?.location || {
    type: 'physical',
    venue: '',
  },
  description: props.service?.description || '',
  notes: props.service?.notes || '',
})

const locationType = computed({
  get: () => formData.value.location?.type || 'physical',
  set: (value) => {
    formData.value.location = {
      ...formData.value.location,
      type: value,
    } as Service['location']
  },
})

const venue = computed({
  get: () => formData.value.location?.venue || '',
  set: (value) => {
    formData.value.location = {
      ...formData.value.location,
      venue: value,
    } as Service['location']
  },
})

const onlineUrl = computed({
  get: () => formData.value.location?.onlineUrl || '',
  set: (value) => {
    formData.value.location = {
      ...formData.value.location,
      onlineUrl: value,
    } as Service['location']
  },
})

const serviceTypeOptions = Object.entries(SERVICE_TYPE_LABELS).map(([value, label]) => ({
  label,
  value,
}))

const frequencyOptions = Object.entries(SERVICE_FREQUENCY_LABELS).map(([value, label]) => ({
  label,
  value,
}))

const dayOfWeekOptions = Object.entries(DAY_OF_WEEK_LABELS).map(([value, label]) => ({
  label,
  value,
}))

const statusOptions = Object.entries(SERVICE_STATUS_LABELS).map(([value, label]) => ({
  label,
  value,
}))

const locationTypeOptions = [
  { label: 'Physical', value: 'physical' },
  { label: 'Online', value: 'online' },
  { label: 'Hybrid', value: 'hybrid' },
]

const handleSubmit = () => {
  const serviceData: Partial<Service> = {
    ...formData.value,
    organizationId: props.service?.organizationId || 'org1',
    branchId: props.service?.branchId || 'branch1',
    createdBy: props.service?.createdBy || 'user1',
    createdAt: props.service?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  emit('save', serviceData)
}
</script>

