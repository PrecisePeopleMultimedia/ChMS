<template>
  <q-card>
    <q-card-section>
      <div class="text-h6 q-mb-md">
        <q-icon name="person_add" class="q-mr-sm" />
        Manual Check-In
      </div>

      <!-- Service Selector -->
      <div v-if="!serviceId" class="q-mb-md">
        <q-banner class="bg-info text-white">
          Please select a service first
        </q-banner>
      </div>

      <!-- Member Search -->
      <div v-else>
        <q-input
          v-model="searchQuery"
          filled
          label="Search by name, email, or phone"
          @update:model-value="onSearch"
          debounce="300"
          :loading="searching"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <!-- Search Results -->
        <div v-if="searchResults.length > 0" class="q-mt-md">
          <q-list bordered separator>
            <q-item
              v-for="member in searchResults"
              :key="member.id"
              clickable
              v-ripple
              @click="selectMember(member)"
            >
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">
                  {{ member.first_name.charAt(0).toUpperCase() }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ member.first_name }} {{ member.last_name }}</q-item-label>
                <q-item-label caption v-if="member.phone">{{ member.phone }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  flat
                  round
                  icon="check_circle"
                  color="primary"
                  @click.stop="checkInMember(member)"
                  :loading="checkingInId === member.id"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- No Results -->
        <div v-if="searchQuery && searchResults.length === 0 && !searching" class="q-mt-md">
          <q-banner class="bg-grey-3">
            <div class="text-body2">No members found. Would you like to register as a visitor?</div>
            <template v-slot:action>
              <q-btn
                flat
                label="Register Visitor"
                color="primary"
                @click="showVisitorDialog = true"
              />
            </template>
          </q-banner>
        </div>

        <!-- Visitor Registration Form -->
        <q-dialog v-model="showVisitorDialog">
          <q-card style="min-width: 400px">
            <q-card-section>
              <div class="text-h6">Register Visitor</div>
            </q-card-section>

            <q-card-section>
              <q-input
                v-model="visitorData.visitor_name"
                filled
                label="Full Name *"
                :rules="[val => !!val || 'Name is required']"
              />
              <q-input
                v-model="visitorData.visitor_phone"
                filled
                label="Phone"
                class="q-mt-md"
                mask="###-###-####"
              />
              <q-input
                v-model="visitorData.visitor_email"
                filled
                type="email"
                label="Email"
                class="q-mt-md"
              />
              <q-input
                v-model="visitorData.notes"
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
                label="Check In"
                color="primary"
                @click="checkInVisitor"
                :loading="attendanceStore.saving"
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
import { useMembersStore } from '@/stores/members'
import { useQuasar } from 'quasar'

const props = defineProps<{
  serviceId?: number
}>()

const $q = useQuasar()
const attendanceStore = useAttendanceStore()
const membersStore = useMembersStore()

const searchQuery = ref('')
const searchResults = ref<any[]>([])
const searching = ref(false)
const checkingInId = ref<number | null>(null)
const showVisitorDialog = ref(false)

const visitorData = ref({
  visitor_name: '',
  visitor_phone: '',
  visitor_email: '',
  notes: ''
})

const onSearch = async (query: string) => {
  if (!query || query.length < 2) {
    searchResults.value = []
    return
  }

  searching.value = true
  try {
    const members = await membersStore.fetchMembers({ search: query, active_only: true })
    searchResults.value = members.slice(0, 10) // Limit to 10 results
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to search members'
    })
  } finally {
    searching.value = false
  }
}

const selectMember = (member: any) => {
  checkInMember(member)
}

const checkInMember = async (member: any) => {
  if (!props.serviceId) {
    $q.notify({
      type: 'warning',
      message: 'Please select a service first'
    })
    return
  }

  checkingInId.value = member.id
  try {
    await attendanceStore.checkInMember({
      service_id: props.serviceId,
      member_id: member.id,
      checkin_method: 'manual_search'
    })

    $q.notify({
      type: 'positive',
      message: `${member.first_name} ${member.last_name} checked in successfully!`,
      icon: 'check_circle'
    })

    // Clear search
    searchQuery.value = ''
    searchResults.value = []
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to check in member'
    })
  } finally {
    checkingInId.value = null
  }
}

const checkInVisitor = async () => {
  if (!props.serviceId) {
    $q.notify({
      type: 'warning',
      message: 'Please select a service first'
    })
    return
  }

  if (!visitorData.value.visitor_name) {
    $q.notify({
      type: 'warning',
      message: 'Visitor name is required'
    })
    return
  }

  try {
    await attendanceStore.checkInMember({
      service_id: props.serviceId,
      visitor_name: visitorData.value.visitor_name,
      visitor_phone: visitorData.value.visitor_phone || undefined,
      visitor_email: visitorData.value.visitor_email || undefined,
      notes: visitorData.value.notes || undefined,
      checkin_method: 'visitor_registration'
    })

    $q.notify({
      type: 'positive',
      message: 'Visitor checked in successfully!',
      icon: 'check_circle'
    })

    // Reset form
    visitorData.value = {
      visitor_name: '',
      visitor_phone: '',
      visitor_email: '',
      notes: ''
    }
    showVisitorDialog.value = false
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to check in visitor'
    })
  }
}
</script>

<style scoped lang="sass">
</style>

