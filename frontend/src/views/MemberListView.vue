<template>
  <q-page class="member-list-page">
    <div class="q-pa-md">
      <!-- Header -->
      <div class="row items-center justify-between q-mb-md">
        <div>
          <h1 class="text-h4 q-ma-none">Members</h1>
          <p class="text-body2 text-grey-6 q-ma-none">
            Manage your church members and their information
          </p>
        </div>
        <div class="row q-gutter-sm">
          <q-btn
            color="secondary"
            icon="upload"
            label="Import"
            @click="showImportDialog = true"
            outline
          />
          <q-btn
            color="primary"
            icon="add"
            label="Add Member"
            @click="$router.push('/members/new')"
          />
        </div>
      </div>

      <!-- Search and Filters -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="row q-gutter-md items-end">
            <!-- Search -->
            <div class="col-12 col-md-4">
              <q-input
                v-model="searchQuery"
                label="Search members"
                outlined
                dense
                clearable
                @update:model-value="debouncedSearch"
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>

            <!-- Member Type Filter -->
            <div class="col-12 col-md-2">
              <q-select
                v-model="filters.member_type"
                :options="memberTypeOptions"
                label="Member Type"
                outlined
                dense
                clearable
                emit-value
                map-options
                @update:model-value="applyFilters"
              />
            </div>

            <!-- Active Status Filter -->
            <div class="col-12 col-md-2">
              <q-select
                v-model="filters.active_only"
                :options="activeStatusOptions"
                label="Status"
                outlined
                dense
                emit-value
                map-options
                @update:model-value="applyFilters"
              />
            </div>

            <!-- Actions -->
            <div class="col-12 col-md-4 row justify-end q-gutter-sm">
              <q-btn
                icon="refresh"
                label="Refresh"
                @click="refreshMembers"
                :loading="membersStore.loading"
                outline
              />
              <q-btn
                icon="filter_list"
                label="Advanced"
                @click="showAdvancedFilters = !showAdvancedFilters"
                :color="showAdvancedFilters ? 'primary' : 'grey-7'"
                outline
              />
            </div>
          </div>

          <!-- Advanced Filters -->
          <div v-if="showAdvancedFilters" class="q-mt-md q-pt-md border-top">
            <div class="row q-gutter-md">
              <div class="col-12 col-md-3">
                <q-input
                  v-model="filters.age_min"
                  label="Min Age"
                  type="number"
                  outlined
                  dense
                  @update:model-value="applyFilters"
                />
              </div>
              <div class="col-12 col-md-3">
                <q-input
                  v-model="filters.age_max"
                  label="Max Age"
                  type="number"
                  outlined
                  dense
                  @update:model-value="applyFilters"
                />
              </div>
              <div class="col-12 col-md-3">
                <q-select
                  v-model="filters.gender"
                  :options="genderOptions"
                  label="Gender"
                  outlined
                  dense
                  clearable
                  emit-value
                  map-options
                  @update:model-value="applyFilters"
                />
              </div>
              <div class="col-12 col-md-3">
                <q-btn
                  label="Clear Filters"
                  @click="clearFilters"
                  flat
                  color="negative"
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Members Table -->
      <q-card flat bordered>
        <q-table
          :rows="membersStore.members"
          :columns="columns"
          :loading="membersStore.loading"
          :pagination="pagination"
          @request="onRequest"
          row-key="id"
          selection="multiple"
          v-model:selected="selected"
          binary-state-sort
          flat
          class="member-table"
        >
          <!-- Loading -->
          <template v-slot:loading>
            <q-inner-loading showing color="primary" />
          </template>

          <!-- No Data -->
          <template v-slot:no-data="{ message }">
            <div class="full-width row flex-center text-grey-7 q-gutter-sm">
              <q-icon size="2em" name="people" />
              <span>{{ message || 'No members found' }}</span>
            </div>
          </template>

          <!-- Name Column -->
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <div class="row items-center q-gutter-sm">
                <q-avatar size="32px" color="primary" text-color="white">
                  {{ getInitials(props.row.first_name, props.row.last_name) }}
                </q-avatar>
                <div>
                  <div class="text-weight-medium">
                    {{ props.row.first_name }} {{ props.row.last_name }}
                  </div>
                  <div class="text-caption text-grey-6">
                    {{ props.row.email || 'No email' }}
                  </div>
                </div>
              </div>
            </q-td>
          </template>

          <!-- Member Type Column -->
          <template v-slot:body-cell-member_type="props">
            <q-td :props="props">
              <q-chip
                :color="getMemberTypeColor(props.row.member_type)"
                text-color="white"
                size="sm"
              >
                {{ getMemberTypeLabel(props.row.member_type) }}
              </q-chip>
            </q-td>
          </template>

          <!-- Status Column -->
          <template v-slot:body-cell-is_active="props">
            <q-td :props="props">
              <q-chip
                :color="props.row.is_active ? 'positive' : 'negative'"
                text-color="white"
                size="sm"
              >
                {{ props.row.is_active ? 'Active' : 'Inactive' }}
              </q-chip>
            </q-td>
          </template>

          <!-- Actions Column -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <div class="row q-gutter-xs">
                <q-btn
                  icon="visibility"
                  size="sm"
                  flat
                  round
                  color="primary"
                  @click="viewMember(props.row)"
                >
                  <q-tooltip>View Details</q-tooltip>
                </q-btn>
                <q-btn
                  icon="edit"
                  size="sm"
                  flat
                  round
                  color="primary"
                  @click="editMember(props.row)"
                >
                  <q-tooltip>Edit</q-tooltip>
                </q-btn>
                <q-btn
                  icon="more_vert"
                  size="sm"
                  flat
                  round
                  color="grey-7"
                >
                  <q-tooltip>More Actions</q-tooltip>
                  <q-menu>
                    <q-list dense>
                      <q-item clickable @click="toggleMemberStatus(props.row)">
                        <q-item-section>
                          {{ props.row.is_active ? 'Deactivate' : 'Activate' }}
                        </q-item-section>
                      </q-item>
                      <q-item clickable @click="deleteMember(props.row)" class="text-negative">
                        <q-item-section>Delete</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </q-td>
          </template>

          <!-- Top Selection -->
          <template v-slot:top-selection>
            <div class="row items-center q-gutter-sm">
              <div class="text-body2">
                {{ selected.length }} member(s) selected
              </div>
              <q-btn
                color="negative"
                icon="delete"
                label="Delete Selected"
                @click="deleteSelected"
                :disable="selected.length === 0"
                outline
                size="sm"
              />
            </div>
          </template>
        </q-table>
      </q-card>
    </div>

    <!-- Import Dialog -->
    <q-dialog v-model="showImportDialog">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Import Members</div>
        </q-card-section>
        <q-card-section>
          <p>Upload a CSV file to import multiple members at once.</p>

          <!-- Download Template Button -->
          <div class="q-mb-md">
            <q-btn
              color="secondary"
              icon="download"
              label="Download Template"
              @click="downloadTemplate"
              outline
              size="sm"
            />
            <div class="text-caption text-grey-6 q-mt-xs">
              Download a CSV template with the correct format and example data
            </div>
          </div>

          <!-- File Upload -->
          <q-file
            v-model="selectedFile"
            label="Select CSV file"
            accept=".csv,.txt"
            outlined
            clearable
            :loading="isImporting"
            :disable="isImporting"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>

          <!-- Import Instructions -->
          <div class="q-mt-md">
            <q-expansion-item
              icon="help"
              label="Import Instructions"
              header-class="text-primary"
            >
              <div class="q-pa-md">
                <p><strong>Required columns:</strong></p>
                <ul>
                  <li>first_name</li>
                  <li>last_name</li>
                  <li>email</li>
                </ul>
                <p><strong>Optional columns:</strong></p>
                <ul>
                  <li>phone, date_of_birth, gender, address, city, state, postal_code, country</li>
                  <li>member_type (member, visitor, inactive)</li>
                  <li>membership_status (active, inactive, pending)</li>
                  <li>joined_date</li>
                </ul>
                <p><strong>Notes:</strong></p>
                <ul>
                  <li>Duplicate emails will be skipped</li>
                  <li>Maximum file size: 10MB</li>
                  <li>Supported formats: CSV, TXT</li>
                </ul>
              </div>
            </q-expansion-item>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            @click="showImportDialog = false"
            :disable="isImporting"
          />
          <q-btn
            color="primary"
            label="Import"
            @click="importMembers"
            :loading="isImporting"
            :disable="!selectedFile || isImporting"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useMembersStore } from '@/stores/members'
import { debounce } from 'quasar'

// Composables
const router = useRouter()
const $q = useQuasar()
const membersStore = useMembersStore()

// Local state
const searchQuery = ref('')
const selected = ref([])
const showAdvancedFilters = ref(false)
const showImportDialog = ref(false)
const selectedFile = ref(null)
const isImporting = ref(false)

const filters = ref({
  member_type: null as string | null,
  active_only: true,
  gender: null as string | null,
  age_min: null as number | null,
  age_max: null as number | null
})

const pagination = ref({
  sortBy: 'first_name',
  descending: false,
  page: 1,
  rowsPerPage: 15,
  rowsNumber: 0
})

// Options
const memberTypeOptions = computed(() => [
  { label: 'All Types', value: null },
  ...Object.entries(membersStore.memberTypes).map(([key, label]) => ({
    label,
    value: key
  }))
])

const activeStatusOptions = [
  { label: 'Active Only', value: true },
  { label: 'All Members', value: null },
  { label: 'Inactive Only', value: false }
]

const genderOptions = computed(() => [
  { label: 'All Genders', value: null },
  ...Object.entries(membersStore.genders).map(([key, label]) => ({
    label,
    value: key
  }))
])

// Table columns
const columns = [
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left' as const,
    field: 'first_name',
    sortable: true
  },
  {
    name: 'member_type',
    label: 'Type',
    align: 'left' as const,
    field: 'member_type',
    sortable: true
  },
  {
    name: 'phone',
    label: 'Phone',
    align: 'left' as const,
    field: 'phone',
    sortable: true
  },
  {
    name: 'joined_date',
    label: 'Joined',
    align: 'left' as const,
    field: 'joined_date',
    sortable: true,
    format: (val: string) => val ? new Date(val).toLocaleDateString() : '-'
  },
  {
    name: 'is_active',
    label: 'Status',
    align: 'center' as const,
    field: 'is_active',
    sortable: true
  },
  {
    name: 'actions',
    label: 'Actions',
    align: 'center' as const,
    field: 'actions',
    sortable: false
  }
]

// Methods
const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
}

const getMemberTypeColor = (type: string) => {
  const colors = {
    member: 'primary',
    visitor: 'secondary',
    child: 'accent'
  }
  return colors[type as keyof typeof colors] || 'grey'
}

const getMemberTypeLabel = (type: string) => {
  return membersStore.memberTypes[type] || type
}

const debouncedSearch = debounce(() => {
  applyFilters()
}, 500)

const applyFilters = async () => {
  pagination.value.page = 1
  await fetchMembers()
}

const clearFilters = () => {
  filters.value = {
    member_type: null,
    active_only: true,
    gender: null,
    age_min: null,
    age_max: null
  }
  searchQuery.value = ''
  applyFilters()
}

const fetchMembers = async () => {
  try {
    const params = {
      page: pagination.value.page,
      per_page: pagination.value.rowsPerPage,
      search: searchQuery.value,
      ...filters.value
    }

    const response = await membersStore.fetchMembers(params)
    pagination.value.rowsNumber = response.total || 0
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to load members'
    })
  }
}

const onRequest = (props: any) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  
  pagination.value.page = page
  pagination.value.rowsPerPage = rowsPerPage
  pagination.value.sortBy = sortBy
  pagination.value.descending = descending
  
  fetchMembers()
}

const refreshMembers = () => {
  fetchMembers()
}

const viewMember = (member: any) => {
  router.push(`/members/${member.id}`)
}

const editMember = (member: any) => {
  router.push(`/members/${member.id}/edit`)
}

const toggleMemberStatus = async (member: any) => {
  try {
    await membersStore.updateMember(member.id, {
      is_active: !member.is_active
    })
    
    $q.notify({
      type: 'positive',
      message: `Member ${member.is_active ? 'deactivated' : 'activated'} successfully`
    })
    
    await fetchMembers()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to update member status'
    })
  }
}

const deleteMember = (member: any) => {
  $q.dialog({
    title: 'Confirm Delete',
    message: `Are you sure you want to delete ${member.first_name} ${member.last_name}?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await membersStore.deleteMember(member.id)
      $q.notify({
        type: 'positive',
        message: 'Member deleted successfully'
      })
      await fetchMembers()
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Failed to delete member'
      })
    }
  })
}

const deleteSelected = () => {
  $q.dialog({
    title: 'Confirm Delete',
    message: `Are you sure you want to delete ${selected.value.length} member(s)?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      const deletePromises = selected.value.map((member: any) => 
        membersStore.deleteMember(member.id)
      )
      
      await Promise.all(deletePromises)
      
      $q.notify({
        type: 'positive',
        message: `${selected.value.length} member(s) deleted successfully`
      })
      
      selected.value = []
      await fetchMembers()
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Failed to delete selected members'
      })
    }
  })
}

const importMembers = async () => {
  if (!selectedFile.value) {
    $q.notify({
      type: 'negative',
      message: 'Please select a CSV file to import'
    })
    return
  }

  const formData = new FormData()
  formData.append('file', selectedFile.value)

  try {
    isImporting.value = true

    const response = await api.post('/members/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    const result = response.data.data

    $q.notify({
      type: 'positive',
      message: `Import completed! ${result.imported} members imported, ${result.skipped} skipped.`,
      timeout: 5000
    })

    // Show detailed results if there were errors
    if (result.errors.length > 0) {
      $q.dialog({
        title: 'Import Results',
        message: `
          <div>
            <p><strong>Imported:</strong> ${result.imported} members</p>
            <p><strong>Skipped:</strong> ${result.skipped} members</p>
            <p><strong>Errors:</strong></p>
            <ul>
              ${result.errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
          </div>
        `,
        html: true,
        ok: 'Close'
      })
    }

    // Refresh the members list
    await fetchMembers()

    // Reset form
    selectedFile.value = null
    showImportDialog.value = false

  } catch (error) {
    console.error('Import error:', error)

    let errorMessage = 'Failed to import members'
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    }

    $q.notify({
      type: 'negative',
      message: errorMessage,
      timeout: 5000
    })
  } finally {
    isImporting.value = false
  }
}

const downloadTemplate = async () => {
  try {
    const response = await api.get('/members/import/template', {
      responseType: 'blob'
    })

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'member_import_template.csv')
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    $q.notify({
      type: 'positive',
      message: 'Template downloaded successfully'
    })
  } catch (error) {
    console.error('Download error:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to download template'
    })
  }
}

// Lifecycle
onMounted(() => {
  fetchMembers()
})
</script>

<style scoped>
.member-table {
  .q-table__top {
    padding: 12px 16px;
  }
}

.border-top {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
