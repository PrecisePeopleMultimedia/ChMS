<template>
  <q-card flat bordered class="member-attributes-panel">
    <q-card-section>
      <div class="row items-center justify-between q-mb-md">
        <div class="text-h6">Custom Attributes</div>
        <q-btn
          v-if="!isEditing"
          icon="edit"
          label="Edit"
          flat
          color="primary"
          @click="startEditing"
          :loading="loading"
        />
        <div v-else class="row q-gutter-sm">
          <q-btn
            label="Cancel"
            flat
            @click="cancelEditing"
          />
          <q-btn
            label="Save"
            color="primary"
            @click="saveAttributes"
            :loading="saving"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center q-py-lg">
        <q-spinner size="40px" color="primary" />
        <div class="q-mt-md text-grey-6">Loading attributes...</div>
      </div>

      <!-- No Attributes State -->
      <div v-else-if="!attributesWithValues.length" class="text-center q-py-lg">
        <q-icon name="info" size="48px" color="grey-5" />
        <div class="q-mt-md text-grey-6">No custom attributes configured</div>
      </div>

      <!-- Attributes Display/Edit -->
      <div v-else>
        <!-- Group by Category -->
        <div
          v-for="(categoryAttributes, category) in groupedAttributes"
          :key="category"
          class="q-mb-lg"
        >
          <div class="text-subtitle1 text-weight-medium q-mb-md">
            <q-icon :name="getCategoryIcon(category)" class="q-mr-sm" />
            {{ getCategoryLabel(category) }}
          </div>

          <div class="row q-gutter-md">
            <div
              v-for="attributeData in categoryAttributes"
              :key="attributeData.attribute.id"
              class="col-12 col-sm-6 col-md-4"
            >
              <!-- Display Mode -->
              <div v-if="!isEditing" class="attribute-display">
                <div class="text-caption text-grey-6 q-mb-xs">
                  {{ attributeData.attribute.name }}
                  <q-icon
                    v-if="attributeData.attribute.is_required"
                    name="star"
                    color="red"
                    size="xs"
                    class="q-ml-xs"
                  />
                </div>
                <div class="text-body1">
                  {{ attributeData.display_value || '—' }}
                </div>
              </div>

              <!-- Edit Mode -->
              <AttributeValueInput
                v-else
                :attribute="attributeData.attribute"
                :model-value="editingValues[attributeData.attribute.key]"
                @update:model-value="updateEditingValue(attributeData.attribute.key, $event)"
              />
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useAttributesStore } from '@/stores/attributes'
import { useMembersStore } from '@/stores/members'
import AttributeValueInput from './AttributeValueInput.vue'

interface Props {
  memberId: number
}

const props = defineProps<Props>()

const $q = useQuasar()
const attributesStore = useAttributesStore()
const membersStore = useMembersStore()

// Reactive data
const loading = ref(false)
const saving = ref(false)
const isEditing = ref(false)
const attributesWithValues = ref([])
const editingValues = ref({})

// Computed properties
const groupedAttributes = computed(() => {
  const grouped = {}
  
  attributesWithValues.value.forEach(attributeData => {
    const category = attributeData.attribute.category
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(attributeData)
  })

  // Sort attributes within each category by display_order
  Object.keys(grouped).forEach(category => {
    grouped[category].sort((a, b) => a.attribute.display_order - b.attribute.display_order)
  })

  return grouped
})

// Methods
const loadMemberAttributes = async () => {
  loading.value = true
  try {
    const response = await membersStore.getMemberAttributes(props.memberId)
    attributesWithValues.value = response.custom_attributes || []
  } catch (error) {
    console.error('Failed to load member attributes:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to load member attributes'
    })
  } finally {
    loading.value = false
  }
}

const startEditing = () => {
  isEditing.value = true
  
  // Initialize editing values with current values
  editingValues.value = {}
  attributesWithValues.value.forEach(attributeData => {
    editingValues.value[attributeData.attribute.key] = attributeData.value
  })
}

const cancelEditing = () => {
  isEditing.value = false
  editingValues.value = {}
}

const updateEditingValue = (attributeKey: string, value: any) => {
  editingValues.value[attributeKey] = value
}

const saveAttributes = async () => {
  saving.value = true
  
  try {
    await membersStore.updateMemberAttributes(props.memberId, editingValues.value)
    
    $q.notify({
      type: 'positive',
      message: 'Attributes updated successfully'
    })
    
    isEditing.value = false
    editingValues.value = {}
    
    // Reload attributes to get updated display values
    await loadMemberAttributes()
  } catch (error: any) {
    console.error('Failed to save attributes:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to save attributes'
    })
  } finally {
    saving.value = false
  }
}

const getCategoryIcon = (category: string): string => {
  const icons = {
    'Personal': 'person',
    'Contact': 'contact_phone',
    'Ministry': 'church',
    'Family': 'family_restroom',
    'Medical': 'medical_services',
    'Emergency': 'emergency',
    'Custom': 'settings'
  }
  return icons[category] || 'folder'
}

const getCategoryLabel = (category: string): string => {
  const categories = attributesStore.categories
  return categories[category] || category
}

// Watchers
watch(() => props.memberId, () => {
  if (props.memberId) {
    loadMemberAttributes()
  }
}, { immediate: true })

// Lifecycle
onMounted(() => {
  if (props.memberId) {
    loadMemberAttributes()
  }
})
</script>

<style scoped>
.member-attributes-panel {
  .attribute-display {
    padding: 12px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    background-color: #fafafa;
    min-height: 60px;
  }
}
</style>
