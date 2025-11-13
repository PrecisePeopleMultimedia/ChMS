<template>
  <ModernDialog
    :model-value="open"
    @update:model-value="!$event && handleClose()"
    title="Add New Member"
    description="Fill in the member's information or bulk import from CSV/Excel. All new members receive email notifications with an option to request removal."
    max-width="800px"
  >
    <template #title>
      <div class="flex items-center gap-2">
        <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <q-icon name="person" class="h-5 w-5 text-primary" />
        </div>
        Add New Member
      </div>
    </template>

    <!-- Step Indicators -->
    <div class="flex items-center justify-center gap-2 py-4">
      <div
        v-for="(step, index) in steps"
        :key="step.id"
        class="flex items-center"
      >
        <div class="flex flex-col items-center gap-2">
          <button
            type="button"
            @click="setCurrentStep(index)"
            :class="[
              'w-10 h-10 rounded-md flex items-center justify-center transition-all',
              index === currentStep ? 'bg-primary text-primary-foreground shadow-lg scale-110' : '',
              index < currentStep ? 'bg-success text-success-foreground' : '',
              index !== currentStep && index >= currentStep ? 'bg-muted text-muted-foreground' : '',
              'hover:scale-105 cursor-pointer'
            ]"
          >
            <q-icon :name="step.icon" class="h-5 w-5" />
          </button>
          <span :class="['text-xs', index === currentStep ? 'font-medium' : 'text-muted-foreground']">
            {{ step.label }}
          </span>
        </div>
        <div
          v-if="index < steps.length - 1"
          :class="['h-0.5 w-12', index < currentStep ? 'bg-success' : 'bg-muted']"
        />
      </div>
    </div>

    <div class="h-px bg-border my-4" />

    <!-- Bulk Import Toggle -->
    <div v-if="currentStep === 0" class="flex items-center justify-end gap-2 mb-4">
      <ModernButton
        type="button"
        variant="outline"
        size="sm"
        @click="showBulkImport = !showBulkImport"
        class="gap-2"
      >
        <q-icon name="upload" class="h-4 w-4" />
        {{ showBulkImport ? 'Single Member' : 'Bulk Import' }}
      </ModernButton>
    </div>

    <form @submit.prevent="handleSubmit">
      <!-- Bulk Import Mode -->
      <div v-if="showBulkImport && currentStep === 0" class="space-y-6 py-4">
        <ModernAlert variant="info">
          <template #icon>
            <q-icon name="upload" />
          </template>
          Import multiple members at once from a CSV or Excel file. All members will receive email notifications with an option to request removal.
        </ModernAlert>

        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium mb-2 block">Select File</label>
            <input
              ref="fileInputRef"
              type="file"
              accept=".csv,.xlsx"
              @change="handleFileSelect"
              class="hidden"
            />
            <ModernButton
              type="button"
              variant="outline"
              class="w-full justify-start"
              @click="fileInputRef?.click()"
            >
              <q-icon name="upload" class="h-4 w-4 mr-2" />
              {{ importFile ? importFile.name : 'Choose CSV or Excel file' }}
            </ModernButton>
          </div>

          <ModernButton
            type="button"
            variant="ghost"
            size="sm"
            @click="handleDownloadTemplate"
            class="w-full"
          >
            <q-icon name="download" class="h-4 w-4 mr-2" />
            Download Import Template
          </ModernButton>
        </div>

        <div class="p-4 bg-muted rounded-lg space-y-2">
          <h4 class="text-sm font-medium">Template includes:</h4>
          <ul class="text-sm text-muted-foreground space-y-1">
            <li>✓ Personal information (name, gender, DOB, marital status)</li>
            <li>✓ Contact details (email, phone, address)</li>
            <li>✓ Membership information (number, status, join date)</li>
            <li>✓ Additional notes</li>
          </ul>
        </div>
      </div>

      <!-- Single Member Mode -->
      <div v-else class="py-4">
        <!-- Step 0: Personal Information -->
        <div v-if="currentStep === 0" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">
                First Name <span class="text-destructive">*</span>
              </label>
              <ModernInput
                v-model="formData.firstName"
                placeholder="John"
                required
              />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">
                Last Name <span class="text-destructive">*</span>
              </label>
              <ModernInput
                v-model="formData.lastName"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Gender</label>
              <ModernSelect
                v-model="formData.gender"
                :options="genderOptions"
                placeholder="Select gender"
              />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">Date of Birth</label>
              <ModernInput
                v-model="formData.dateOfBirth"
                type="date"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">Marital Status</label>
            <ModernSelect
              v-model="formData.maritalStatus"
              :options="maritalStatusOptions"
              placeholder="Select marital status"
            />
          </div>
        </div>

        <!-- Step 1: Contact Information -->
        <div v-if="currentStep === 1" class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium flex items-center gap-2">
              <q-icon name="mail" class="h-4 w-4" />
              Email
            </label>
            <ModernInput
              v-model="formData.contact.email"
              type="email"
              placeholder="john.doe@email.com"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium flex items-center gap-2">
              <q-icon name="phone" class="h-4 w-4" />
              Phone <span class="text-destructive">*</span>
            </label>
            <ModernInput
              v-model="formData.contact.phone"
              type="tel"
              placeholder="+234 800 000 0000"
              required
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">Street Address</label>
            <ModernInput
              v-model="formData.contact.address.street"
              placeholder="123 Main Street"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">City</label>
              <ModernInput
                v-model="formData.contact.address.city"
                placeholder="Lagos"
              />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">State</label>
              <ModernInput
                v-model="formData.contact.address.state"
                placeholder="Lagos State"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Postal Code</label>
              <ModernInput
                v-model="formData.contact.address.postalCode"
                placeholder="100001"
              />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">Country</label>
              <ModernInput
                v-model="formData.contact.address.country"
                placeholder="Nigeria"
              />
            </div>
          </div>
        </div>

        <!-- Step 2: Membership -->
        <div v-if="currentStep === 2" class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">Status</label>
            <ModernSelect
              v-model="formData.status"
              :options="statusOptions"
              placeholder="Select status"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">Notes</label>
            <q-input
              v-model="formData.notes"
              type="textarea"
              rows="4"
              placeholder="Additional notes about this member..."
              outlined
              class="modern-textarea"
            />
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <ModernButton
          v-if="currentStep > 0"
          type="button"
          variant="outline"
          @click="handleBack"
          class="gap-2"
        >
          <q-icon name="chevron_left" class="h-4 w-4" />
          Back
        </ModernButton>
        <div v-else />

        <div class="flex items-center gap-2">
          <ModernButton
            type="button"
            variant="outline"
            @click="handleClose"
          >
            Cancel
          </ModernButton>
          <ModernButton
            v-if="currentStep < steps.length - 1"
            type="button"
            @click="handleNext"
            class="gap-2"
          >
            Next
            <q-icon name="chevron_right" class="h-4 w-4" />
          </ModernButton>
          <ModernButton
            v-else
            type="submit"
            :loading="isSubmitting"
          >
            Add Member
          </ModernButton>
        </div>
      </div>
    </form>
  </ModernDialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useQuasar } from 'quasar'
import ModernDialog from '@/components/ui/ModernDialog.vue'
import ModernButton from '@/components/ui/ModernButton.vue'
import ModernInput from '@/components/ui/ModernInput.vue'
import ModernSelect from '@/components/ui/ModernSelect.vue'
import ModernAlert from '@/components/ui/ModernAlert.vue'
import type { Member } from '@/types/member'

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (member: Partial<Member>) => void
}

const props = defineProps<Props>()
const $q = useQuasar()

const currentStep = ref(0)
const showBulkImport = ref(false)
const importFile = ref<File | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const isSubmitting = ref(false)

const steps = [
  { id: 0, label: 'Personal Info', icon: 'person' },
  { id: 1, label: 'Contact', icon: 'mail' },
  { id: 2, label: 'Membership', icon: 'people' },
]

const formData = reactive<Partial<Member>>({
  firstName: '',
  lastName: '',
  gender: 'male',
  dateOfBirth: '',
  maritalStatus: 'single',
  contact: {
    phone: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Nigeria',
    },
  },
  status: 'active',
  notes: '',
})

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
]

const maritalStatusOptions = [
  { label: 'Single', value: 'single' },
  { label: 'Married', value: 'married' },
  { label: 'Divorced', value: 'divorced' },
  { label: 'Widowed', value: 'widowed' },
]

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Visitor', value: 'visitor' },
  { label: 'Alumni', value: 'alumni' },
]

const setCurrentStep = (step: number) => {
  currentStep.value = step
}

const handleNext = () => {
  if (currentStep.value === 0) {
    if (!formData.firstName || !formData.lastName) {
      $q.notify({
        type: 'negative',
        message: 'Please enter first and last name',
      })
      return
    }
  }

  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const handleBack = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const handleSubmit = async () => {
  if (!formData.firstName || !formData.lastName) {
    $q.notify({
      type: 'negative',
      message: 'Please enter first and last name',
    })
    return
  }

  if (!formData.contact?.email && !formData.contact?.phone) {
    $q.notify({
      type: 'negative',
      message: 'Please enter at least an email or phone number',
    })
    return
  }

  isSubmitting.value = true

  const membershipNumber = `MEM-${Date.now().toString().slice(-6)}`

  const newMember: Partial<Member> = {
    ...formData,
    id: `m${Date.now()}`,
    membershipNumber,
    joinDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  props.onSubmit(newMember)

  $q.notify({
    type: 'positive',
    message: `${formData.firstName} ${formData.lastName} added successfully!`,
    caption: '📧 Notification email sent with removal option',
  })

  isSubmitting.value = false
  handleClose()
}

const handleDownloadTemplate = () => {
  const headers = [
    'First Name', 'Last Name', 'Email', 'Phone', 'Gender',
    'Date of Birth', 'Marital Status', 'Status', 'Membership Number',
    'Join Date', 'Street', 'City', 'State', 'Zip Code', 'Country', 'Notes',
  ]

  const sampleRow = [
    'John', 'Doe', 'john.doe@email.com', '+234 800 000 0000', 'male',
    '1990-01-15', 'married', 'active', 'MEM-001234', '2024-01-01',
    '123 Main Street', 'Lagos', 'Lagos State', '100001', 'Nigeria', 'Sample member notes',
  ]

  const csvContent = [
    headers.join(','),
    sampleRow.map((cell) => `"${cell}"`).join(','),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', 'members_import_template.csv')
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  $q.notify({
    type: 'positive',
    message: 'Template downloaded successfully!',
  })
}

const handleFileSelect = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
    $q.notify({
      type: 'negative',
      message: 'Please select a CSV or Excel file',
    })
    return
  }

  importFile.value = file
  $q.notify({
    type: 'positive',
    message: `Selected: ${file.name}`,
  })
}

const handleClose = () => {
  Object.assign(formData, {
    firstName: '',
    lastName: '',
    gender: 'male',
    dateOfBirth: '',
    maritalStatus: 'single',
    contact: {
      phone: '',
      email: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Nigeria',
      },
    },
    status: 'active',
    notes: '',
  })
  currentStep.value = 0
  showBulkImport.value = false
  importFile.value = null
  props.onClose()
}
</script>

<style scoped>
.modern-textarea :deep(.q-field__control) {
  border-radius: var(--radius);
}
</style>

