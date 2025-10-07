<template>
  <div class="quick-member-add-widget">
    <!-- Widget Content -->
    <div class="widget-content">
      <!-- Header -->
      <div class="widget-header">
        <q-icon name="person_add" size="md" color="primary" />
        <div class="header-text">
          <div class="text-subtitle2">Quick Add Member</div>
          <div class="text-caption text-grey-6">Add new member quickly</div>
        </div>
      </div>
      
      <!-- Quick Form -->
      <q-form @submit="handleSubmit" class="quick-form">
        <div class="form-row">
          <q-input
            v-model="memberData.firstName"
            label="First Name"
            outlined
            dense
            class="col"
            :rules="[val => !!val || 'First name is required']"
          />
          <q-input
            v-model="memberData.lastName"
            label="Last Name"
            outlined
            dense
            class="col q-ml-sm"
            :rules="[val => !!val || 'Last name is required']"
          />
        </div>
        
        <q-input
          v-model="memberData.email"
          label="Email"
          type="email"
          outlined
          dense
          class="q-mt-sm"
          :rules="[
            val => !val || /.+@.+\..+/.test(val) || 'Please enter a valid email'
          ]"
        />
        
        <q-input
          v-model="memberData.phone"
          label="Phone"
          outlined
          dense
          class="q-mt-sm"
          mask="(###) ###-####"
          hint="Optional"
        />
        
        <!-- Action Buttons -->
        <div class="action-buttons q-mt-md">
          <q-btn
            type="submit"
            color="primary"
            icon="add"
            label="Add Member"
            :loading="isSubmitting"
            :disable="!isFormValid"
            class="full-width"
          />
          
          <div class="secondary-actions q-mt-sm">
            <q-btn
              flat
              dense
              size="sm"
              icon="more_horiz"
              label="Advanced"
              color="grey-6"
              @click="openAdvancedForm"
            />
            <q-btn
              flat
              dense
              size="sm"
              icon="upload"
              label="Import"
              color="grey-6"
              @click="openImportDialog"
            />
          </div>
        </div>
      </q-form>
      
      <!-- Recent Additions -->
      <div v-if="recentMembers.length" class="recent-additions q-mt-md">
        <div class="text-caption text-grey-6 q-mb-xs">Recently Added</div>
        <div class="recent-list">
          <div
            v-for="member in recentMembers.slice(0, 3)"
            :key="member.id"
            class="recent-item"
          >
            <q-avatar size="24px" color="primary" text-color="white">
              {{ member.firstName[0] }}{{ member.lastName[0] }}
            </q-avatar>
            <span class="text-caption q-ml-xs">
              {{ member.firstName }} {{ member.lastName }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Success Message -->
    <q-banner
      v-if="showSuccess"
      class="success-banner"
      dense
      rounded
      color="positive"
      text-color="white"
    >
      <template v-slot:avatar>
        <q-icon name="check_circle" />
      </template>
      Member added successfully!
    </q-banner>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { WidgetInstance, WidgetConfig } from '@/stores/widgets'

interface Props {
  widget: WidgetInstance
  data?: any
  config: WidgetConfig
  isLoading?: boolean
  error?: string
}

interface Emits {
  (e: 'update-config', config: WidgetConfig): void
  (e: 'member-added', member: any): void
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
})

const emit = defineEmits<Emits>()
const router = useRouter()

// Reactive state
const isSubmitting = ref(false)
const showSuccess = ref(false)
const memberData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

// Computed properties
const isFormValid = computed(() => {
  return memberData.firstName.trim() && memberData.lastName.trim()
})

const recentMembers = computed(() => {
  return props.data?.recentMembers || []
})

// Methods
const handleSubmit = async () => {
  if (!isFormValid.value) return
  
  try {
    isSubmitting.value = true
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newMember = {
      id: Date.now().toString(),
      firstName: memberData.firstName.trim(),
      lastName: memberData.lastName.trim(),
      email: memberData.email.trim() || null,
      phone: memberData.phone.trim() || null,
      createdAt: new Date().toISOString()
    }
    
    // Emit member added event
    emit('member-added', newMember)
    
    // Reset form
    resetForm()
    
    // Show success message
    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
    
  } catch (error) {
    console.error('Failed to add member:', error)
    // TODO: Show error message
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  memberData.firstName = ''
  memberData.lastName = ''
  memberData.email = ''
  memberData.phone = ''
}

const openAdvancedForm = () => {
  // Navigate to full member form with pre-filled data
  router.push({
    name: 'member-add',
    query: {
      firstName: memberData.firstName,
      lastName: memberData.lastName,
      email: memberData.email,
      phone: memberData.phone
    }
  })
}

const openImportDialog = () => {
  // Open import dialog
  router.push({ name: 'member-import' })
}

// Watchers
watch(() => props.config, (newConfig) => {
  // Handle configuration changes
  if (newConfig.autoReset) {
    resetForm()
  }
}, { deep: true })
</script>

<style scoped>
.quick-member-add-widget {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.widget-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.widget-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--q-color-separator);
}

.header-text {
  margin-left: 12px;
}

.quick-form {
  flex: 1;
}

.form-row {
  display: flex;
  gap: 8px;
}

.action-buttons {
  margin-top: auto;
}

.secondary-actions {
  display: flex;
  justify-content: space-between;
}

.recent-additions {
  border-top: 1px solid var(--q-color-separator);
  padding-top: 12px;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.recent-item {
  display: flex;
  align-items: center;
  padding: 4px 0;
}

.success-banner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 12px;
  }
  
  .form-row .q-ml-sm {
    margin-left: 0;
  }
  
  .secondary-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .secondary-actions .q-btn {
    width: 100%;
  }
}

/* Small widget size adjustments */
.dashboard-widget[data-size="small"] .recent-additions {
  display: none;
}

.dashboard-widget[data-size="small"] .secondary-actions {
  display: none;
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .quick-form .q-input {
    /* Larger touch targets */
  }
  
  .action-buttons .q-btn {
    min-height: 44px;
  }
  
  .secondary-actions .q-btn {
    min-height: 36px;
  }
}
</style>
