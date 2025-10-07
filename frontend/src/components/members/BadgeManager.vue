<template>
  <q-page class="badge-manager-page">
    <div class="q-pa-md">
      <!-- Header -->
      <div class="row items-center justify-between q-mb-md">
        <div>
          <h1 class="text-h4 q-ma-none">Badge Types</h1>
          <p class="text-body2 text-grey-6 q-ma-none">
            Manage visual badges for member identification
          </p>
        </div>
        <div class="row q-gutter-sm">
          <q-btn
            color="secondary"
            icon="auto_fix_high"
            label="Create Defaults"
            @click="createDefaults"
            :loading="creatingDefaults"
            outline
          />
          <q-btn
            color="primary"
            icon="add"
            label="Add Badge Type"
            @click="showCreateDialog = true"
            :loading="loading"
          />
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="row q-gutter-md q-mb-md">
        <q-card flat bordered class="col-12 col-sm-6 col-md-3">
          <q-card-section class="text-center">
            <div class="text-h4 text-primary">{{ statistics.total_badge_types || 0 }}</div>
            <div class="text-body2 text-grey-6">Badge Types</div>
          </q-card-section>
        </q-card>
        
        <q-card flat bordered class="col-12 col-sm-6 col-md-3">
          <q-card-section class="text-center">
            <div class="text-h4 text-positive">{{ statistics.active_assignments || 0 }}</div>
            <div class="text-body2 text-grey-6">Active Assignments</div>
          </q-card-section>
        </q-card>
        
        <q-card flat bordered class="col-12 col-sm-6 col-md-3">
          <q-card-section class="text-center">
            <div class="text-h4 text-warning">{{ expiringBadges.length || 0 }}</div>
            <div class="text-body2 text-grey-6">Expiring Soon</div>
          </q-card-section>
        </q-card>
        
        <q-card flat bordered class="col-12 col-sm-6 col-md-3">
          <q-card-section class="text-center">
            <div class="text-h4 text-info">{{ statistics.total_assignments || 0 }}</div>
            <div class="text-body2 text-grey-6">Total Assignments</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Filters -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section class="q-py-sm">
          <div class="row q-gutter-md items-center">
            <q-input
              v-model="searchQuery"
              placeholder="Search badge types..."
              outlined
              dense
              clearable
              style="min-width: 200px"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>

            <q-toggle
              v-model="showActiveOnly"
              label="Active only"
              color="primary"
            />
          </div>
        </q-card-section>
      </q-card>

      <!-- Badge Types Grid -->
      <div class="row q-gutter-md">
        <q-card
          v-for="badgeType in filteredBadgeTypes"
          :key="badgeType.id"
          flat
          bordered
          class="col-12 col-sm-6 col-md-4 col-lg-3 badge-type-card"
          :class="{ 'inactive-badge': !badgeType.is_active }"
        >
          <q-card-section class="text-center q-pb-sm">
            <!-- Badge Preview -->
            <div class="badge-preview q-mb-md">
              <q-chip
                :style="{
                  backgroundColor: badgeType.color,
                  color: getContrastColor(badgeType.color)
                }"
                size="lg"
                class="q-px-md"
              >
                <q-icon :name="badgeType.icon" class="q-mr-sm" />
                {{ badgeType.name }}
              </q-chip>
            </div>

            <!-- Badge Info -->
            <div class="text-h6 q-mb-xs">{{ badgeType.name }}</div>
            <div class="text-body2 text-grey-6 q-mb-sm">
              {{ badgeType.description || 'No description' }}
            </div>

            <!-- Statistics -->
            <div class="row justify-center q-gutter-md q-mb-md">
              <div class="text-center">
                <div class="text-h6 text-primary">{{ badgeType.active_member_count || 0 }}</div>
                <div class="text-caption text-grey-6">Active</div>
              </div>
              <div class="text-center">
                <div class="text-h6 text-grey-7">{{ badgeType.member_count || 0 }}</div>
                <div class="text-caption text-grey-6">Total</div>
              </div>
            </div>

            <!-- Status -->
            <q-chip
              :color="badgeType.is_active ? 'positive' : 'grey-5'"
              :text-color="badgeType.is_active ? 'white' : 'grey-8'"
              size="sm"
              class="q-mb-md"
            >
              {{ badgeType.is_active ? 'Active' : 'Inactive' }}
            </q-chip>
          </q-card-section>

          <q-card-actions align="center">
            <q-btn
              icon="edit"
              label="Edit"
              flat
              color="primary"
              @click="editBadgeType(badgeType)"
            />
            <q-btn
              :icon="badgeType.is_active ? 'visibility_off' : 'visibility'"
              :label="badgeType.is_active ? 'Deactivate' : 'Activate'"
              flat
              :color="badgeType.is_active ? 'warning' : 'positive'"
              @click="toggleActive(badgeType)"
              :loading="badgeType.updating"
            />
            <q-btn
              icon="delete"
              label="Delete"
              flat
              color="negative"
              @click="confirmDelete(badgeType)"
              :loading="badgeType.deleting"
            />
          </q-card-actions>
        </q-card>
      </div>

      <!-- Empty State -->
      <div v-if="!filteredBadgeTypes.length && !loading" class="text-center q-py-xl">
        <q-icon name="badge" size="64px" color="grey-5" />
        <div class="text-h6 text-grey-6 q-mt-md">No badge types found</div>
        <div class="text-body2 text-grey-6 q-mb-md">
          Create your first badge type to get started
        </div>
        <q-btn
          color="primary"
          icon="add"
          label="Add Badge Type"
          @click="showCreateDialog = true"
        />
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <BadgeTypeFormDialog
      v-model="showCreateDialog"
      :badge-type="selectedBadgeType"
      :available-icons="availableIcons"
      @saved="handleBadgeTypeSaved"
    />

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteDialog">
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Delete Badge Type</div>
        </q-card-section>

        <q-card-section>
          Are you sure you want to delete the badge type "{{ badgeTypeToDelete?.name }}"?
          This action cannot be undone.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="showDeleteDialog = false" />
          <q-btn
            flat
            label="Delete"
            color="negative"
            @click="deleteBadgeType"
            :loading="deleting"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useBadgesStore } from '@/stores/badges'
import BadgeTypeFormDialog from './BadgeTypeFormDialog.vue'

const $q = useQuasar()
const badgesStore = useBadgesStore()

// Reactive data
const loading = ref(false)
const deleting = ref(false)
const creatingDefaults = ref(false)
const searchQuery = ref('')
const showActiveOnly = ref(true)
const showCreateDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedBadgeType = ref(null)
const badgeTypeToDelete = ref(null)

// Computed properties
const badgeTypes = computed(() => badgesStore.badgeTypes)
const availableIcons = computed(() => badgesStore.availableIcons)
const statistics = computed(() => badgesStore.statistics)
const expiringBadges = computed(() => badgesStore.expiringBadges)

const filteredBadgeTypes = computed(() => {
  let filtered = badgeTypes.value

  if (showActiveOnly.value) {
    filtered = filtered.filter(badge => badge.is_active)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(badge =>
      badge.name.toLowerCase().includes(query) ||
      (badge.description && badge.description.toLowerCase().includes(query))
    )
  }

  return filtered
})

// Methods
const loadData = async () => {
  loading.value = true
  try {
    await Promise.all([
      badgesStore.fetchBadgeTypes(),
      badgesStore.fetchStatistics(),
      badgesStore.fetchExpiringBadges()
    ])
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to load badge data'
    })
  } finally {
    loading.value = false
  }
}

const createDefaults = async () => {
  creatingDefaults.value = true
  try {
    await badgesStore.createDefaultBadges()
    $q.notify({
      type: 'positive',
      message: 'Default badge types created successfully'
    })
    await loadData()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to create default badge types'
    })
  } finally {
    creatingDefaults.value = false
  }
}

const editBadgeType = (badgeType) => {
  selectedBadgeType.value = { ...badgeType }
  showCreateDialog.value = true
}

const confirmDelete = (badgeType) => {
  badgeTypeToDelete.value = badgeType
  showDeleteDialog.value = true
}

const deleteBadgeType = async () => {
  if (!badgeTypeToDelete.value) return

  deleting.value = true
  try {
    await badgesStore.deleteBadgeType(badgeTypeToDelete.value.id)
    $q.notify({
      type: 'positive',
      message: 'Badge type deleted successfully'
    })
    showDeleteDialog.value = false
    badgeTypeToDelete.value = null
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to delete badge type'
    })
  } finally {
    deleting.value = false
  }
}

const toggleActive = async (badgeType) => {
  badgeType.updating = true
  try {
    await badgesStore.updateBadgeType(badgeType.id, {
      is_active: !badgeType.is_active
    })
    $q.notify({
      type: 'positive',
      message: `Badge type ${badgeType.is_active ? 'activated' : 'deactivated'}`
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to update badge type'
    })
  } finally {
    badgeType.updating = false
  }
}

const handleBadgeTypeSaved = () => {
  showCreateDialog.value = false
  selectedBadgeType.value = null
  loadData()
}

const getContrastColor = (hexColor: string): string => {
  // Remove # if present
  const hex = hexColor.replace('#', '')
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  // Return black for light colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

// Lifecycle
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.badge-type-card {
  transition: all 0.3s ease;
}

.badge-type-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.inactive-badge {
  opacity: 0.6;
}

.badge-preview {
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
