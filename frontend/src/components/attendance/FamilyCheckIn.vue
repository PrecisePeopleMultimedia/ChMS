<template>
  <q-card>
    <q-card-section>
      <div class="text-h6 q-mb-md">
        <q-icon name="group" class="q-mr-sm" />
        Family Check-In
      </div>

      <!-- Service Selection Warning -->
      <q-banner v-if="!serviceId" class="bg-warning text-white q-mb-md">
        Please select a service before checking in a family
      </q-banner>

      <!-- Family Search -->
      <div v-else>
        <q-input
          v-model="familySearchQuery"
          filled
          label="Search for family"
          @update:model-value="onFamilySearch"
          debounce="300"
          :loading="searchingFamilies"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <!-- Family Results -->
        <div v-if="familyResults.length > 0" class="q-mt-md">
          <q-list bordered separator>
            <q-item
              v-for="family in familyResults"
              :key="family.id"
              clickable
              v-ripple
            >
              <q-item-section>
                <q-item-label>{{ family.family_name }}</q-item-label>
                <q-item-label caption>
                  {{ family.members?.length || 0 }} member(s)
                  <span v-if="family.address"> • {{ family.address }}</span>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  flat
                  round
                  icon="check_circle"
                  color="primary"
                  @click="showFamilyDetails(family)"
                  :loading="checkingInFamilyId === family.id"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- Family Details Dialog -->
        <q-dialog v-model="showFamilyDialog">
          <q-card style="min-width: 500px">
            <q-card-section>
              <div class="text-h6">Check In Family: {{ selectedFamily?.family_name }}</div>
            </q-card-section>

            <q-card-section v-if="selectedFamily">
              <!-- Family Members List -->
              <div class="text-subtitle2 q-mb-sm">Select members to check in:</div>
              <q-list bordered separator>
                <q-item
                  v-for="member in familyMembers"
                  :key="member.id"
                >
                  <q-item-section avatar>
                    <q-checkbox
                      v-model="selectedMemberIds"
                      :val="member.id"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ member.first_name }} {{ member.last_name }}
                      <q-badge
                        v-if="member.age && member.age < 18"
                        color="orange"
                        label="Child"
                        class="q-ml-sm"
                      />
                    </q-item-label>
                    <q-item-label caption>
                      {{ member.member_type }}
                      <span v-if="member.age"> • Age: {{ member.age }}</span>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>

              <!-- Select All / Deselect All -->
              <div class="q-mt-md">
                <q-btn
                  flat
                  size="sm"
                  label="Select All"
                  @click="selectAllMembers"
                />
                <q-btn
                  flat
                  size="sm"
                  label="Deselect All"
                  @click="selectedMemberIds = []"
                  class="q-ml-sm"
                />
              </div>

              <!-- Location Assignment -->
              <q-input
                v-model="locationAssignment"
                filled
                label="Location/Section (Optional)"
                class="q-mt-md"
              />
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancel" color="primary" v-close-popup />
              <q-btn
                flat
                label="Check In Family"
                color="primary"
                @click="checkInFamily"
                :loading="attendanceStore.saving"
                :disable="selectedMemberIds.length === 0"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAttendanceStore } from '@/stores/attendance'
import { useFamiliesStore } from '@/stores/families'
import { useQuasar } from 'quasar'

const props = defineProps<{
  serviceId?: number
}>()

const $q = useQuasar()
const attendanceStore = useAttendanceStore()
const familiesStore = useFamiliesStore()

const familySearchQuery = ref('')
const familyResults = ref<any[]>([])
const searchingFamilies = ref(false)
const selectedFamily = ref<any>(null)
const familyMembers = ref<any[]>([])
const selectedMemberIds = ref<number[]>([])
const checkingInFamilyId = ref<number | null>(null)
const showFamilyDialog = ref(false)
const locationAssignment = ref('')

const onFamilySearch = async (query: string) => {
  if (!query || query.length < 2) {
    familyResults.value = []
    return
  }

  searchingFamilies.value = true
  try {
    const families = await familiesStore.fetchFamilies({ search: query })
    familyResults.value = families.slice(0, 10) // Limit to 10 results
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to search families'
    })
  } finally {
    searchingFamilies.value = false
  }
}

const showFamilyDetails = async (family: any) => {
  selectedFamily.value = family
  showFamilyDialog.value = true

  // Fetch family members
  try {
    const members = await familiesStore.getFamilyMembers(family.id)
    familyMembers.value = members.filter((m: any) => m.is_active)
    selectedMemberIds.value = familyMembers.value.map((m: any) => m.id)
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to load family members'
    })
  }
}

const selectAllMembers = () => {
  selectedMemberIds.value = familyMembers.value.map((m: any) => m.id)
}

const checkInFamily = async () => {
  if (!props.serviceId || !selectedFamily.value) {
    return
  }

  if (selectedMemberIds.value.length === 0) {
    $q.notify({
      type: 'warning',
      message: 'Please select at least one family member'
    })
    return
  }

  checkingInFamilyId.value = selectedFamily.value.id

  try {
    const result = await attendanceStore.familyCheckIn({
      family_id: selectedFamily.value.id,
      service_id: props.serviceId,
      member_ids: selectedMemberIds.value,
      location_assignment: locationAssignment.value || undefined
    })

    $q.notify({
      type: 'positive',
      message: `Successfully checked in ${selectedMemberIds.value.length} family member(s)!`,
      icon: 'check_circle'
    })

    // Reset form
    familySearchQuery.value = ''
    familyResults.value = []
    selectedFamily.value = null
    familyMembers.value = []
    selectedMemberIds.value = []
    locationAssignment.value = ''
    showFamilyDialog.value = false
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to check in family'
    })
  } finally {
    checkingInFamilyId.value = null
  }
}
</script>

<style scoped lang="sass">
</style>

