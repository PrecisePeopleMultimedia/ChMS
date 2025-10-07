<template>
  <div class="member-badges">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6">Member Badges</div>
      <div class="row q-gutter-sm">
        <q-btn
          icon="auto_fix_high"
          label="Auto Assign"
          color="secondary"
          outline
          size="sm"
          @click="autoAssignBadges"
          :loading="autoAssigning"
        />
        <q-btn
          icon="add"
          label="Assign Badge"
          color="primary"
          size="sm"
          @click="showAssignDialog = true"
        />
      </div>
    </div>

    <!-- Badge Summary -->
    <div v-if="summary" class="row q-gutter-sm q-mb-md">
      <q-chip
        color="primary"
        text-color="white"
        icon="badge"
        :label="`${summary.total_badges} Total`"
      />
      <q-chip
        v-if="summary.expiring_soon > 0"
        color="warning"
        text-color="white"
        icon="schedule"
        :label="`${summary.expiring_soon} Expiring`"
      />
      <q-chip
        v-if="summary.expired > 0"
        color="negative"
        text-color="white"
        icon="error"
        :label="`${summary.expired} Expired`"
      />
    </div>

    <!-- Badges Grid -->
    <div v-if="badges.length" class="row q-gutter-sm">
      <q-card
        v-for="badge in badges"
        :key="badge.id"
        flat
        bordered
        class="badge-card"
        :class="{
          'expired-badge': badge.expiration_status === 'expired',
          'expiring-badge': badge.expiration_status === 'expiring_soon'
        }"
      >
        <q-card-section class="q-pa-sm">
          <!-- Badge Display -->
          <div class="text-center q-mb-sm">
            <q-chip
              :style="{
                backgroundColor: badge.color,
                color: getContrastColor(badge.color)
              }"
              size="md"
              class="q-px-sm"
            >
              <q-icon :name="badge.icon" class="q-mr-xs" size="sm" />
              {{ badge.name }}
            </q-chip>
          </div>

          <!-- Badge Info -->
          <div class="text-center">
            <div class="text-caption text-grey-6">
              Assigned: {{ badge.assigned_at }}
            </div>
            <div v-if="badge.expires_at" class="text-caption">
              <span :class="{
                'text-negative': badge.expiration_status === 'expired',
                'text-warning': badge.expiration_status === 'expiring_soon',
                'text-grey-6': badge.expiration_status === 'active'
              }">
                Expires: {{ badge.expires_at }}
              </span>
            </div>
            <div v-if="badge.notes" class="text-caption text-grey-6 q-mt-xs">
              {{ badge.notes }}
            </div>
            <div v-if="badge.assigned_by_name" class="text-caption text-grey-5 q-mt-xs">
              By: {{ badge.assigned_by_name }}
            </div>
          </div>

          <!-- Expiration Warning -->
          <div v-if="badge.expiration_status === 'expiring_soon'" class="text-center q-mt-sm">
            <q-chip
              color="warning"
              text-color="white"
              size="sm"
              icon="schedule"
              :label="`${badge.days_until_expiration} days left`"
            />
          </div>

          <div v-if="badge.expiration_status === 'expired'" class="text-center q-mt-sm">
            <q-chip
              color="negative"
              text-color="white"
              size="sm"
              icon="error"
              label="Expired"
            />
          </div>
        </q-card-section>

        <q-card-actions align="center" class="q-pt-none">
          <q-btn
            icon="edit"
            size="sm"
            flat
            color="primary"
            @click="editBadge(badge)"
          />
          <q-btn
            icon="delete"
            size="sm"
            flat
            color="negative"
            @click="confirmRemoveBadge(badge)"
          />
        </q-card-actions>
      </q-card>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading" class="text-center q-py-lg">
      <q-icon name="badge" size="48px" color="grey-5" />
      <div class="text-body1 text-grey-6 q-mt-md">No badges assigned</div>
      <div class="text-body2 text-grey-6 q-mb-md">
        Assign badges to help identify this member
      </div>
      <q-btn
        color="primary"
        icon="add"
        label="Assign Badge"
        @click="showAssignDialog = true"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center q-py-lg">
      <q-spinner size="48px" color="primary" />
      <div class="text-body2 text-grey-6 q-mt-md">Loading badges...</div>
    </div>

    <!-- Assign Badge Dialog -->
    <MemberBadgeAssignDialog
      v-model="showAssignDialog"
      :member-id="memberId"
      :available-badges="availableBadges"
      @assigned="handleBadgeAssigned"
    />

    <!-- Edit Badge Dialog -->
    <MemberBadgeEditDialog
      v-model="showEditDialog"
      :badge="selectedBadge"
      @updated="handleBadgeUpdated"
    />

    <!-- Remove Confirmation Dialog -->
    <q-dialog v-model="showRemoveDialog">
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Remove Badge</div>
        </q-card-section>

        <q-card-section>
          Are you sure you want to remove the "{{ badgeToRemove?.name }}" badge from this member?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="showRemoveDialog = false" />
          <q-btn
            flat
            label="Remove"
            color="negative"
            @click="removeBadge"
            :loading="removing"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useBadgesStore } from '@/stores/badges'
import MemberBadgeAssignDialog from './MemberBadgeAssignDialog.vue'
import MemberBadgeEditDialog from './MemberBadgeEditDialog.vue'

interface Props {
  memberId: number
}

const props = defineProps<Props>()

const $q = useQuasar()
const badgesStore = useBadgesStore()

// Reactive data
const loading = ref(false)
const removing = ref(false)
const autoAssigning = ref(false)
const showAssignDialog = ref(false)
const showEditDialog = ref(false)
const showRemoveDialog = ref(false)
const selectedBadge = ref(null)
const badgeToRemove = ref(null)

// Computed properties
const badges = computed(() => badgesStore.memberBadges)
const summary = computed(() => badgesStore.memberBadgeSummary)
const availableBadges = computed(() => 
  badgesStore.badgeTypes.filter(badge => 
    badge.is_active && !badges.value.some(mb => mb.name === badge.name)
  )
)

// Methods
const loadMemberBadges = async () => {
  loading.value = true
  try {
    await badgesStore.fetchMemberBadges(props.memberId)
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to load member badges'
    })
  } finally {
    loading.value = false
  }
}

const autoAssignBadges = async () => {
  autoAssigning.value = true
  try {
    await badgesStore.autoAssignBadges(props.memberId)
    $q.notify({
      type: 'positive',
      message: 'Auto-assignment completed'
    })
    await loadMemberBadges()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to auto-assign badges'
    })
  } finally {
    autoAssigning.value = false
  }
}

const editBadge = (badge) => {
  selectedBadge.value = badge
  showEditDialog.value = true
}

const confirmRemoveBadge = (badge) => {
  badgeToRemove.value = badge
  showRemoveDialog.value = true
}

const removeBadge = async () => {
  if (!badgeToRemove.value) return

  removing.value = true
  try {
    await badgesStore.removeMemberBadge(props.memberId, badgeToRemove.value.id)
    $q.notify({
      type: 'positive',
      message: 'Badge removed successfully'
    })
    showRemoveDialog.value = false
    badgeToRemove.value = null
    await loadMemberBadges()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to remove badge'
    })
  } finally {
    removing.value = false
  }
}

const handleBadgeAssigned = () => {
  showAssignDialog.value = false
  loadMemberBadges()
}

const handleBadgeUpdated = () => {
  showEditDialog.value = false
  selectedBadge.value = null
  loadMemberBadges()
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
  loadMemberBadges()
})
</script>

<style scoped>
.badge-card {
  min-width: 200px;
  transition: all 0.3s ease;
}

.badge-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.expired-badge {
  border-color: #f44336;
  background-color: rgba(244, 67, 54, 0.05);
}

.expiring-badge {
  border-color: #ff9800;
  background-color: rgba(255, 152, 0, 0.05);
}
</style>
