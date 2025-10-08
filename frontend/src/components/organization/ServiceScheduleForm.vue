<template>
  <div class="service-schedule-form">
    <div class="text-h6 q-mb-md">Service Times</div>
    <div class="text-body2 text-grey-6 q-mb-lg">
      Set up your regular service schedules. You can add more services later.
    </div>

    <!-- Existing Schedules -->
    <div v-if="schedules.length > 0" class="q-mb-lg">
      <q-list bordered separator class="rounded-borders">
        <q-item
          v-for="(schedule, index) in schedules"
          :key="index"
          class="schedule-item"
        >
          <q-item-section avatar>
            <q-icon :name="schedule.is_active ? 'event' : 'event_busy'" 
                    :color="schedule.is_active ? 'primary' : 'grey'" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-medium">
              {{ schedule.name }}
            </q-item-label>
            <q-item-label caption>
              {{ getDayName(schedule.day_of_week) }} • 
              {{ formatTime(schedule.start_time) }}
              <span v-if="schedule.end_time">- {{ formatTime(schedule.end_time) }}</span>
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="row q-gutter-xs">
              <q-btn
                flat
                round
                dense
                icon="edit"
                color="primary"
                @click="editSchedule(index)"
                :disable="loading"
              >
                <q-tooltip>Edit Schedule</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                @click="removeSchedule(index)"
                :disable="loading"
              >
                <q-tooltip>Remove Schedule</q-tooltip>
              </q-btn>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Add New Schedule Form -->
    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <div class="text-subtitle2 q-mb-md">
          {{ editingIndex !== -1 ? 'Edit Service' : 'Add New Service' }}
        </div>

        <q-form @submit="handleAddSchedule" class="q-gutter-md">
          <!-- Service Name -->
          <q-input
            v-model="newSchedule.name"
            label="Service Name *"
            outlined
            :error="hasError('name')"
            :error-message="getError('name')"
            :loading="loading"
            maxlength="255"
            class="full-width"
            placeholder="e.g., Sunday Morning Service, Bible Study"
          >
            <template v-slot:prepend>
              <q-icon name="event" />
            </template>
          </q-input>

          <!-- Day and Time Row -->
          <div class="row q-gutter-md">
            <div class="col-12 col-md-4">
              <q-select
                v-model="newSchedule.day_of_week"
                label="Day of Week *"
                outlined
                :options="dayOptions"
                :error="hasError('day_of_week')"
                :error-message="getError('day_of_week')"
                :loading="loading"
                emit-value
                map-options
                class="full-width"
              >
                <template v-slot:prepend>
                  <q-icon name="calendar_today" />
                </template>
              </q-select>
            </div>

            <div class="col-12 col-md-4">
              <q-input
                v-model="newSchedule.start_time"
                label="Start Time *"
                outlined
                type="time"
                :error="hasError('start_time')"
                :error-message="getError('start_time')"
                :loading="loading"
                class="full-width"
              >
                <template v-slot:prepend>
                  <q-icon name="access_time" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-4">
              <q-input
                v-model="newSchedule.end_time"
                label="End Time"
                outlined
                type="time"
                :error="hasError('end_time')"
                :error-message="getError('end_time')"
                :loading="loading"
                class="full-width"
              >
                <template v-slot:prepend>
                  <q-icon name="access_time" />
                </template>
              </q-input>
            </div>
          </div>

          <!-- Active Toggle -->
          <q-toggle
            v-model="newSchedule.is_active"
            label="Active Service"
            color="primary"
            :disable="loading"
          />

          <!-- Form Actions -->
          <div class="row justify-end q-gutter-sm">
            <q-btn
              v-if="editingIndex !== -1"
              flat
              label="Cancel"
              @click="cancelEdit"
              :disable="loading"
            />
            <q-btn
              type="submit"
              color="primary"
              :label="editingIndex !== -1 ? 'Update Service' : 'Add Service'"
              :loading="loading"
              :disable="!isNewScheduleValid"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <!-- Continue Button -->
    <div class="row justify-end q-mt-lg">
      <q-btn
        color="primary"
        label="Continue"
        @click="handleSubmit"
        :loading="loading"
        :disable="schedules.length === 0"
        size="md"
        class="q-px-xl"
      />
    </div>

    <!-- Help Text -->
    <q-banner class="bg-blue-1 text-blue-9 q-mt-md" rounded>
      <template v-slot:avatar>
        <q-icon name="info" color="blue" />
      </template>
      <div class="text-body2">
        <strong>Tip:</strong> You can add multiple services for different days and times. 
        Don't worry if you're not sure about all your services now - you can always add more later.
      </div>
    </q-banner>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Types
interface ServiceSchedule {
  name: string
  day_of_week: number
  start_time: string
  end_time?: string
  is_active: boolean
}

// Props
interface Props {
  modelValue: ServiceSchedule[]
  loading?: boolean
  errors?: Record<string, string[]>
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  errors: () => ({})
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: ServiceSchedule[]]
  'submit': []
}>()

// State
const editingIndex = ref(-1)
const newSchedule = ref<ServiceSchedule>({
  name: '',
  day_of_week: 0,
  start_time: '09:00',
  end_time: '11:00',
  is_active: true
})

// Computed
const schedules = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isNewScheduleValid = computed(() => {
  return newSchedule.value.name.trim().length > 0 && 
         newSchedule.value.start_time.length > 0
})

const dayOptions = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 }
]

// Methods
const getDayName = (dayOfWeek: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[dayOfWeek] || 'Unknown'
}

const formatTime = (time: string): string => {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours || '0')
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

const hasError = (field: string): boolean => {
  return !!(props.errors[field] && props.errors[field].length > 0)
}

const getError = (field: string): string => {
  return props.errors[field]?.[0] || ''
}

const handleAddSchedule = () => {
  if (!isNewScheduleValid.value) return

  const schedulesCopy = [...schedules.value]
  
  if (editingIndex.value !== -1) {
    // Update existing schedule
    schedulesCopy[editingIndex.value] = { ...newSchedule.value }
    editingIndex.value = -1
  } else {
    // Add new schedule
    schedulesCopy.push({ ...newSchedule.value })
  }

  schedules.value = schedulesCopy
  resetNewSchedule()
}

const editSchedule = (index: number) => {
  const schedule = schedules.value[index]
  if (schedule) {
    newSchedule.value = { ...schedule }
  }
  editingIndex.value = index
}

const removeSchedule = (index: number) => {
  const schedulesCopy = [...schedules.value]
  schedulesCopy.splice(index, 1)
  schedules.value = schedulesCopy
  
  if (editingIndex.value === index) {
    cancelEdit()
  }
}

const cancelEdit = () => {
  editingIndex.value = -1
  resetNewSchedule()
}

const resetNewSchedule = () => {
  newSchedule.value = {
    name: '',
    day_of_week: 0,
    start_time: '09:00',
    end_time: '11:00',
    is_active: true
  }
}

const handleSubmit = () => {
  emit('submit')
}
</script>

<style lang="sass" scoped>
.service-schedule-form
  max-width: 700px
  margin: 0 auto

.schedule-item
  .q-item__section--avatar
    .q-icon
      font-size: 1.5rem

@media (max-width: 600px)
  .row.q-gutter-md
    .col-md-4
      margin-bottom: 1rem

  .q-px-xl
    padding-left: 1rem !important
    padding-right: 1rem !important
</style>
