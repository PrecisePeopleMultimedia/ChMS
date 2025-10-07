<template>
  <q-card style="min-width: 600px; max-width: 800px">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6">
        {{ isEditing ? 'Edit Member' : 'Add New Member' }}
      </div>
      <q-space />
      <q-btn icon="close" flat round dense @click="$emit('cancel')" />
    </q-card-section>

    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-card-section>
        <!-- Duplicate Warning -->
        <q-banner
          v-if="duplicateWarning"
          class="bg-orange-1 text-orange-9 q-mb-md"
          rounded
        >
          <template v-slot:avatar>
            <q-icon name="warning" color="orange" />
          </template>
          <div class="text-weight-medium">Potential duplicate member found</div>
          <div class="text-body2 q-mt-xs">
            A member with similar information already exists. Please verify this is not a duplicate.
          </div>
          <template v-slot:action>
            <q-btn
              flat
              color="orange"
              label="Continue Anyway"
              @click="ignoreDuplicate = true"
            />
          </template>
        </q-banner>

        <div class="row q-gutter-md">
          <!-- Personal Information -->
          <div class="col-12">
            <div class="text-subtitle1 text-weight-medium q-mb-md">
              Personal Information
            </div>
          </div>

          <!-- First Name -->
          <div class="col-md-6 col-sm-12">
            <q-input
              v-model="form.first_name"
              label="First Name *"
              outlined
              :rules="[val => !!val || 'First name is required']"
              maxlength="100"
            />
          </div>

          <!-- Last Name -->
          <div class="col-md-6 col-sm-12">
            <q-input
              v-model="form.last_name"
              label="Last Name *"
              outlined
              :rules="[val => !!val || 'Last name is required']"
              maxlength="100"
            />
          </div>

          <!-- Email -->
          <div class="col-md-6 col-sm-12">
            <q-input
              v-model="form.email"
              label="Email"
              type="email"
              outlined
              :rules="[
                val => !val || /.+@.+\..+/.test(val) || 'Please enter a valid email'
              ]"
            />
          </div>

          <!-- Phone -->
          <div class="col-md-6 col-sm-12">
            <q-input
              v-model="form.phone"
              label="Phone"
              outlined
              maxlength="50"
            />
          </div>

          <!-- Date of Birth -->
          <div class="col-md-6 col-sm-12">
            <q-input
              v-model="form.date_of_birth"
              label="Date of Birth"
              outlined
              type="date"
              :max="maxBirthDate"
            />
          </div>

          <!-- Gender -->
          <div class="col-md-6 col-sm-12">
            <q-select
              v-model="form.gender"
              :options="genderOptions"
              label="Gender"
              outlined
              clearable
            />
          </div>

          <!-- Member Type -->
          <div class="col-md-6 col-sm-12">
            <q-select
              v-model="form.member_type"
              :options="memberTypeOptions"
              label="Member Type *"
              outlined
              :rules="[val => !!val || 'Member type is required']"
            />
          </div>

          <!-- Join Date -->
          <div class="col-md-6 col-sm-12">
            <q-input
              v-model="form.join_date"
              label="Join Date"
              outlined
              type="date"
              :max="today"
            />
          </div>

          <!-- Family -->
          <div class="col-12">
            <q-select
              v-model="form.family_id"
              :options="familyOptions"
              label="Family"
              outlined
              clearable
              use-input
              input-debounce="300"
              @filter="filterFamilies"
              option-value="value"
              option-label="label"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No families found
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Address -->
          <div class="col-12">
            <q-input
              v-model="form.address"
              label="Address"
              outlined
              type="textarea"
              rows="3"
            />
          </div>

          <!-- Notes -->
          <div class="col-12">
            <q-input
              v-model="form.notes"
              label="Notes"
              outlined
              type="textarea"
              rows="3"
            />
          </div>

          <!-- Active Status (for editing) -->
          <div v-if="isEditing" class="col-12">
            <q-checkbox
              v-model="form.is_active"
              label="Active Member"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          flat
          label="Cancel"
          color="grey-7"
          @click="$emit('cancel')"
        />
        <q-btn
          type="submit"
          :label="isEditing ? 'Update Member' : 'Create Member'"
          color="primary"
          :loading="saving"
          unelevated
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { date } from 'quasar'
import { useFamiliesStore } from '@/stores/families'
import type { Member } from '@/types/member'

// Props
interface Props {
  member?: Member | null
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  save: [memberData: Partial<Member>]
  cancel: []
}>()

// Store
const familiesStore = useFamiliesStore()

// Reactive data
const saving = ref(false)
const duplicateWarning = ref(false)
const ignoreDuplicate = ref(false)
const familyOptions = ref<Array<{label: string, value: number}>>([])

// Form data
const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  date_of_birth: '',
  gender: null as string | null,
  address: '',
  member_type: 'adult',
  join_date: date.formatDate(new Date(), 'YYYY-MM-DD'),
  family_id: null as number | null,
  notes: '',
  is_active: true
})

// Options
const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' }
]

const memberTypeOptions = [
  { label: 'Adult', value: 'adult' },
  { label: 'Child', value: 'child' },
  { label: 'Youth', value: 'youth' },
  { label: 'Visitor', value: 'visitor' }
]

// Computed
const isEditing = computed(() => !!props.member?.id)
const today = computed(() => date.formatDate(new Date(), 'YYYY-MM-DD'))
const maxBirthDate = computed(() => date.formatDate(new Date(), 'YYYY-MM-DD'))

// Methods
const initializeForm = () => {
  if (props.member) {
    form.value = {
      first_name: props.member.first_name || '',
      last_name: props.member.last_name || '',
      email: props.member.email || '',
      phone: props.member.phone || '',
      date_of_birth: props.member.date_of_birth || '',
      gender: props.member.gender || null,
      address: props.member.address || '',
      member_type: props.member.member_type || 'adult',
      join_date: props.member.join_date || date.formatDate(new Date(), 'YYYY-MM-DD'),
      family_id: props.member.family_id || null,
      notes: props.member.notes || '',
      is_active: props.member.is_active ?? true
    }
  } else {
    // Reset form for new member
    form.value = {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      gender: null,
      address: '',
      member_type: 'adult',
      join_date: date.formatDate(new Date(), 'YYYY-MM-DD'),
      family_id: null,
      notes: '',
      is_active: true
    }
  }
  
  duplicateWarning.value = false
  ignoreDuplicate.value = false
}

const loadFamilies = async () => {
  try {
    await familiesStore.fetchFamilies()
    familyOptions.value = familiesStore.families.map(family => ({
      label: family.family_name,
      value: family.id
    }))
  } catch (error) {
    console.error('Failed to load families:', error)
  }
}

const filterFamilies = (val: string, update: Function) => {
  update(() => {
    if (val === '') {
      familyOptions.value = familiesStore.families.map(family => ({
        label: family.family_name,
        value: family.id
      }))
    } else {
      const needle = val.toLowerCase()
      familyOptions.value = familiesStore.families
        .filter(family => family.family_name.toLowerCase().includes(needle))
        .map(family => ({
          label: family.family_name,
          value: family.id
        }))
    }
  })
}

const onSubmit = async () => {
  if (duplicateWarning.value && !ignoreDuplicate.value) {
    return
  }

  saving.value = true
  try {
    // Clean up form data
    const memberData = { ...form.value }
    
    // Remove empty strings and convert to null
    Object.keys(memberData).forEach(key => {
      if (memberData[key as keyof typeof memberData] === '') {
        memberData[key as keyof typeof memberData] = null as any
      }
    })

    emit('save', memberData)
  } catch (error) {
    console.error('Form submission error:', error)
  } finally {
    saving.value = false
  }
}

// Watch for duplicate detection
watch([() => form.value.first_name, () => form.value.last_name, () => form.value.email, () => form.value.phone], 
  () => {
    // Reset duplicate warning when form changes
    duplicateWarning.value = false
    ignoreDuplicate.value = false
  }
)

// Lifecycle
onMounted(() => {
  initializeForm()
  loadFamilies()
})

// Watch for prop changes
watch(() => props.member, () => {
  initializeForm()
}, { deep: true })
</script>

<style scoped>
.q-card {
  max-height: 90vh;
  overflow-y: auto;
}
</style>
