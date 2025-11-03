<template>
  <q-card>
    <q-card-section>
      <div class="text-h6 q-mb-md">
        <q-icon name="account_tree" class="q-mr-sm" />
        Family Relationships
      </div>

      <!-- Enhanced Controls -->
      <div class="row q-gutter-sm q-mb-md">
        <q-btn
          color="primary"
          icon="add"
          label="Add Relationship"
          @click="showAddDialog = true"
        />
        <q-btn
          color="secondary"
          icon="gavel"
          label="Manage Custody"
          @click="showCustodyManager = true"
        />
        <q-btn
          color="accent"
          icon="account_tree"
          label="Complex Relationships"
          @click="showComplexManager = true"
        />
        <q-btn
          color="info"
          icon="home_work"
          label="Household vs Family"
          @click="showDistinction = true"
        />
      </div>

      <!-- Relationships List -->
      <q-list v-if="memberRelationships.length > 0" bordered separator>
        <q-item
          v-for="relationship in memberRelationships"
          :key="relationship.id"
        >
          <q-item-section avatar>
            <q-icon
              :name="getRelationshipIcon(relationship.relationship_type?.category)"
              :color="getRelationshipColor(relationship.relationship_type?.category)"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ getOtherPersonName(relationship) }}
              <q-chip
                size="sm"
                :color="getRelationshipColor(relationship.relationship_type?.category)"
                text-color="white"
                class="q-ml-sm"
              >
                {{ relationship.relationship_type?.name || 'Unknown' }}
              </q-chip>
              <q-badge
                v-if="relationship.is_primary"
                color="purple"
                label="Primary"
                class="q-ml-sm"
              />
              <q-badge
                v-if="relationship.custody_type"
                color="orange"
                :label="relationship.custody_type"
                class="q-ml-sm"
              />
            </q-item-label>
            <q-item-label caption>
              <span v-if="relationship.start_date">
                Since {{ formatDate(relationship.start_date) }}
              </span>
              <span v-if="relationship.custody_type" class="q-ml-sm">
                • Custody: {{ formatCustodyType(relationship.custody_type) }}
              </span>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              flat
              round
              icon="edit"
              @click="editRelationship(relationship)"
            />
            <q-btn
              flat
              round
              icon="delete"
              color="negative"
              @click="deleteRelationship(relationship)"
            />
          </q-item-section>
        </q-item>
      </q-list>

      <q-banner v-else class="bg-grey-3">
        <div class="text-body2">No relationships defined. Add relationships to map family connections.</div>
      </q-banner>

      <!-- Add/Edit Relationship Dialog -->
      <q-dialog v-model="showRelationshipDialog">
        <q-card style="min-width: 500px">
          <q-card-section>
            <div class="text-h6">{{ editingRelationship ? 'Edit Relationship' : 'Add Relationship' }}</div>
          </q-card-section>

          <q-card-section>
            <q-select
              v-model="relationshipForm.person2_id"
              :options="memberOptions"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              filled
              label="Related Member *"
              :disable="editingRelationship !== null"
            />

            <q-select
              v-model="relationshipForm.relationship_type_id"
              :options="relationshipTypeOptions"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              filled
              label="Relationship Type *"
              class="q-mt-md"
            />

            <div class="row q-gutter-md q-mt-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="relationshipForm.start_date"
                  filled
                  type="date"
                  label="Start Date"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-checkbox
                  v-model="relationshipForm.is_primary"
                  label="Primary Relationship"
                />
              </div>
            </div>

            <!-- Custody Information -->
            <q-select
              v-model="relationshipForm.custody_type"
              :options="custodyTypeOptions"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              filled
              label="Custody Type"
              class="q-mt-md"
              clearable
            />

            <q-input
              v-if="relationshipForm.custody_type"
              v-model="relationshipForm.custody_notes"
              filled
              type="textarea"
              label="Custody Notes"
              class="q-mt-md"
              rows="2"
            />

            <q-input
              v-model="relationshipForm.notes"
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
              @click="saveRelationship"
              :loading="relationshipsStore.saving"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Enhanced Components -->
      <HouseholdFamilyDistinction
        v-if="showDistinction"
        :member-id="memberId"
        :member-family="memberFamily"
        :family-relationships="memberRelationships"
        :member-households="memberHouseholds"
        @manage-family="handleManageFamily"
        @manage-households="handleManageHouseholds"
        @view-family-tree="handleViewFamilyTree"
        @view-relationship-map="handleViewRelationshipMap"
        @review-complex-relationships="showComplexManager = true"
      />

      <ComplexRelationshipManager
        v-model="showComplexManager"
        :member-id="memberId"
      />

      <CustodyManager
        v-if="showCustodyManager"
        :member-id="memberId"
        :family-id="familyId"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRelationshipsStore } from '@/stores/relationships'
import { useMembersStore } from '@/stores/members'
import { useFamiliesStore } from '@/stores/families'
import { useQuasar } from 'quasar'
import HouseholdFamilyDistinction from './HouseholdFamilyDistinction.vue'
import ComplexRelationshipManager from './ComplexRelationshipManager.vue'
import CustodyManager from './CustodyManager.vue'

const props = defineProps<{
  memberId: number
  familyId?: number
}>()

const $q = useQuasar()
const relationshipsStore = useRelationshipsStore()
const membersStore = useMembersStore()
const familiesStore = useFamiliesStore()

const memberRelationships = ref<any[]>([])
const showRelationshipDialog = ref(false)
const showAddDialog = ref(false)
const editingRelationship = ref<any>(null)

// Enhanced relationship management
const showDistinction = ref(false)
const showComplexManager = ref(false)
const showCustodyManager = ref(false)
const memberFamily = ref<any>(null)
const memberHouseholds = ref<any[]>([])

const relationshipForm = ref({
  family_id: props.familyId || null,
  person1_id: props.memberId,
  person2_id: null as number | null,
  relationship_type_id: null as number | null,
  is_primary: false,
  start_date: '',
  custody_type: null as string | null,
  custody_notes: '',
  notes: ''
})

const relationshipTypeOptions = computed(() => {
  return relationshipsStore.familyTypes.map(type => ({
    label: type.name,
    value: type.id
  }))
})

const custodyTypeOptions = [
  { label: 'Full Custody', value: 'full' },
  { label: 'Joint Custody', value: 'joint' },
  { label: 'Partial Custody', value: 'partial' },
  { label: 'No Custody', value: 'none' }
]

const memberOptions = computed(() => {
  // Filter out current member and get all active members
  return membersStore.activeMembers
    .filter(m => m.id !== props.memberId)
    .map(m => ({
      label: `${m.first_name} ${m.last_name}`,
      value: m.id
    }))
})

const getOtherPersonName = (relationship: any): string => {
  if (!relationship.person1 || !relationship.person2) return 'Unknown'
  if (relationship.person1_id === props.memberId) {
    return `${relationship.person2.first_name} ${relationship.person2.last_name}`
  }
  return `${relationship.person1.first_name} ${relationship.person1.last_name}`
}

const getRelationshipIcon = (category?: string): string => {
  const icons: Record<string, string> = {
    'family': 'people',
    'household': 'home',
    'legal': 'gavel',
    'custom': 'person'
  }
  return icons[category || 'custom'] || 'person'
}

const getRelationshipColor = (category?: string): string => {
  const colors: Record<string, string> = {
    'family': 'primary',
    'household': 'green',
    'legal': 'orange',
    'custom': 'grey'
  }
  return colors[category || 'custom'] || 'grey'
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-GB')
}

const formatCustodyType = (type: string): string => {
  const types: Record<string, string> = {
    'full': 'Full',
    'joint': 'Joint',
    'partial': 'Partial',
    'none': 'None'
  }
  return types[type] || type
}

const editRelationship = (relationship: any) => {
  editingRelationship.value = relationship
  relationshipForm.value = {
    family_id: relationship.family_id,
    person1_id: relationship.person1_id,
    person2_id: relationship.person2_id,
    relationship_type_id: relationship.relationship_type_id,
    is_primary: relationship.is_primary,
    start_date: relationship.start_date || '',
    custody_type: relationship.custody_type || null,
    custody_notes: relationship.custody_notes || '',
    notes: relationship.notes || ''
  }
  showRelationshipDialog.value = true
}

const deleteRelationship = async (relationship: any) => {
  $q.dialog({
    title: 'Confirm Delete',
    message: 'Are you sure you want to delete this relationship?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await relationshipsStore.deleteRelationship(relationship.id)
      await loadRelationships()
      $q.notify({
        type: 'positive',
        message: 'Relationship deleted successfully'
      })
    } catch (error: any) {
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'Failed to delete relationship'
      })
    }
  })
}

const saveRelationship = async () => {
  if (!relationshipForm.value.person2_id || !relationshipForm.value.relationship_type_id) {
    $q.notify({
      type: 'warning',
      message: 'Please select a member and relationship type'
    })
    return
  }

  // Get family ID if not provided
  if (!relationshipForm.value.family_id && props.familyId) {
    relationshipForm.value.family_id = props.familyId
  }

  try {
    if (editingRelationship.value) {
      await relationshipsStore.updateRelationship(
        editingRelationship.value.id,
        relationshipForm.value
      )
    } else {
      await relationshipsStore.createRelationship(relationshipForm.value)
    }

    $q.notify({
      type: 'positive',
      message: editingRelationship.value ? 'Relationship updated successfully' : 'Relationship created successfully'
    })

    showRelationshipDialog.value = false
    showAddDialog.value = false
    resetForm()
    await loadRelationships()
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to save relationship'
    })
  }
}

const resetForm = () => {
  relationshipForm.value = {
    family_id: props.familyId || null,
    person1_id: props.memberId,
    person2_id: null,
    relationship_type_id: null,
    is_primary: false,
    start_date: '',
    custody_type: null,
    custody_notes: '',
    notes: ''
  }
  editingRelationship.value = null
}

const loadRelationships = async () => {
  try {
    memberRelationships.value = await relationshipsStore.fetchMemberRelationships(props.memberId)
  } catch (error) {
    console.error('Failed to load relationships:', error)
  }
}

watch(showAddDialog, (val) => {
  if (val) {
    resetForm()
    showRelationshipDialog.value = true
  }
})

// Enhanced relationship management handlers
const handleManageFamily = () => {
  // Navigate to family management or emit event
  console.log('Manage family clicked')
}

const handleManageHouseholds = () => {
  // Navigate to household management or emit event
  console.log('Manage households clicked')
}

const handleViewFamilyTree = () => {
  // Navigate to family tree view or emit event
  console.log('View family tree clicked')
}

const handleViewRelationshipMap = () => {
  // Navigate to relationship map or emit event
  console.log('View relationship map clicked')
}

onMounted(async () => {
  try {
    await relationshipsStore.fetchRelationshipTypes({ family_only: true })
    await membersStore.fetchMembers({ active_only: true })
    await loadRelationships()

    // Load additional data for enhanced features
    if (props.familyId) {
      memberFamily.value = await familiesStore.fetchFamily(props.familyId)
    }
    // Load member households (would need to implement this in the store)
    // memberHouseholds.value = await householdsStore.fetchMemberHouseholds(props.memberId)
  } catch (error) {
    console.error('Failed to initialize:', error)
  }
})
</script>

<style scoped lang="sass">
</style>

