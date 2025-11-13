<template>
  <div class="space-y-6">
    <!-- Header with Actions -->
    <PageHeader title="Members">
      <template #action>
        <div class="flex items-center gap-2">
          <ModernButton
            v-if="onImport"
            variant="outline"
            size="sm"
            @click="showImportDialog = true"
            class="gap-2"
          >
            <q-icon name="upload" class="h-4 w-4" />
            Import
          </ModernButton>
          <ModernButton
            v-if="onExport"
            variant="outline"
            size="sm"
            @click="showExportDialog = true"
            class="gap-2"
          >
            <q-icon name="download" class="h-4 w-4" />
            Export
          </ModernButton>
          <ModernButton
            v-if="onAddMember"
            size="sm"
            @click="showAddForm = true"
            class="gap-2"
          >
            <q-icon name="add" class="h-4 w-4" />
            Add Member
          </ModernButton>
        </div>
      </template>

      <!-- Stats badges -->
      <div class="bg-[#0F0F12] rounded-lg border border-border/50 p-4">
        <div class="flex items-center gap-2">
          <ModernBadge variant="secondary">{{ stats.total }} Total</ModernBadge>
          <ModernBadge variant="outline" class="bg-success/10 text-success border-success/20">
            {{ stats.active }} Active
          </ModernBadge>
          <ModernBadge variant="outline" class="bg-info/10 text-info border-info/20">
            {{ stats.visitors }} Visitors
          </ModernBadge>
          <ModernBadge
            v-if="stats.selected > 0"
            variant="outline"
            class="bg-primary/10 text-primary border-primary/20"
          >
            {{ stats.selected }} Selected
          </ModernBadge>
        </div>
      </div>
    </PageHeader>

    <!-- Search and View Controls -->
    <div class="flex flex-col md:flex-row items-start md:items-center gap-4">
      <div class="relative flex-1">
        <q-icon name="search" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <ModernInput
          v-model="quickSearch"
          placeholder="Quick search by name, email, or phone..."
          class="pl-9 pr-9"
        >
          <template #rightIcon>
            <q-btn
              v-if="quickSearch"
              flat
              round
              dense
              icon="close"
              size="sm"
              @click="quickSearch = ''"
            />
          </template>
        </ModernInput>
      </div>

      <div class="flex items-center gap-2">
        <!-- Advanced Filters (Mobile Sheet) -->
        <ModernButton
          variant="outline"
          size="sm"
          @click="showFilters = true"
          class="gap-2"
        >
          <q-icon name="tune" class="h-4 w-4" />
          Filters
          <ModernBadge
            v-if="activeFilterCount > 0"
            variant="secondary"
            class="ml-1"
          >
            {{ activeFilterCount }}
          </ModernBadge>
        </ModernButton>

        <!-- View Mode Toggle -->
        <ModernTabs
          :model-value="viewMode"
          :tabs="[
            { value: 'grid', label: 'Grid', icon: 'grid_view' },
            { value: 'table', label: 'Table', icon: 'view_list' }
          ]"
          @update:model-value="viewMode = $event"
        />
      </div>
    </div>

    <!-- Member List/Grid -->
    <div v-if="filteredMembers.length === 0" class="text-center py-12 border rounded-lg bg-muted/20">
      <p class="text-muted-foreground mb-4">No members found</p>
      <ModernButton
        v-if="quickSearch || hasActiveFilters"
        variant="outline"
        @click="resetFilters"
      >
        Clear Filters
      </ModernButton>
      <ModernButton
        v-else-if="onAddMember"
        @click="showAddForm = true"
        class="gap-2"
      >
        <q-icon name="add" class="h-4 w-4" />
        Add Your First Member
      </ModernButton>
    </div>

    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <MemberCard
        v-for="member in filteredMembers"
        :key="member.id"
        :member="member"
        @click="handleViewMember"
        @edit="onEditMember"
        @delete="onDeleteMember"
      />
    </div>

    <div v-else class="relative">
      <MemberTable
        :members="filteredMembers"
        :selected-ids="selectedIds"
        @update:selected-ids="selectedIds = $event"
        @member-click="handleViewMember"
        @edit="onEditMember"
        @delete="onDeleteMember"
      />
    </div>

    <!-- Filters Dialog -->
    <q-dialog v-model="showFilters">
      <q-card class="w-[320px]">
        <q-card-section>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <q-icon name="tune" class="h-5 w-5" />
              <h3 class="text-lg font-semibold">Filters</h3>
              <ModernBadge v-if="activeFilterCount > 0" variant="secondary">
                {{ activeFilterCount }}
              </ModernBadge>
            </div>
            <q-btn
              v-if="hasActiveFilters"
              flat
              round
              dense
              icon="close"
              size="sm"
              @click="resetFilters"
            />
          </div>
          <p v-if="resultCount !== undefined" class="text-sm text-muted-foreground mb-4">
            {{ resultCount }} {{ resultCount === 1 ? 'result' : 'results' }}
          </p>
          <!-- Filter content would go here - simplified for now -->
          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium mb-2 block">Status</label>
              <div class="space-y-2">
                <q-checkbox
                  v-for="status in ['active', 'inactive', 'visitor', 'alumni']"
                  :key="status"
                  :label="status"
                  :model-value="filters.status?.includes(status)"
                  @update:model-value="toggleArrayFilter('status', status)"
                />
              </div>
            </div>
            <!-- More filters can be added here -->
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <ModernButton variant="outline" @click="showFilters = false">
            Close
          </ModernButton>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import MemberCard from './MemberCard.vue'
import MemberTable from './MemberTable.vue'
import ModernButton from '@/components/ui/ModernButton.vue'
import ModernInput from '@/components/ui/ModernInput.vue'
import ModernBadge from '@/components/ui/ModernBadge.vue'
import ModernTabs from '@/components/ui/ModernTabs.vue'
import type { Member, MemberFilters } from '@/types/member'

type ViewMode = 'grid' | 'table'

interface Props {
  members: Member[]
  onAddMember?: (member: Partial<Member>) => void
  onEditMember?: (member: Member) => void
  onDeleteMember?: (member: Member) => void
  onViewMember?: (member: Member) => void
  onExport?: () => void
  onImport?: (members: Partial<Member>[]) => void
}

const props = defineProps<Props>()

const viewMode = ref<ViewMode>('grid')
const selectedIds = ref<string[]>([])
const filters = ref<MemberFilters>({})
const quickSearch = ref('')
const showFilters = ref(false)
const showAddForm = ref(false)
const showImportDialog = ref(false)
const showExportDialog = ref(false)

// Filter members
const filteredMembers = computed(() => {
  return props.members.filter((member) => {
    // Quick search
    if (quickSearch.value) {
      const search = quickSearch.value.toLowerCase()
      const fullName = `${member.firstName} ${member.lastName}`.toLowerCase()
      const email = member.contact.email?.toLowerCase() || ''
      const phone = member.contact.phone?.toLowerCase() || ''
      
      if (
        !fullName.includes(search) &&
        !email.includes(search) &&
        !phone.includes(search)
      ) {
        return false
      }
    }

    // Status filter
    if (filters.value.status && filters.value.status.length > 0) {
      if (!filters.value.status.includes(member.status)) return false
    }

    // Gender filter
    if (filters.value.gender && filters.value.gender.length > 0) {
      if (!filters.value.gender.includes(member.gender)) return false
    }

    return true
  })
})

const stats = computed(() => {
  return {
    total: filteredMembers.value.length,
    active: filteredMembers.value.filter(m => m.status === 'active').length,
    visitors: filteredMembers.value.filter(m => m.status === 'visitor').length,
    selected: selectedIds.value.length,
  }
})

const hasActiveFilters = computed(() => {
  return Object.entries(filters.value).some(([key, value]) => {
    if (key === 'search') return false
    if (Array.isArray(value)) return value.length > 0
    return value !== undefined && value !== null && value !== ''
  })
})

const activeFilterCount = computed(() => {
  return Object.entries(filters.value).reduce((count, [key, value]) => {
    if (key === 'search') return count
    if (Array.isArray(value)) return count + value.length
    return value !== undefined && value !== null && value !== '' ? count + 1 : count
  }, 0)
})

const resultCount = computed(() => filteredMembers.value.length)

const resetFilters = () => {
  filters.value = {}
  quickSearch.value = ''
}

const toggleArrayFilter = <K extends keyof MemberFilters>(
  key: K,
  value: string
) => {
  const current = (filters.value[key] as string[]) || []
  const updated = current.includes(value)
    ? current.filter(v => v !== value)
    : [...current, value]
  filters.value = { ...filters.value, [key]: updated as MemberFilters[K] }
}

const handleViewMember = (member: Member) => {
  props.onViewMember?.(member)
}
</script>

