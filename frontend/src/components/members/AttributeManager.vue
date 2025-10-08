<template>
  <q-page class="attribute-manager-page">
    <div class="q-pa-md">
      <!-- Header -->
      <div class="row items-center justify-between q-mb-md">
        <div>
          <h1 class="text-h4 q-ma-none">Custom Attributes</h1>
          <p class="text-body2 text-grey-6 q-ma-none">
            Manage custom fields for member profiles
          </p>
        </div>
        <q-btn
          color="primary"
          icon="add"
          label="Add Attribute"
          @click="showCreateDialog = true"
          :loading="loading"
        />
      </div>

      <!-- Filters -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section class="q-py-sm">
          <div class="row q-gutter-md items-center">
            <q-input
              v-model="searchQuery"
              placeholder="Search attributes..."
              outlined
              dense
              clearable
              style="min-width: 200px"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>

            <q-select
              v-model="selectedCategory"
              :options="categoryOptions"
              label="Category"
              outlined
              dense
              clearable
              emit-value
              map-options
              style="min-width: 150px"
            />

            <q-toggle
              v-model="showActiveOnly"
              label="Active only"
              color="primary"
            />
          </div>
        </q-card-section>
      </q-card>

      <!-- Attributes List -->
      <q-card flat bordered>
        <q-card-section class="q-pa-none">
          <q-table
            :rows="filteredAttributes"
            :columns="columns"
            row-key="id"
            :loading="loading"
            :pagination="{ rowsPerPage: 0 }"
            flat
            class="attribute-table"
          >
            <template v-slot:body-cell-field_type="props">
              <q-td :props="props">
                <q-chip
                  :label="fieldTypes[props.value] || props.value"
                  size="sm"
                  color="blue-grey-2"
                  text-color="blue-grey-8"
                />
              </q-td>
            </template>

            <template v-slot:body-cell-category="props">
              <q-td :props="props">
                <q-chip
                  :label="props.value"
                  size="sm"
                  :color="getCategoryColor(props.value)"
                  text-color="white"
                />
              </q-td>
            </template>

            <template v-slot:body-cell-is_required="props">
              <q-td :props="props">
                <q-icon
                  :name="props.value ? 'check_circle' : 'radio_button_unchecked'"
                  :color="props.value ? 'positive' : 'grey-5'"
                  size="sm"
                />
              </q-td>
            </template>

            <template v-slot:body-cell-is_active="props">
              <q-td :props="props">
                <q-toggle
                  :model-value="props.value"
                  @update:model-value="toggleActive(props.row)"
                  color="positive"
                  :loading="props.row.updating"
                />
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <div class="row q-gutter-xs">
                  <q-btn
                    icon="edit"
                    size="sm"
                    flat
                    round
                    color="primary"
                    @click="editAttribute(props.row)"
                  >
                    <q-tooltip>Edit</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="delete"
                    size="sm"
                    flat
                    round
                    color="negative"
                    @click="confirmDelete(props.row)"
                    :loading="props.row.deleting"
                  >
                    <q-tooltip>Delete</q-tooltip>
                  </q-btn>
                </div>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>

    <!-- Create/Edit Dialog -->
    <AttributeFormDialog
      v-model="showCreateDialog"
      :attribute="selectedAttribute"
      :categories="categories"
      :field-types="fieldTypes"
      @saved="handleAttributeSaved"
    />

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteDialog">
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Delete Attribute</div>
        </q-card-section>

        <q-card-section>
          Are you sure you want to delete the attribute "{{ attributeToDelete?.name }}"?
          This action cannot be undone.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="showDeleteDialog = false" />
          <q-btn
            flat
            label="Delete"
            color="negative"
            @click="deleteAttribute"
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
import { useAttributesStore } from '@/stores/attributes'
import AttributeFormDialog from './AttributeFormDialog.vue'

const $q = useQuasar()
const attributesStore = useAttributesStore()

// Reactive data
const loading = ref(false)
const deleting = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('')
const showActiveOnly = ref(true)
const showCreateDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedAttribute = ref(null)
const attributeToDelete = ref<any>(null)

// Computed properties
const attributes = computed(() => attributesStore.attributes)
const categories = computed(() => attributesStore.categories)
const fieldTypes = computed(() => attributesStore.fieldTypes)

const categoryOptions = computed(() => [
  { label: 'All Categories', value: '' },
  ...Object.entries(categories.value).map(([key, label]) => ({
    label,
    value: key
  }))
])

const filteredAttributes = computed(() => {
  let filtered = attributes.value

  if (showActiveOnly.value) {
    filtered = filtered.filter(attr => attr.is_active)
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(attr => attr.category === selectedCategory.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(attr =>
      attr.name.toLowerCase().includes(query) ||
      attr.key.toLowerCase().includes(query)
    )
  }

  return filtered.sort((a, b) => a.display_order - b.display_order)
})

// Table columns
const columns = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left' as const,
    sortable: true
  },
  {
    name: 'key',
    label: 'Key',
    field: 'key',
    align: 'left' as const,
    sortable: true
  },
  {
    name: 'field_type',
    label: 'Type',
    field: 'field_type',
    align: 'center' as const,
    sortable: true
  },
  {
    name: 'category',
    label: 'Category',
    field: 'category',
    align: 'center' as const,
    sortable: true
  },
  {
    name: 'is_required',
    label: 'Required',
    field: 'is_required',
    align: 'center' as const,
    sortable: true
  },
  {
    name: 'is_active',
    label: 'Active',
    field: 'is_active',
    align: 'center' as const,
    sortable: true
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'center' as const
  }
]

// Methods
const loadAttributes = async () => {
  loading.value = true
  try {
    await attributesStore.fetchAttributes()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to load attributes'
    })
  } finally {
    loading.value = false
  }
}

const editAttribute = (attribute: any) => {
  selectedAttribute.value = { ...attribute }
  showCreateDialog.value = true
}

const confirmDelete = (attribute: any) => {
  attributeToDelete.value = attribute
  showDeleteDialog.value = true
}

const deleteAttribute = async () => {
  if (!attributeToDelete.value) return

  deleting.value = true
  try {
    await attributesStore.deleteAttribute(attributeToDelete.value.id)
    $q.notify({
      type: 'positive',
      message: 'Attribute deleted successfully'
    })
    showDeleteDialog.value = false
    attributeToDelete.value = null
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to delete attribute'
    })
  } finally {
    deleting.value = false
  }
}

const toggleActive = async (attribute: any) => {
  attribute.updating = true
  try {
    await attributesStore.updateAttribute(attribute.id, {
      is_active: !attribute.is_active
    })
    $q.notify({
      type: 'positive',
      message: `Attribute ${attribute.is_active ? 'activated' : 'deactivated'}`
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to update attribute'
    })
  } finally {
    attribute.updating = false
  }
}

const handleAttributeSaved = () => {
  showCreateDialog.value = false
  selectedAttribute.value = null
  loadAttributes()
}

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Personal': 'blue',
    'Contact': 'green',
    'Ministry': 'purple',
    'Family': 'orange',
    'Medical': 'red',
    'Emergency': 'pink',
    'Custom': 'grey'
  }
  return colors[category] || 'grey'
}

// Lifecycle
onMounted(() => {
  loadAttributes()
})
</script>

<style scoped>
.attribute-table {
  .q-table__top {
    padding: 12px 16px;
  }
}
</style>
