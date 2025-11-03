<template>
  <q-card>
    <q-card-section>
      <div class="text-h6 q-mb-md">
        <q-icon name="gavel" class="q-mr-sm" />
        Custody & Legal Relationships
      </div>

      <!-- Add Custody Relationship Button -->
      <div class="q-mb-md">
        <q-btn
          color="primary"
          icon="add"
          label="Add Custody Relationship"
          @click="showAddDialog = true"
        />
      </div>

      <!-- Custody Relationships List -->
      <q-list v-if="custodyRelationships.length > 0" bordered separator>
        <q-item
          v-for="custody in custodyRelationships"
          :key="custody.id"
        >
          <q-item-section avatar>
            <q-icon
              :name="getCustodyIcon(custody.custody_type)"
              :color="getCustodyColor(custody.custody_type)"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ getPersonName(custody.person1) }} ↔ {{ getPersonName(custody.person2) }}
              <q-chip
                size="sm"
                :color="getCustodyColor(custody.custody_type)"
                text-color="white"
                class="q-ml-sm"
              >
                {{ custody.custody_type }}
              </q-chip>
            </q-item-label>
            <q-item-label caption>
              {{ custody.relationship_type?.name }}
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
            <q-btn
              flat
              round
              icon="edit"
              @click="editCustody(custody)"
            />
            <q-btn
              flat
              round
              icon="delete"
              color="negative"
              @click="deleteCustody(custody)"
            />
          </q-item-section>
        </q-item>
      </q-list>

      <div v-else class="text-center text-grey-7 q-py-lg">
        No custody relationships found
      </div>
    </q-card-section>

    <!-- Add/Edit Custody Dialog -->
    <q-dialog v-model="showCustodyDialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">
            {{ editingCustody ? 'Edit' : 'Add' }} Custody Relationship
          </div>
        </q-card-section>

        <q-card-section>
          <div class="row q-gutter-md">
            <div class="col-12">
              <q-select
                v-model="custodyForm.person1_id"
                :options="memberOptions"
                option-value="value"
                option-label="label"
                label="Guardian/Parent"
                filled
                emit-value
                map-options
                :rules="[val => !!val || 'Guardian is required']"
              />
            </div>

            <div class="col-12">
              <q-select
                v-model="custodyForm.person2_id"
                :options="memberOptions"
                option-value="value"
                option-label="label"
                label="Child/Ward"
                filled
                emit-value
                map-options
                :rules="[val => !!val || 'Child is required']"
              />
            </div>

            <div class="col-12">
              <q-select
                v-model="custodyForm.relationship_type_id"
                :options="legalRelationshipTypes"
                option-value="value"
                option-label="label"
                label="Relationship Type"
                filled
                emit-value
                map-options
                :rules="[val => !!val || 'Relationship type is required']"
              />
            </div>

            <div class="col-12">
              <q-select
                v-model="custodyForm.custody_type"
                :options="custodyTypeOptions"
                option-value="value"
                option-label="label"
                label="Custody Type"
                filled
                emit-value
                map-options
                :rules="[val => !!val || 'Custody type is required']"
              />
            </div>

            <div class="col-md-6 col-12">
              <q-input
                v-model="custodyForm.custody_start_date"
                type="date"
                label="Custody Start Date"
                filled
              />
            </div>

            <div class="col-md-6 col-12">
              <q-input
                v-model="custodyForm.custody_end_date"
                type="date"
                label="Custody End Date"
                filled
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="custodyForm.custody_notes"
                type="textarea"
                label="Custody Notes"
                filled
                rows="3"
                placeholder="Legal details, court orders, special arrangements..."
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="custodyForm.notes"
                type="textarea"
                label="Additional Notes"
                filled
                rows="2"
                placeholder="Any additional information..."
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="closeCustodyDialog" />
          <q-btn
            color="primary"
            label="Save"
            @click="saveCustody"
            :loading="saving"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRelationshipsStore } from '@/stores/relationships'
import { useMembersStore } from '@/stores/members'

interface Props {
  memberId?: number
  familyId?: number
}

const props = defineProps<Props>()

const $q = useQuasar()
const relationshipsStore = useRelationshipsStore()
const membersStore = useMembersStore()

const custodyRelationships = ref<any[]>([])
const showAddDialog = ref(false)
const showCustodyDialog = ref(false)
const editingCustody = ref<any>(null)
const saving = ref(false)

const custodyForm = ref({
  person1_id: null as number | null,
  person2_id: null as number | null,
  relationship_type_id: null as number | null,
  custody_type: null as string | null,
  custody_start_date: '',
  custody_end_date: '',
  custody_notes: '',
  notes: ''
})

const memberOptions = computed(() => {
  return membersStore.members.map(member => ({
    label: `${member.first_name} ${member.last_name}`,
    value: member.id
  }))
})

const legalRelationshipTypes = computed(() => {
  return relationshipsStore.relationshipTypes
    .filter(type => type.is_legal || type.category === 'legal')
    .map(type => ({
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

const getPersonName = (person: any) => {
  return person ? `${person.first_name} ${person.last_name}` : 'Unknown'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const getCustodyIcon = (type: string) => {
  const icons: Record<string, string> = {
    full: 'gavel',
    joint: 'people',
    partial: 'schedule',
    none: 'block'
  }
  return icons[type] || 'help'
}

const getCustodyColor = (type: string) => {
  const colors: Record<string, string> = {
    full: 'positive',
    joint: 'primary',
    partial: 'warning',
    none: 'grey'
  }
  return colors[type] || 'grey'
}

const editCustody = (custody: any) => {
  editingCustody.value = custody
  custodyForm.value = {
    person1_id: custody.person1_id,
    person2_id: custody.person2_id,
    relationship_type_id: custody.relationship_type_id,
    custody_type: custody.custody_type,
    custody_start_date: custody.custody_start_date || '',
    custody_end_date: custody.custody_end_date || '',
    custody_notes: custody.custody_notes || '',
    notes: custody.notes || ''
  }
  showCustodyDialog.value = true
}

const deleteCustody = (custody: any) => {
  $q.dialog({
    title: 'Confirm Delete',
    message: 'Are you sure you want to delete this custody relationship?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await relationshipsStore.deleteFamilyRelationship(custody.id)
      await loadCustodyRelationships()
      $q.notify({
        type: 'positive',
        message: 'Custody relationship deleted successfully'
      })
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Failed to delete custody relationship'
      })
    }
  })
}

const saveCustody = async () => {
  saving.value = true
  try {
    const data = {
      ...custodyForm.value,
      family_id: props.familyId,
      status: 'active'
    }

    if (editingCustody.value) {
      await relationshipsStore.updateFamilyRelationship(editingCustody.value.id, data)
    } else {
      await relationshipsStore.createFamilyRelationship(data)
    }

    await loadCustodyRelationships()
    closeCustodyDialog()
    $q.notify({
      type: 'positive',
      message: `Custody relationship ${editingCustody.value ? 'updated' : 'created'} successfully`
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to save custody relationship'
    })
  } finally {
    saving.value = false
  }
}

const closeCustodyDialog = () => {
  showCustodyDialog.value = false
  editingCustody.value = null
  resetForm()
}

const resetForm = () => {
  custodyForm.value = {
    person1_id: null,
    person2_id: null,
    relationship_type_id: null,
    custody_type: null,
    custody_start_date: '',
    custody_end_date: '',
    custody_notes: '',
    notes: ''
  }
}

const loadCustodyRelationships = async () => {
  try {
    let relationships = []
    if (props.memberId) {
      relationships = await relationshipsStore.fetchMemberRelationships(props.memberId)
    } else if (props.familyId) {
      relationships = await relationshipsStore.fetchFamilyRelationships(props.familyId)
    }
    
    // Filter for custody relationships
    custodyRelationships.value = relationships.filter(r => r.custody_type)
  } catch (error) {
    console.error('Failed to load custody relationships:', error)
  }
}

watch(showAddDialog, (val) => {
  if (val) {
    resetForm()
    showCustodyDialog.value = true
  }
})

onMounted(async () => {
  await Promise.all([
    relationshipsStore.fetchRelationshipTypes(),
    membersStore.fetchMembers(),
    loadCustodyRelationships()
  ])
})
</script>

<style scoped lang="sass">
.q-card
  .q-card-section
    .text-h6
      font-weight: 600
</style>
