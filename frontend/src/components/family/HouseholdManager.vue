<template>
  <q-card>
    <q-card-section>
      <div class="text-h6 q-mb-md">
        <q-icon name="home" class="q-mr-sm" />
        Household Management
      </div>

      <!-- Create Household Button -->
      <div class="q-mb-md">
        <q-btn
          color="primary"
          icon="add"
          label="Create Household"
          @click="showCreateDialog = true"
        />
      </div>

      <!-- Households List -->
      <q-list v-if="households.length > 0" bordered separator>
        <q-item
          v-for="household in households"
          :key="household.id"
          clickable
          v-ripple
          @click="selectHousehold(household)"
        >
          <q-item-section>
            <q-item-label>{{ household.name }}</q-item-label>
            <q-item-label caption>
              {{ household.household_type }}
              <span v-if="household.address"> • {{ household.address }}</span>
              <span v-if="household.member_count !== undefined"> • {{ household.member_count }} member(s)</span>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              flat
              round
              icon="edit"
              @click.stop="editHousehold(household)"
            />
            <q-btn
              flat
              round
              icon="delete"
              color="negative"
              @click.stop="deleteHousehold(household)"
            />
          </q-item-section>
        </q-item>
      </q-list>

      <q-banner v-else class="bg-grey-3">
        <div class="text-body2">No households found. Create one to get started.</div>
      </q-banner>

      <!-- Household Detail Dialog -->
      <q-dialog v-model="showHouseholdDialog" @hide="resetForm">
        <q-card style="min-width: 600px; max-width: 800px">
          <q-card-section>
            <div class="text-h6">{{ selectedHousehold ? 'Edit Household' : 'Create Household' }}</div>
          </q-card-section>

          <q-card-section>
            <q-input
              v-model="householdForm.name"
              filled
              label="Household Name *"
              :rules="[val => !!val || 'Name is required']"
            />
            <q-input
              v-model="householdForm.description"
              filled
              type="textarea"
              label="Description"
              class="q-mt-md"
              rows="2"
            />
            
            <div class="row q-gutter-md q-mt-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="householdForm.address"
                  filled
                  label="Address"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="householdForm.city"
                  filled
                  label="City"
                />
              </div>
            </div>

            <div class="row q-gutter-md q-mt-md">
              <div class="col-12 col-md-4">
                <q-select
                  v-model="householdForm.household_type"
                  :options="householdTypeOptions"
                  option-label="label"
                  option-value="value"
                  emit-value
                  map-options
                  filled
                  label="Household Type"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="householdForm.home_phone"
                  filled
                  label="Home Phone"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="householdForm.email"
                  filled
                  type="email"
                  label="Email"
                />
              </div>
            </div>

            <q-input
              v-model="householdForm.notes"
              filled
              type="textarea"
              label="Notes"
              class="q-mt-md"
              rows="3"
            />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn
              flat
              label="Save"
              color="primary"
              @click="saveHousehold"
              :loading="householdsStore.saving"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useHouseholdsStore } from '@/stores/households'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const householdsStore = useHouseholdsStore()

const households = computed(() => householdsStore.households)
const showCreateDialog = ref(false)
const showHouseholdDialog = ref(false)
const selectedHousehold = ref<any>(null)

const householdForm = ref({
  name: '',
  description: '',
  address: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
  household_type: 'primary',
  home_phone: '',
  email: '',
  notes: ''
})

const householdTypeOptions = [
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Temporary', value: 'temporary' }
]

const selectHousehold = async (household: any) => {
  selectedHousehold.value = household
  await householdsStore.fetchHousehold(household.id)
  // Emit event or navigate to household detail
}

const editHousehold = (household: any) => {
  selectedHousehold.value = household
  householdForm.value = {
    name: household.name,
    description: household.description || '',
    address: household.address || '',
    city: household.city || '',
    state: household.state || '',
    postal_code: household.postal_code || '',
    country: household.country || '',
    household_type: household.household_type,
    home_phone: household.home_phone || '',
    email: household.email || '',
    notes: household.notes || ''
  }
  showHouseholdDialog.value = true
}

const deleteHousehold = async (household: any) => {
  $q.dialog({
    title: 'Confirm Delete',
    message: `Are you sure you want to delete "${household.name}"?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await householdsStore.deleteHousehold(household.id)
      $q.notify({
        type: 'positive',
        message: 'Household deleted successfully'
      })
    } catch (error: any) {
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'Failed to delete household'
      })
    }
  })
}

const saveHousehold = async () => {
  try {
    if (selectedHousehold.value) {
      await householdsStore.updateHousehold(selectedHousehold.value.id, householdForm.value)
    } else {
      await householdsStore.createHousehold(householdForm.value)
    }
    
    $q.notify({
      type: 'positive',
      message: selectedHousehold.value ? 'Household updated successfully' : 'Household created successfully'
    })
    
    showHouseholdDialog.value = false
    showCreateDialog.value = false
    resetForm()
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to save household'
    })
  }
}

const resetForm = () => {
  householdForm.value = {
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    household_type: 'primary',
    home_phone: '',
    email: '',
    notes: ''
  }
  selectedHousehold.value = null
}

// Watch for create dialog
watch(showCreateDialog, (val) => {
  if (val) {
    resetForm()
    showHouseholdDialog.value = true
  }
})

onMounted(async () => {
  try {
    await householdsStore.fetchHouseholds()
  } catch (error) {
    console.error('Failed to load households:', error)
  }
})
</script>

<style scoped lang="sass">
</style>

