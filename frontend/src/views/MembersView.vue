<template>
  <div class="members-view">
    <!-- Page Header -->
    <div class="q-pa-md bg-white shadow-1">
      <div class="row items-center">
        <div class="col">
          <div class="text-h4 text-weight-medium">Members</div>
          <div class="text-subtitle2 text-grey-6">
            Manage your church members and families
          </div>
        </div>
        <div class="col-auto">
          <q-btn
            color="primary"
            icon="add"
            label="Add Member"
            @click="showAddMemberDialog = true"
            unelevated
          />
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="q-pa-md">
      <div class="row q-gutter-md">
        <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12">
          <q-card flat bordered>
            <q-card-section>
              <div class="row items-center">
                <div class="col">
                  <div class="text-h4 text-weight-bold text-primary">
                    {{ totalMembers }}
                  </div>
                  <div class="text-subtitle2 text-grey-6">Total Members</div>
                </div>
                <div class="col-auto">
                  <q-icon name="people" size="40px" color="primary" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12">
          <q-card flat bordered>
            <q-card-section>
              <div class="row items-center">
                <div class="col">
                  <div class="text-h4 text-weight-bold text-positive">
                    {{ activeMembers }}
                  </div>
                  <div class="text-subtitle2 text-grey-6">Active Members</div>
                </div>
                <div class="col-auto">
                  <q-icon name="person" size="40px" color="positive" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12">
          <q-card flat bordered>
            <q-card-section>
              <div class="row items-center">
                <div class="col">
                  <div class="text-h4 text-weight-bold text-info">
                    {{ totalFamilies }}
                  </div>
                  <div class="text-subtitle2 text-grey-6">Families</div>
                </div>
                <div class="col-auto">
                  <q-icon name="family_restroom" size="40px" color="info" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12">
          <q-card flat bordered>
            <q-card-section>
              <div class="row items-center">
                <div class="col">
                  <div class="text-h4 text-weight-bold text-secondary">
                    {{ newMembersThisMonth }}
                  </div>
                  <div class="text-subtitle2 text-grey-6">New This Month</div>
                </div>
                <div class="col-auto">
                  <q-icon name="person_add" size="40px" color="secondary" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Member List Component -->
    <MemberList />

    <!-- Add Member Dialog -->
    <q-dialog v-model="showAddMemberDialog" persistent>
      <MemberForm
        @save="onMemberSave"
        @cancel="showAddMemberDialog = false"
      />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMembersStore } from '@/stores/members'
import { useFamiliesStore } from '@/stores/families'
import { useQuasar } from 'quasar'
import MemberList from '@/components/members/MemberList.vue'
import MemberForm from '@/components/members/MemberForm.vue'
import type { Member } from '@/types/member'

// Store and utilities
const membersStore = useMembersStore()
const familiesStore = useFamiliesStore()
const $q = useQuasar()

// Reactive data
const showAddMemberDialog = ref(false)

// Computed properties
const totalMembers = computed(() => membersStore.pagination.total || 0)
const activeMembers = computed(() => membersStore.activeMembersCount)
const totalFamilies = computed(() => familiesStore.pagination.total || 0)

const newMembersThisMonth = computed(() => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  return membersStore.members.filter(member => {
    const joinDate = new Date(member.join_date)
    return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear
  }).length
})

// Methods
const onMemberSave = async (memberData: Partial<Member>) => {
  try {
    await membersStore.createMember(memberData)
    $q.notify({
      type: 'positive',
      message: 'Member created successfully'
    })
    
    showAddMemberDialog.value = false
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Failed to create member'
    })
  }
}

const loadInitialData = async () => {
  try {
    // Load members and families in parallel
    await Promise.all([
      membersStore.fetchMembers(),
      familiesStore.fetchFamilies()
    ])
  } catch (error) {
    console.error('Failed to load initial data:', error)
  }
}

// Lifecycle
onMounted(() => {
  loadInitialData()
})
</script>

<style scoped>
.members-view {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>
