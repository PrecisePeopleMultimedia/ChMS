<template>
  <q-card>
    <q-card-section>
      <div class="text-h6 q-mb-md">
        <q-icon name="home_work" class="q-mr-sm" />
        Household vs Family Management
      </div>

      <!-- Explanation Section -->
      <q-banner class="bg-info text-white q-mb-md" rounded>
        <template v-slot:avatar>
          <q-icon name="info" />
        </template>
        <div class="text-body2">
          <strong>Family:</strong> Blood relations, marriages, adoptions (genealogical)<br>
          <strong>Household:</strong> People living together (residential)
        </div>
      </q-banner>

      <!-- Member's Current Status -->
      <div class="row q-gutter-md q-mb-lg">
        <div class="col-md-5 col-12">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-subtitle1 text-primary q-mb-sm">
                <q-icon name="people" class="q-mr-xs" />
                Family Connections
              </div>
              <div v-if="memberFamily">
                <div class="text-body2 q-mb-sm">
                  <strong>{{ memberFamily.family_name }}</strong>
                </div>
                <div class="text-caption text-grey-7">
                  {{ familyRelationships.length }} relationship(s)
                </div>
                <q-list dense class="q-mt-sm">
                  <q-item
                    v-for="rel in familyRelationships.slice(0, 3)"
                    :key="rel.id"
                    dense
                  >
                    <q-item-section>
                      <q-item-label caption>
                        {{ getOtherPersonName(rel) }} - {{ rel.relationship_type?.name }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-if="familyRelationships.length > 3" dense>
                    <q-item-section>
                      <q-item-label caption class="text-primary">
                        +{{ familyRelationships.length - 3 }} more...
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
              <div v-else class="text-grey-7">
                No family assigned
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-md-5 col-12">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-subtitle1 text-secondary q-mb-sm">
                <q-icon name="home" class="q-mr-xs" />
                Household Memberships
              </div>
              <div v-if="memberHouseholds.length > 0">
                <q-list dense>
                  <q-item
                    v-for="household in memberHouseholds"
                    :key="household.id"
                    dense
                  >
                    <q-item-section>
                      <q-item-label>{{ household.name }}</q-item-label>
                      <q-item-label caption>
                        {{ household.pivot?.role || 'Resident' }} • 
                        {{ household.pivot?.residency_status || 'Permanent' }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-chip
                        size="sm"
                        :color="getHouseholdTypeColor(household.household_type)"
                        text-color="white"
                      >
                        {{ household.household_type }}
                      </q-chip>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
              <div v-else class="text-grey-7">
                No household memberships
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="row q-gutter-sm">
        <q-btn
          color="primary"
          icon="people"
          label="Manage Family"
          @click="$emit('manage-family')"
        />
        <q-btn
          color="secondary"
          icon="home"
          label="Manage Households"
          @click="$emit('manage-households')"
        />
        <q-btn
          color="accent"
          icon="account_tree"
          label="View Family Tree"
          @click="$emit('view-family-tree')"
        />
        <q-btn
          color="info"
          icon="map"
          label="Relationship Map"
          @click="$emit('view-relationship-map')"
        />
      </div>

      <!-- Complex Relationships Indicator -->
      <div v-if="hasComplexRelationships" class="q-mt-md">
        <q-banner class="bg-warning text-dark" rounded>
          <template v-slot:avatar>
            <q-icon name="warning" />
          </template>
          <div class="text-body2">
            <strong>Complex Relationships Detected:</strong>
            This member has relationships that span multiple families or households.
            <q-btn
              flat
              dense
              color="primary"
              label="Review"
              @click="$emit('review-complex-relationships')"
              class="q-ml-sm"
            />
          </div>
        </q-banner>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  memberId: number
  memberFamily?: any
  familyRelationships: any[]
  memberHouseholds: any[]
}

const props = defineProps<Props>()

defineEmits<{
  'manage-family': []
  'manage-households': []
  'view-family-tree': []
  'view-relationship-map': []
  'review-complex-relationships': []
}>()

const hasComplexRelationships = computed(() => {
  // Check if member has relationships across multiple families
  const familyIds = new Set(props.familyRelationships.map(r => r.family_id))
  const hasMultipleFamilies = familyIds.size > 1

  // Check if member has multiple household memberships
  const hasMultipleHouseholds = props.memberHouseholds.length > 1

  // Check for custody relationships
  const hasCustodyRelationships = props.familyRelationships.some(r => r.custody_type)

  return hasMultipleFamilies || hasMultipleHouseholds || hasCustodyRelationships
})

const getOtherPersonName = (relationship: any) => {
  const otherPerson = relationship.person1_id === props.memberId 
    ? relationship.person2 
    : relationship.person1
  return otherPerson ? `${otherPerson.first_name} ${otherPerson.last_name}` : 'Unknown'
}

const getHouseholdTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    primary: 'primary',
    secondary: 'secondary',
    temporary: 'orange'
  }
  return colors[type] || 'grey'
}
</script>

<style scoped lang="sass">
.q-card
  .q-card-section
    .text-h6
      font-weight: 600
</style>
