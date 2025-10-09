<template>
  <q-page class="member-form-page">
    <div class="q-pa-md">
      <!-- Header -->
      <div class="row items-center justify-between q-mb-md">
        <div>
          <h1 class="text-h4 q-ma-none">
            {{ isEditing ? 'Edit Member' : 'Add New Member' }}
          </h1>
          <p class="text-body2 text-grey-6 q-ma-none">
            {{ isEditing ? 'Update member information' : 'Add a new member to your church' }}
          </p>
        </div>
        <q-btn
          icon="arrow_back"
          label="Back to Members"
          @click="$router.push('/members')"
          flat
        />
      </div>

      <!-- Form -->
      <q-form @submit="saveMember" class="row q-gutter-md">
        <!-- Basic Information -->
        <div class="col-12 col-md-8">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-h6 q-mb-md">Basic Information</div>
              
              <div class="row q-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.first_name"
                    label="First Name *"
                    outlined
                    :rules="[val => !!val || 'First name is required']"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.last_name"
                    label="Last Name *"
                    outlined
                    :rules="[val => !!val || 'Last name is required']"
                  />
                </div>
              </div>

              <div class="row q-gutter-md q-mt-sm">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.email"
                    label="Email"
                    type="email"
                    outlined
                    :rules="[
                      val => !val || /.+@.+\..+/.test(val) || 'Please enter a valid email'
                    ]"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.phone"
                    label="Phone Number"
                    outlined
                    mask="(###) ###-####"
                    unmasked-value
                  />
                </div>
              </div>

              <div class="row q-gutter-md q-mt-sm">
                <div class="col-12 col-md-4">
                  <q-input
                    v-model="form.date_of_birth"
                    label="Date of Birth"
                    outlined
                    type="date"
                  />
                </div>
                <div class="col-12 col-md-4">
                  <q-select
                    v-model="form.gender"
                    :options="genderOptions"
                    label="Gender"
                    outlined
                    emit-value
                    map-options
                    clearable
                  />
                </div>
                <div class="col-12 col-md-4">
                  <q-select
                    v-model="form.member_type"
                    :options="memberTypeOptions"
                    label="Member Type *"
                    outlined
                    emit-value
                    map-options
                    :rules="[val => !!val || 'Member type is required']"
                  />
                </div>
              </div>

              <div class="row q-gutter-md q-mt-sm">
                <div class="col-12">
                  <q-input
                    v-model="form.address"
                    label="Address"
                    outlined
                    type="textarea"
                    rows="3"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Family Information -->
          <q-card flat bordered class="q-mt-md">
            <q-card-section>
              <div class="text-h6 q-mb-md">Family Information</div>
              
              <div class="row q-gutter-md">
                <div class="col-12 col-md-6">
                  <q-select
                    v-model="form.family_id"
                    :options="familyOptions"
                    label="Family"
                    outlined
                    emit-value
                    map-options
                    clearable
                    use-input
                    @filter="filterFamilies"
                    :loading="loadingFamilies"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No families found
                        </q-item-section>
                      </q-item>
                    </template>
                    <template v-slot:after>
                      <q-btn
                        icon="add"
                        flat
                        round
                        @click="showCreateFamilyDialog = true"
                      >
                        <q-tooltip>Create New Family</q-tooltip>
                      </q-btn>
                    </template>
                  </q-select>
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.joined_date"
                    label="Joined Date"
                    outlined
                    type="date"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Custom Attributes -->
          <q-card flat bordered class="q-mt-md" v-if="customAttributes.length > 0">
            <q-card-section>
              <div class="text-h6 q-mb-md">Additional Information</div>
              
              <div class="row q-gutter-md">
                <div 
                  v-for="attribute in customAttributes" 
                  :key="attribute.id"
                  class="col-12 col-md-6"
                >
                  <AttributeValueInput
                    :attribute="attribute"
                    v-model="form.custom_attributes[attribute.key]"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Sidebar -->
        <div class="col-12 col-md-4">
          <!-- Status -->
          <q-card flat bordered>
            <q-card-section>
              <div class="text-h6 q-mb-md">Status</div>
              
              <q-toggle
                v-model="form.is_active"
                label="Active Member"
                color="positive"
              />
              
              <div class="text-caption text-grey-6 q-mt-sm">
                Inactive members won't appear in most lists and reports
              </div>
            </q-card-section>
          </q-card>

          <!-- Actions -->
          <q-card flat bordered class="q-mt-md">
            <q-card-section>
              <div class="text-h6 q-mb-md">Actions</div>
              
              <div class="column q-gutter-sm">
                <q-btn
                  type="submit"
                  color="primary"
                  icon="save"
                  :label="isEditing ? 'Update Member' : 'Create Member'"
                  :loading="membersStore.saving"
                  class="full-width"
                />
                
                <q-btn
                  @click="$router.push('/members')"
                  color="grey-7"
                  icon="cancel"
                  label="Cancel"
                  outline
                  class="full-width"
                />
                
                <q-btn
                  v-if="isEditing"
                  @click="deleteMember"
                  color="negative"
                  icon="delete"
                  label="Delete Member"
                  outline
                  class="full-width"
                />
              </div>
            </q-card-section>
          </q-card>

          <!-- Member Preview -->
          <q-card flat bordered class="q-mt-md" v-if="form.first_name || form.last_name">
            <q-card-section>
              <div class="text-h6 q-mb-md">Preview</div>
              
              <div class="text-center">
                <q-avatar size="64px" color="primary" text-color="white" class="q-mb-sm">
                  {{ getInitials(form.first_name, form.last_name) }}
                </q-avatar>
                <div class="text-h6">
                  {{ form.first_name }} {{ form.last_name }}
                </div>
                <div class="text-caption text-grey-6">
                  {{ getMemberTypeLabel(form.member_type) }}
                </div>
                <q-chip
                  :color="form.is_active ? 'positive' : 'negative'"
                  text-color="white"
                  size="sm"
                  class="q-mt-sm"
                >
                  {{ form.is_active ? 'Active' : 'Inactive' }}
                </q-chip>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-form>
    </div>

    <!-- Create Family Dialog -->
    <q-dialog v-model="showCreateFamilyDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Create New Family</div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="newFamilyName"
            label="Family Name"
            outlined
            autofocus
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="showCreateFamilyDialog = false" />
          <q-btn color="primary" label="Create" @click="createFamily" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useMembersStore } from '@/stores/members'
import { useAttributesStore } from '@/stores/attributes'
import AttributeValueInput from '@/components/members/AttributeValueInput.vue'

// Composables
const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const membersStore = useMembersStore()
const attributesStore = useAttributesStore()

// Local state
const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  date_of_birth: '',
  gender: '',
  address: '',
  member_type: 'member',
  family_id: null as number | null,
  joined_date: '',
  is_active: true,
  custom_attributes: {} as Record<string, any>
})

const familyOptions = ref<Array<{label: string, value: number}>>([])
const loadingFamilies = ref(false)
const showCreateFamilyDialog = ref(false)
const newFamilyName = ref('')

// Computed
const isEditing = computed(() => !!route.params.id && route.params.id !== 'new')
const memberId = computed(() => route.params.id as string)

const memberTypeOptions = computed(() => 
  Object.entries(membersStore.memberTypes).map(([key, label]) => ({
    label,
    value: key
  }))
)

const genderOptions = computed(() => 
  Object.entries(membersStore.genders).map(([key, label]) => ({
    label,
    value: key
  }))
)

const customAttributes = computed(() => attributesStore.attributes)

// Methods
const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
}

const getMemberTypeLabel = (type: string) => {
  return membersStore.memberTypes[type] || type
}

const loadMember = async () => {
  if (!isEditing.value) return

  try {
    const member = await membersStore.fetchMember(memberId.value)
    
    // Populate form with member data
    Object.keys(form.value).forEach(key => {
      if (key === 'custom_attributes') {
        form.value.custom_attributes = member.custom_attributes || {}
      } else if (member[key] !== undefined) {
        (form.value as any)[key] = member[key]
      }
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to load member data'
    })
    router.push('/members')
  }
}

const loadCustomAttributes = async () => {
  try {
    await attributesStore.fetchAttributes()
  } catch (error) {
    console.error('Failed to load custom attributes:', error)
  }
}

const filterFamilies = async (val: string, update: Function) => {
  loadingFamilies.value = true
  
  try {
    // TODO: Implement family search API
    // For now, using mock data
    const mockFamilies = [
      { label: 'Smith Family', value: 1 },
      { label: 'Johnson Family', value: 2 },
      { label: 'Williams Family', value: 3 }
    ]
    
    update(() => {
      familyOptions.value = mockFamilies.filter(family => 
        family.label.toLowerCase().includes(val.toLowerCase())
      )
    })
  } catch (error) {
    console.error('Failed to load families:', error)
  } finally {
    loadingFamilies.value = false
  }
}

const createFamily = async () => {
  if (!newFamilyName.value.trim()) return

  try {
    // TODO: Implement family creation API
    const newFamily = {
      label: newFamilyName.value,
      value: Date.now() // Mock ID
    }
    
    familyOptions.value.push(newFamily)
    form.value.family_id = newFamily.value
    
    $q.notify({
      type: 'positive',
      message: 'Family created successfully'
    })
    
    showCreateFamilyDialog.value = false
    newFamilyName.value = ''
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to create family'
    })
  }
}

const saveMember = async () => {
  try {
    if (isEditing.value) {
      await membersStore.updateMember(memberId.value, form.value)
      $q.notify({
        type: 'positive',
        message: 'Member updated successfully'
      })
    } else {
      await membersStore.createMember(form.value)
      $q.notify({
        type: 'positive',
        message: 'Member created successfully'
      })
    }
    
    router.push('/members')
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: isEditing.value ? 'Failed to update member' : 'Failed to create member'
    })
  }
}

const deleteMember = () => {
  $q.dialog({
    title: 'Confirm Delete',
    message: `Are you sure you want to delete ${form.value.first_name} ${form.value.last_name}?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await membersStore.deleteMember(memberId.value)
      $q.notify({
        type: 'positive',
        message: 'Member deleted successfully'
      })
      router.push('/members')
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Failed to delete member'
      })
    }
  })
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadCustomAttributes(),
    loadMember()
  ])
  
  // Set default joined date for new members
  if (!isEditing.value && !form.value.joined_date) {
    form.value.joined_date = new Date().toISOString().split('T')[0] || ''
  }
})

// Watch for route changes
watch(() => route.params.id, () => {
  if (route.params.id === 'new') {
    // Reset form for new member
    form.value = {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      gender: '',
      address: '',
      member_type: 'member',
      family_id: null,
      joined_date: new Date().toISOString().split('T')[0] || '',
      is_active: true,
      custom_attributes: {}
    }
  } else {
    loadMember()
  }
})
</script>

<style scoped>
.member-form-page {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
