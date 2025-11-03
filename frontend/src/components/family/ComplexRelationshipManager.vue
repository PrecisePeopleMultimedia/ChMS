<template>
  <q-dialog v-model="showDialog" persistent max-width="1200px">
    <q-card style="min-width: 800px">
      <q-card-section>
        <div class="text-h6">
          <q-icon name="account_tree" class="q-mr-sm" />
          Complex Relationship Manager
        </div>
        <div class="text-subtitle2 text-grey-7">
          Manage relationships across families and households
        </div>
      </q-card-section>

      <q-card-section>
        <!-- Relationship Conflicts -->
        <div v-if="relationshipConflicts.length > 0" class="q-mb-lg">
          <div class="text-subtitle1 text-negative q-mb-sm">
            <q-icon name="warning" class="q-mr-xs" />
            Relationship Conflicts
          </div>
          <q-list bordered separator>
            <q-item
              v-for="conflict in relationshipConflicts"
              :key="conflict.id"
              class="bg-red-1"
            >
              <q-item-section avatar>
                <q-icon name="error" color="negative" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ conflict.description }}</q-item-label>
                <q-item-label caption>{{ conflict.details }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  flat
                  color="primary"
                  label="Resolve"
                  @click="resolveConflict(conflict)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- Cross-Family Relationships -->
        <div class="q-mb-lg">
          <div class="text-subtitle1 q-mb-sm">
            <q-icon name="people" class="q-mr-xs" />
            Cross-Family Relationships
          </div>
          <q-table
            :rows="crossFamilyRelationships"
            :columns="crossFamilyColumns"
            row-key="id"
            flat
            bordered
            :pagination="{ rowsPerPage: 5 }"
          >
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  flat
                  round
                  icon="edit"
                  @click="editRelationship(props.row)"
                />
                <q-btn
                  flat
                  round
                  icon="delete"
                  color="negative"
                  @click="deleteRelationship(props.row)"
                />
              </q-td>
            </template>
          </q-table>
        </div>

        <!-- Custody Information -->
        <div v-if="custodyRelationships.length > 0" class="q-mb-lg">
          <div class="text-subtitle1 q-mb-sm">
            <q-icon name="gavel" class="q-mr-xs" />
            Custody & Legal Relationships
          </div>
          <q-list bordered separator>
            <q-item
              v-for="custody in custodyRelationships"
              :key="custody.id"
            >
              <q-item-section>
                <q-item-label>
                  {{ getPersonName(custody.person1) }} ↔ {{ getPersonName(custody.person2) }}
                </q-item-label>
                <q-item-label caption>
                  {{ custody.relationship_type?.name }} • {{ custody.custody_type }}
                  <span v-if="custody.custody_start_date">
                    • From {{ formatDate(custody.custody_start_date) }}
                  </span>
                  <span v-if="custody.custody_end_date">
                    to {{ formatDate(custody.custody_end_date) }}
                  </span>
                </q-item-label>
                <q-item-label v-if="custody.custody_notes" caption class="q-mt-xs">
                  <strong>Notes:</strong> {{ custody.custody_notes }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-chip
                  :color="getCustodyTypeColor(custody.custody_type)"
                  text-color="white"
                  size="sm"
                >
                  {{ custody.custody_type }}
                </q-chip>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- Household Overlaps -->
        <div v-if="householdOverlaps.length > 0" class="q-mb-lg">
          <div class="text-subtitle1 q-mb-sm">
            <q-icon name="home_work" class="q-mr-xs" />
            Household Overlaps
          </div>
          <q-banner class="bg-orange-1 text-dark q-mb-sm" rounded>
            <template v-slot:avatar>
              <q-icon name="info" />
            </template>
            Members with multiple household memberships may indicate complex living situations.
          </q-banner>
          <q-list bordered separator>
            <q-item
              v-for="overlap in householdOverlaps"
              :key="overlap.member_id"
            >
              <q-item-section>
                <q-item-label>{{ overlap.member_name }}</q-item-label>
                <q-item-label caption>
                  Member of {{ overlap.households.length }} households
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  flat
                  color="primary"
                  label="Review"
                  @click="reviewHouseholdOverlap(overlap)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- Relationship Suggestions -->
        <div v-if="relationshipSuggestions.length > 0">
          <div class="text-subtitle1 q-mb-sm">
            <q-icon name="lightbulb" class="q-mr-xs" />
            Suggested Relationships
          </div>
          <q-list bordered separator>
            <q-item
              v-for="suggestion in relationshipSuggestions"
              :key="suggestion.id"
            >
              <q-item-section>
                <q-item-label>{{ suggestion.description }}</q-item-label>
                <q-item-label caption>{{ suggestion.reason }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  flat
                  color="positive"
                  label="Accept"
                  @click="acceptSuggestion(suggestion)"
                />
                <q-btn
                  flat
                  color="negative"
                  label="Dismiss"
                  @click="dismissSuggestion(suggestion)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Close" @click="closeDialog" />
        <q-btn color="primary" label="Save Changes" @click="saveChanges" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRelationshipsStore } from '@/stores/relationships'

interface Props {
  memberId: number
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const $q = useQuasar()
const relationshipsStore = useRelationshipsStore()

const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Mock data - in real implementation, these would come from the store
const relationshipConflicts = ref([
  {
    id: 1,
    description: 'John Smith is marked as both father and uncle to Mary Johnson',
    details: 'Conflicting relationship types detected',
    type: 'duplicate_relationship'
  }
])

const crossFamilyRelationships = ref([
  {
    id: 1,
    person1_name: 'John Smith',
    person2_name: 'Mary Johnson',
    relationship_type: 'Uncle',
    family1: 'Smith Family',
    family2: 'Johnson Family',
    status: 'active'
  }
])

const crossFamilyColumns = [
  { name: 'person1_name', label: 'Person 1', field: 'person1_name', align: 'left' },
  { name: 'person2_name', label: 'Person 2', field: 'person2_name', align: 'left' },
  { name: 'relationship_type', label: 'Relationship', field: 'relationship_type', align: 'left' },
  { name: 'family1', label: 'Family 1', field: 'family1', align: 'left' },
  { name: 'family2', label: 'Family 2', field: 'family2', align: 'left' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' }
]

const custodyRelationships = ref([])
const householdOverlaps = ref([])
const relationshipSuggestions = ref([])

const getPersonName = (person: any) => {
  return person ? `${person.first_name} ${person.last_name}` : 'Unknown'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const getCustodyTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    full: 'positive',
    joint: 'primary',
    partial: 'warning',
    none: 'grey'
  }
  return colors[type] || 'grey'
}

const resolveConflict = (conflict: any) => {
  // Implementation for resolving conflicts
  console.log('Resolving conflict:', conflict)
}

const editRelationship = (relationship: any) => {
  // Implementation for editing relationships
  console.log('Editing relationship:', relationship)
}

const deleteRelationship = (relationship: any) => {
  // Implementation for deleting relationships
  console.log('Deleting relationship:', relationship)
}

const reviewHouseholdOverlap = (overlap: any) => {
  // Implementation for reviewing household overlaps
  console.log('Reviewing overlap:', overlap)
}

const acceptSuggestion = (suggestion: any) => {
  // Implementation for accepting suggestions
  console.log('Accepting suggestion:', suggestion)
}

const dismissSuggestion = (suggestion: any) => {
  // Implementation for dismissing suggestions
  console.log('Dismissing suggestion:', suggestion)
}

const closeDialog = () => {
  showDialog.value = false
}

const saveChanges = () => {
  // Implementation for saving changes
  $q.notify({
    type: 'positive',
    message: 'Changes saved successfully'
  })
  closeDialog()
}
</script>

<style scoped lang="sass">
.q-table
  .q-td
    padding: 8px
</style>
