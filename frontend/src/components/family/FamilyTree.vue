<template>
  <q-card>
    <q-card-section>
      <div class="text-h6 q-mb-md">
        <q-icon name="account_tree" class="q-mr-sm" />
        Family Tree
      </div>

      <div v-if="loading" class="text-center q-pa-lg">
        <q-spinner color="primary" size="3em" />
        <div class="text-body2 q-mt-md">Loading family tree...</div>
      </div>

      <!-- Enhanced Family Tree Visualization -->
      <div v-else-if="treeData.length > 0 || networkNodes.length > 0" class="family-tree-container">
        <!-- Tree View Mode -->
        <div v-if="viewMode === 'tree'" class="tree-view">
          <div
            v-for="(level, levelIndex) in treeData"
            :key="levelIndex"
            class="tree-level"
            :class="`level-${levelIndex}`"
          >
            <div class="level-title text-caption text-grey-7 q-mb-sm">
              {{ getLevelLabel(levelIndex) }}
            </div>
            <div class="tree-nodes row q-gutter-sm justify-center">
              <q-card
                v-for="person in level"
                :key="person.id"
                class="tree-node"
                :class="{ 'primary-relationship': person.is_primary }"
                @click="selectPerson(person)"
              >
                <q-card-section class="q-pa-sm text-center">
                  <q-avatar
                    :color="getPersonColor(person)"
                    text-color="white"
                    size="48px"
                    class="q-mb-xs"
                  >
                    {{ getInitials(person.first_name, person.last_name) }}
                  </q-avatar>
                  <div class="text-body2 text-weight-bold">
                    {{ person.first_name }} {{ person.last_name }}
                  </div>
                  <div class="text-caption text-grey-7">
                    {{ person.relationship_type?.name || 'Member' }}
                  </div>
                  <q-badge
                    v-if="person.custody_type"
                    :color="getCustodyColor(person.custody_type)"
                    size="sm"
                    class="q-mt-xs"
                  >
                    {{ formatCustodyType(person.custody_type) }}
                  </q-badge>
                  <q-chip
                    v-if="person.is_primary"
                    size="xs"
                    color="purple"
                    text-color="white"
                    class="q-mt-xs"
                  >
                    Primary
                  </q-chip>
                </q-card-section>
              </q-card>
            </div>
            <div v-if="levelIndex < treeData.length - 1" class="tree-connector"></div>
          </div>
        </div>

        <!-- Network Graph View -->
        <div v-else-if="viewMode === 'network'" class="network-view">
          <div ref="networkContainer" class="network-canvas"></div>
          <div class="network-legend q-mt-md">
            <div class="row q-gutter-md">
              <div class="col-auto">
                <q-icon name="circle" color="primary" size="sm" />
                <span class="text-caption q-ml-xs">Family Member</span>
              </div>
              <div class="col-auto">
                <q-icon name="circle" color="purple" size="sm" />
                <span class="text-caption q-ml-xs">Primary Relationship</span>
              </div>
              <div class="col-auto">
                <q-icon name="circle" color="orange" size="sm" />
                <span class="text-caption q-ml-xs">Legal/Custody</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Relationship Details Panel -->
        <q-dialog v-model="showPersonDialog" v-if="selectedPerson">
          <q-card style="min-width: 400px">
            <q-card-section>
              <div class="text-h6">{{ selectedPerson.first_name }} {{ selectedPerson.last_name }}</div>
              <div class="text-caption text-grey-7">{{ selectedPerson.relationship_type?.name }}</div>
            </q-card-section>
            <q-card-section>
              <q-list>
                <q-item v-if="selectedPerson.email">
                  <q-item-section avatar>
                    <q-icon name="email" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ selectedPerson.email }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-if="selectedPerson.phone">
                  <q-item-section avatar>
                    <q-icon name="phone" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ selectedPerson.phone }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-if="selectedPerson.custody_type">
                  <q-item-section avatar>
                    <q-icon name="gavel" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label> Custody: {{ formatCustodyType(selectedPerson.custody_type) }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="View Details" color="primary" @click="viewPersonDetails" />
              <q-btn flat label="Close" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>

      <q-banner v-else class="bg-grey-3">
        <div class="text-body2">No family relationships found. Add relationships to visualize the family tree.</div>
      </q-banner>

      <!-- View Mode Toggle -->
      <div v-if="treeData.length > 0" class="q-mt-md text-right">
        <q-btn-toggle
          v-model="viewMode"
          :options="[
            { label: 'Tree View', value: 'tree', icon: 'account_tree' },
            { label: 'Network View', value: 'network', icon: 'hub' }
          ]"
          color="primary"
          size="sm"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRelationshipsStore } from '@/stores/relationships'
import { useRouter } from 'vue-router'

const props = defineProps<{
  memberId: number
  familyId?: number
}>()

const router = useRouter()
const relationshipsStore = useRelationshipsStore()

const loading = ref(false)
const relationships = ref<any[]>([])
const viewMode = ref<'tree' | 'network'>('tree')
const selectedPerson = ref<any>(null)
const showPersonDialog = ref(false)
const networkContainer = ref<HTMLElement | null>(null)
const networkInstance = ref<any>(null)

const treeData = computed(() => {
  if (relationships.value.length === 0) return []

  const levels: any[][] = []
  const processed = new Set<number>()

  // Get current member info (we'll need to fetch this)
  const currentMember = {
    id: props.memberId,
    first_name: 'Current',
    last_name: 'Member',
    relationship_type: { name: 'Self' },
    is_primary: true
  }

  // Level 0: Current member (center)
  levels.push([currentMember])
  processed.add(props.memberId)

  // Level 1: Primary relationships (spouse, head of household)
  const primary = relationships.value
    .filter(r => (r.is_primary || r.relationship_type?.slug === 'spouse') && r.status === 'active')
    .map(r => ({
      ...(r.person1_id === props.memberId ? r.person2 : r.person1),
      relationship_type: r.relationship_type,
      is_primary: r.is_primary,
      custody_type: r.custody_type,
      relationship_id: r.id
    }))
    .filter(p => p.id && !processed.has(p.id))

  if (primary.length > 0) {
    levels.push(primary)
    primary.forEach(p => processed.add(p.id))
  }

  // Level 2: Children and parents
  const children = relationships.value
    .filter(r => {
      const other = r.person1_id === props.memberId ? r.person2_id : r.person1_id
      return !processed.has(other) && 
             r.status === 'active' &&
             (r.relationship_type?.slug === 'child' || r.relationship_type?.slug === 'parent')
    })
    .map(r => ({
      ...(r.person1_id === props.memberId ? r.person2 : r.person1),
      relationship_type: r.relationship_type,
      custody_type: r.custody_type,
      relationship_id: r.id
    }))

  if (children.length > 0) {
    levels.push(children)
  }

  // Level 3: Extended family (siblings, grandparents, etc.)
  const extended = relationships.value
    .filter(r => {
      const other = r.person1_id === props.memberId ? r.person2_id : r.person1_id
      return !processed.has(other) && r.status === 'active'
    })
    .slice(0, 10) // Limit extended family display
    .map(r => ({
      ...(r.person1_id === props.memberId ? r.person2 : r.person1),
      relationship_type: r.relationship_type,
      custody_type: r.custody_type,
      relationship_id: r.id
    }))

  if (extended.length > 0) {
    levels.push(extended)
  }

  return levels
})

// Network graph nodes and edges
const networkNodes = computed(() => {
  if (relationships.value.length === 0) return []

  const nodes = []
  const nodeMap = new Map<number, any>()

  // Add current member as center node
  nodes.push({
    id: props.memberId,
    label: 'Current Member',
    color: { background: '#1976d2', border: '#1565c0' },
    shape: 'box',
    font: { color: 'white', bold: true }
  })
  nodeMap.set(props.memberId, { id: props.memberId, first_name: 'Current', last_name: 'Member' })

  // Add all related members as nodes
  relationships.value.forEach(r => {
    const otherId = r.person1_id === props.memberId ? r.person2_id : r.person1_id
    const other = r.person1_id === props.memberId ? r.person2 : r.person1

    if (other && other.id && !nodeMap.has(other.id)) {
      const nodeColor = r.is_primary 
        ? { background: '#9c27b0', border: '#7b1fa2' } // Purple for primary
        : r.custody_type
        ? { background: '#ff9800', border: '#f57c00' } // Orange for legal
        : { background: '#4caf50', border: '#388e3c' } // Green for regular

      nodes.push({
        id: other.id,
        label: `${other.first_name || ''} ${other.last_name || ''}`.trim() || 'Unknown',
        color: nodeColor,
        shape: 'ellipse',
        title: `${other.first_name} ${other.last_name}\n${r.relationship_type?.name || ''}`,
        memberData: other,
        relationshipData: r
      })
      nodeMap.set(other.id, other)
    }
  })

  return nodes
})

const networkEdges = computed(() => {
  return relationships.value
    .filter(r => r.status === 'active')
    .map(r => ({
      from: r.person1_id === props.memberId ? props.memberId : r.person1_id,
      to: r.person1_id === props.memberId ? r.person2_id : props.memberId,
      label: r.relationship_type?.name || '',
      color: { color: r.is_primary ? '#9c27b0' : '#757575' },
      width: r.is_primary ? 3 : 2,
      dashes: r.custody_type ? true : false
    }))
})

const getInitials = (firstName?: string, lastName?: string): string => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
}

const getPersonColor = (person: any): string => {
  if (person.is_primary) return 'purple'
  if (person.custody_type) return 'orange'
  return 'primary'
}

const getLevelLabel = (index: number): string => {
  const labels = ['Current Member', 'Primary Relationships', 'Family Members', 'Extended Family']
  return labels[index] || `Level ${index + 1}`
}

const formatCustodyType = (type: string): string => {
  const types: Record<string, string> = {
    'full': 'Full Custody',
    'joint': 'Joint Custody',
    'partial': 'Partial Custody',
    'none': 'No Custody'
  }
  return types[type] || type
}

const getCustodyColor = (type: string): string => {
  const colors: Record<string, string> = {
    'full': 'green',
    'joint': 'blue',
    'partial': 'orange',
    'none': 'grey'
  }
  return colors[type] || 'grey'
}

const selectPerson = (person: any) => {
  selectedPerson.value = person
  showPersonDialog.value = true
}

const viewPersonDetails = () => {
  if (selectedPerson.value?.id) {
    router.push(`/members/${selectedPerson.value.id}`)
  }
}

const loadRelationships = async () => {
  loading.value = true
  try {
    relationships.value = await relationshipsStore.fetchMemberRelationships(props.memberId)
    
    // Initialize network view if we have nodes and container is ready
    if (viewMode.value === 'network' && networkNodes.value.length > 0) {
      await nextTick()
      initializeNetwork()
    }
  } catch (error) {
    console.error('Failed to load relationships:', error)
  } finally {
    loading.value = false
  }
}

const initializeNetwork = async () => {
  if (!networkContainer.value || networkNodes.value.length === 0) return

  try {
    // Dynamic import of vis-network for better performance
    const { Network } = await import('vis-network/standalone')
    
    const data = {
      nodes: networkNodes.value,
      edges: networkEdges.value
    }

    const options = {
      nodes: {
        shape: 'ellipse',
        font: {
          size: 14,
          face: 'Arial'
        },
        borderWidth: 2,
        shadow: true
      },
      edges: {
        arrows: {
          to: { enabled: false },
          from: { enabled: false }
        },
        font: {
          size: 12,
          align: 'middle'
        },
        smooth: {
          type: 'continuous',
          roundness: 0.5
        }
      },
      physics: {
        enabled: true,
        stabilization: {
          enabled: true,
          iterations: 100
        }
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        selectConnectedEdges: true
      }
    }

    networkInstance.value = new Network(networkContainer.value, data, options)

    // Handle node click
    networkInstance.value.on('click', (params: any) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0]
        const node = networkNodes.value.find((n: any) => n.id === nodeId)
        if (node?.memberData) {
          selectPerson(node.memberData)
        }
      }
    })
  } catch (error) {
    console.warn('vis-network not available, falling back to tree view:', error)
    viewMode.value = 'tree'
  }
}

// Watch for view mode changes
watch(viewMode, async (newMode) => {
  if (newMode === 'network' && networkNodes.value.length > 0) {
    await nextTick()
    initializeNetwork()
  }
})

// Watch for relationship changes
watch(() => relationships.value.length, async () => {
  if (viewMode.value === 'network' && networkNodes.value.length > 0) {
    await nextTick()
    initializeNetwork()
  }
})

onMounted(async () => {
  await loadRelationships()
})

onUnmounted(() => {
  if (networkInstance.value) {
    networkInstance.value.destroy()
  }
})
</script>

<style scoped lang="sass">
.family-tree-container
  padding: 16px
  min-height: 400px

.tree-view
  .tree-level
    margin-bottom: 32px
    position: relative

    &:not(:last-child)::after
      content: ''
      display: block
      width: 2px
      height: 32px
      background: linear-gradient(to bottom, #e0e0e0, transparent)
      margin: 0 auto

.tree-nodes
  display: flex
  flex-wrap: wrap
  gap: 12px
  justify-content: center

.tree-node
  min-width: 120px
  max-width: 150px
  transition: transform 0.2s, box-shadow 0.2s
  cursor: pointer

  &:hover
    transform: scale(1.05)
    box-shadow: 0 4px 12px rgba(0,0,0,0.15)

  &.primary-relationship
    border: 2px solid var(--q-primary)

.tree-connector
  width: 2px
  height: 24px
  background: #e0e0e0
  margin: 0 auto 8px

.network-view
  position: relative
  width: 100%
  height: 500px
  border: 1px solid #e0e0e0
  border-radius: 4px
  overflow: hidden

.network-canvas
  width: 100%
  height: 100%

.network-legend
  padding: 8px
  background: #f5f5f5
  border-radius: 4px

.level-title
  text-align: center
  font-weight: 500
  margin-bottom: 12px
</style>
