<template>
  <div class="member-list">
    <!-- Search and Filters Header -->
    <div class="q-pa-md">
      <div class="row q-gutter-md items-center">
        <!-- Search Input -->
        <div class="col-md-4 col-sm-6 col-xs-12">
          <q-input
            v-model="searchQuery"
            outlined
            placeholder="Search members..."
            dense
            clearable
            @update:model-value="onSearchChange"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <!-- Member Type Filter -->
        <div class="col-md-2 col-sm-3 col-xs-6">
          <q-select
            v-model="selectedMemberType"
            :options="memberTypeOptions"
            outlined
            dense
            clearable
            label="Type"
            @update:model-value="onFilterChange"
          />
        </div>

        <!-- Active Status Filter -->
        <div class="col-md-2 col-sm-3 col-xs-6">
          <q-select
            v-model="selectedActiveStatus"
            :options="activeStatusOptions"
            outlined
            dense
            clearable
            label="Status"
            @update:model-value="onFilterChange"
          />
        </div>

        <!-- Add Member Button -->
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

    <!-- Loading State -->
    <div v-if="loading" class="q-pa-xl text-center">
      <q-spinner-dots size="50px" color="primary" />
      <div class="q-mt-md text-grey-6">Loading members...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="q-pa-xl text-center">
      <q-icon name="error" size="50px" color="negative" />
      <div class="q-mt-md text-negative">{{ error }}</div>
      <q-btn
        flat
        color="primary"
        label="Retry"
        @click="fetchMembers"
        class="q-mt-md"
      />
    </div>

    <!-- Members Grid -->
    <div v-else-if="members.length > 0" class="q-pa-md">
      <div class="row q-gutter-md">
        <div
          v-for="member in members"
          :key="member.id"
          class="col-xl-3 col-lg-4 col-md-6 col-sm-12"
        >
          <MemberCard
            :member="member"
            @edit="editMember"
            @delete="deleteMember"
            @view="viewMember"
          />
        </div>
      </div>

      <!-- Pagination -->
      <div class="q-pa-md flex flex-center" v-if="pagination.last_page > 1">
        <q-pagination
          v-model="currentPage"
          :max="pagination.last_page"
          :max-pages="6"
          boundary-numbers
          @update:model-value="onPageChange"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="q-pa-xl text-center">
      <q-icon name="people" size="80px" color="grey-4" />
      <div class="q-mt-md text-h6 text-grey-6">No members found</div>
      <div class="text-grey-5 q-mb-md">
        {{ searchQuery ? 'Try adjusting your search criteria' : 'Start by adding your first member' }}
      </div>
      <q-btn
        color="primary"
        icon="add"
        label="Add First Member"
        @click="showAddMemberDialog = true"
        unelevated
      />
    </div>

    <!-- Add/Edit Member Dialog -->
    <q-dialog v-model="showAddMemberDialog" persistent>
      <MemberForm
        :member="selectedMember"
        @save="onMemberSave"
        @cancel="onMemberCancel"
      />
    </q-dialog>

    <!-- Member Details Dialog -->
    <q-dialog v-model="showMemberDetails" maximized>
      <MemberDetails
        :member="selectedMember"
        @edit="editMember"
        @close="showMemberDetails = false"
      />
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="negative" text-color="white" />
          <span class="q-ml-sm">Are you sure you want to delete this member?</span>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-grey-7">
            This action cannot be undone. The member will be moved to inactive status.
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" @click="showDeleteDialog = false" />
          <q-btn
            flat
            label="Delete"
            color="negative"
            @click="confirmDelete"
            :loading="deleting"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useMembersStore } from '@/stores/members'
import { useQuasar } from 'quasar'
import MemberCard from './MemberCard.vue'
import MemberForm from './MemberForm.vue'
import MemberDetails from './MemberDetails.vue'
import type { Member } from '@/types/member'

// Store and utilities
const membersStore = useMembersStore()
const $q = useQuasar()

// Reactive data
const searchQuery = ref('')
const selectedMemberType = ref(null)
const selectedActiveStatus = ref(null)
const currentPage = ref(1)
const showAddMemberDialog = ref(false)
const showMemberDetails = ref(false)
const showDeleteDialog = ref(false)
const selectedMember = ref<Member | null>(null)
const deleting = ref(false)

// Filter options
const memberTypeOptions = [
  { label: 'Adult', value: 'adult' },
  { label: 'Child', value: 'child' },
  { label: 'Youth', value: 'youth' },
  { label: 'Visitor', value: 'visitor' }
]

const activeStatusOptions = [
  { label: 'Active', value: true },
  { label: 'Inactive', value: false }
]

// Computed properties
const members = computed(() => membersStore.members)
const loading = computed(() => membersStore.loading)
const error = computed(() => membersStore.error)
const pagination = computed(() => membersStore.pagination)

// Search debounce
let searchTimeout: NodeJS.Timeout

const onSearchChange = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchMembers()
  }, 500)
}

const onFilterChange = () => {
  currentPage.value = 1
  fetchMembers()
}

const onPageChange = (page: number) => {
  currentPage.value = page
  fetchMembers()
}

// Methods
const fetchMembers = async () => {
  const filters = {
    search: searchQuery.value,
    member_type: selectedMemberType.value,
    is_active: selectedActiveStatus.value,
    page: currentPage.value
  }
  
  await membersStore.fetchMembers(filters)
}

const editMember = (member: Member) => {
  selectedMember.value = member
  showAddMemberDialog.value = true
}

const viewMember = (member: Member) => {
  selectedMember.value = member
  showMemberDetails.value = true
}

const deleteMember = (member: Member) => {
  selectedMember.value = member
  showDeleteDialog.value = true
}

const onMemberSave = async (memberData: Partial<Member>) => {
  try {
    if (selectedMember.value?.id) {
      await membersStore.updateMember(selectedMember.value.id, memberData)
      $q.notify({
        type: 'positive',
        message: 'Member updated successfully'
      })
    } else {
      await membersStore.createMember(memberData)
      $q.notify({
        type: 'positive',
        message: 'Member created successfully'
      })
    }
    
    showAddMemberDialog.value = false
    selectedMember.value = null
    await fetchMembers()
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Failed to save member'
    })
  }
}

const onMemberCancel = () => {
  showAddMemberDialog.value = false
  selectedMember.value = null
}

const confirmDelete = async () => {
  if (!selectedMember.value) return
  
  deleting.value = true
  try {
    await membersStore.deleteMember(selectedMember.value.id)
    $q.notify({
      type: 'positive',
      message: 'Member deleted successfully'
    })
    
    showDeleteDialog.value = false
    selectedMember.value = null
    await fetchMembers()
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Failed to delete member'
    })
  } finally {
    deleting.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchMembers()
})
</script>

<style scoped>
.member-list {
  min-height: 100vh;
}
</style>
