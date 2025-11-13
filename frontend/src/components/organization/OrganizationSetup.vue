<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div>
      <h2 class="flex items-center gap-2 text-2xl font-light">
        <q-icon name="church" class="h-6 w-6 text-primary" />
        Organization Setup
      </h2>
      <p class="text-muted-foreground">
        Set up your church organization in a few simple steps
      </p>
    </div>

    <!-- Progress -->
    <div class="space-y-2">
      <div class="flex justify-between text-sm">
        <span class="text-muted-foreground">
          Step {{ currentStep }} of {{ steps.length }}
        </span>
        <span class="font-medium">{{ Math.round(progress) }}% Complete</span>
      </div>
      <div class="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          class="h-full bg-primary transition-all"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>

    <!-- Step Indicators -->
    <div class="flex justify-between">
      <div
        v-for="step in steps"
        :key="step.id"
        :class="[
          'flex flex-col items-center gap-2 flex-1',
          step.id !== steps.length ? 'relative' : ''
        ]"
      >
        <div
          :class="[
            'w-10 h-10 rounded-full flex items-center justify-center transition-all',
            step.id < currentStep ? 'bg-primary text-primary-foreground' : '',
            step.id === currentStep ? 'bg-primary/20 text-primary border-2 border-primary' : '',
            step.id > currentStep ? 'bg-accent text-muted-foreground' : ''
          ]"
        >
          <q-icon
            v-if="step.id < currentStep"
            name="check_circle"
            class="h-5 w-5"
          />
          <q-icon
            v-else
            :name="step.icon"
            class="h-5 w-5"
          />
        </div>
        <span
          :class="[
            'text-xs text-center',
            step.id === currentStep ? 'font-medium' : 'text-muted-foreground'
          ]"
        >
          {{ step.title }}
        </span>

        <div
          v-if="step.id !== steps.length"
          :class="[
            'absolute top-5 left-1/2 w-full h-0.5 -z-10',
            step.id < currentStep ? 'bg-primary' : 'bg-accent'
          ]"
        />
      </div>
    </div>

    <!-- Form Card -->
    <ModernCard>
      <ModernCardHeader>
        <ModernCardTitle>{{ steps[currentStep - 1].title }}</ModernCardTitle>
        <ModernCardDescription>{{ steps[currentStep - 1].description }}</ModernCardDescription>
      </ModernCardHeader>
      <ModernCardContent>
        <OrganizationSetupStep1 v-if="currentStep === 1" v-model="formData" />
        <OrganizationSetupStep2 v-if="currentStep === 2" v-model="formData" />
        <OrganizationSetupStep3 v-if="currentStep === 3" v-model="formData" />
        <OrganizationSetupStep4 v-if="currentStep === 4" v-model="formData" />
      </ModernCardContent>
      <ModernCardFooter class="flex justify-between">
        <ModernButton
          variant="outline"
          @click="handlePrevious"
          :disabled="currentStep === 1"
        >
          <q-icon name="arrow_back" class="h-4 w-4 mr-2" />
          Previous
        </ModernButton>

        <ModernButton
          v-if="currentStep < steps.length"
          @click="handleNext"
        >
          Next
          <q-icon name="arrow_forward" class="h-4 w-4 ml-2" />
        </ModernButton>
        <ModernButton
          v-else
          @click="handleSubmit"
        >
          <q-icon name="check_circle" class="h-4 w-4 mr-2" />
          Complete Setup
        </ModernButton>
      </ModernCardFooter>
    </ModernCard>

    <!-- Help Text -->
    <ModernCard class="bg-accent/50">
      <ModernCardContent class="pt-6">
        <h4 class="font-semibold mb-2">💡 What happens next?</h4>
        <ul class="text-sm text-muted-foreground space-y-1">
          <li>✓ Your organization will be created</li>
          <li>✓ A headquarters branch will be set up automatically</li>
          <li>✓ Default services (Sunday, Midweek) will be created</li>
          <li>✓ You'll receive admin access to manage everything</li>
        </ul>
      </ModernCardContent>
    </ModernCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useOrganizationStore } from '@/stores/organization'
import ModernCard from '@/components/ui/ModernCard.vue'
import ModernCardHeader from '@/components/ui/ModernCardHeader.vue'
import ModernCardTitle from '@/components/ui/ModernCardTitle.vue'
import ModernCardDescription from '@/components/ui/ModernCardDescription.vue'
import ModernCardContent from '@/components/ui/ModernCardContent.vue'
import ModernCardFooter from '@/components/ui/ModernCardFooter.vue'
import ModernButton from '@/components/ui/ModernButton.vue'
import OrganizationSetupStep1 from './OrganizationSetupStep1.vue'
import OrganizationSetupStep2 from './OrganizationSetupStep2.vue'
import OrganizationSetupStep3 from './OrganizationSetupStep3.vue'
import OrganizationSetupStep4 from './OrganizationSetupStep4.vue'

const router = useRouter()
const $q = useQuasar()
const organizationStore = useOrganizationStore()

interface SetupStep {
  id: number
  title: string
  description: string
  icon: string
}

const steps: SetupStep[] = [
  {
    id: 1,
    title: 'Organization Details',
    description: 'Basic information about your church',
    icon: 'church',
  },
  {
    id: 2,
    title: 'Location & Contact',
    description: 'Where is your church located',
    icon: 'place',
  },
  {
    id: 3,
    title: 'Admin Account',
    description: 'Setup your administrator account',
    icon: 'people',
  },
  {
    id: 4,
    title: 'Preferences',
    description: 'Configure your settings',
    icon: 'settings',
  },
]

const currentStep = ref(1)
const formData = ref({
  // Step 1
  orgName: '',
  orgType: '',
  denomination: '',
  // Step 2
  country: '',
  city: '',
  address: '',
  phone: '',
  email: '',
  // Step 3
  adminName: '',
  adminEmail: '',
  adminPhone: '',
  // Step 4
  timezone: '',
  currency: '',
  language: '',
})

const progress = computed(() => (currentStep.value / steps.length) * 100)

const handleNext = () => {
  if (currentStep.value < steps.length) {
    currentStep.value++
  }
}

const handlePrevious = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const handleSubmit = async () => {
  try {
    // Create organization
    await organizationStore.createOrganization({
      name: formData.value.orgName,
      type: formData.value.orgType,
      denomination: formData.value.denomination,
      country: formData.value.country,
      city: formData.value.city,
      address: formData.value.address,
      phone: formData.value.phone,
      email: formData.value.email,
      timezone: formData.value.timezone,
      currency: formData.value.currency,
      language: formData.value.language,
    })

    $q.notify({
      type: 'positive',
      message: 'Organization setup complete!',
    })

    router.push('/dashboard')
  } catch (error) {
    console.error('Setup error:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to complete setup. Please try again.',
    })
  }
}
</script>
