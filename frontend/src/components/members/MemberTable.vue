<template>
  <div class="rounded-md border">
    <q-table
      :rows="sortedMembers"
      :columns="columns"
      :selected="selectedRows"
      selection="multiple"
      @update:selected="handleSelectionChange"
      row-key="id"
      flat
      :loading="loading"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-if="onSelectionChange" auto-width>
            <q-checkbox
              :model-value="allSelected"
              :indeterminate-value="someSelected"
              @update:model-value="toggleAll"
            />
          </q-th>
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            :class="{ 'cursor-pointer': sortable }"
            @click="sortable && col.sortable !== false ? handleSort(col.name as SortField) : null"
          >
            <div class="flex items-center gap-2">
              {{ col.label }}
              <q-icon
                v-if="sortable && col.sortable !== false"
                :name="getSortIcon(col.name as SortField)"
                class="h-4 w-4"
              />
            </div>
          </q-th>
          <q-th auto-width>Actions</q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props" :class="{ 'cursor-pointer': onMemberClick }" @click="onMemberClick?.(props.row)">
          <q-td v-if="onSelectionChange" auto-width>
            <q-checkbox
              :model-value="selectedIds.includes(props.row.id)"
              @update:model-value="toggleMember(props.row.id)"
              @click.stop
            />
          </q-td>
          <q-td>
            <div class="flex items-center gap-3">
              <q-avatar size="40px">
                <img v-if="props.row.photo" :src="props.row.photo" :alt="getFullName(props.row)" />
                <div v-else class="bg-primary/10 text-primary flex items-center justify-center h-full w-full text-sm">
                  {{ getInitials(props.row) }}
                </div>
              </q-avatar>
              <div>
                <div class="font-medium">{{ getFullName(props.row) }}</div>
                <div class="text-sm text-muted-foreground">
                  {{ props.row.membershipNumber || 'No membership #' }}
                </div>
              </div>
            </div>
          </q-td>
          <q-td>
            <ModernBadge
              variant="outline"
              :class="statusColors[props.row.status]"
            >
              {{ props.row.status }}
            </ModernBadge>
          </q-td>
          <q-td class="text-muted-foreground">
            {{ formatDate(props.row.joinDate) }}
          </q-td>
          <q-td>
            <div v-if="props.row.attendancePercentage !== undefined" class="flex items-center gap-2">
              <div class="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  class="h-full bg-primary transition-all"
                  :style="{ width: `${props.row.attendancePercentage}%` }"
                />
              </div>
              <span class="text-sm text-muted-foreground">{{ props.row.attendancePercentage }}%</span>
            </div>
            <span v-else class="text-muted-foreground">—</span>
          </q-td>
          <q-td>
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <q-icon v-if="props.row.contact.phone" name="phone" class="h-3 w-3" />
              <q-icon v-if="props.row.contact.email" name="mail" class="h-3 w-3" />
            </div>
          </q-td>
          <q-td auto-width>
            <q-btn
              flat
              round
              dense
              icon="more_horiz"
              size="sm"
              @click.stop="showActionMenu[props.row.id] = !showActionMenu[props.row.id]"
            >
              <q-menu v-model="showActionMenu[props.row.id]" @click.stop>
                <q-list dense>
                  <q-item clickable @click="handleView(props.row)">
                    <q-item-section avatar>
                      <q-icon name="person" />
                    </q-item-section>
                    <q-item-section>View</q-item-section>
                  </q-item>
                  <q-item clickable @click="handleEdit(props.row)">
                    <q-item-section>Edit</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable @click="handleDelete(props.row)" class="text-destructive">
                    <q-item-section>Delete</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ModernBadge from '@/components/ui/ModernBadge.vue'
import type { Member } from '@/types/member'

type SortField = 'name' | 'joinDate' | 'status' | 'attendance'
type SortDirection = 'asc' | 'desc'

interface Props {
  members: Member[]
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  onMemberClick?: (member: Member) => void
  onEdit?: (member: Member) => void
  onDelete?: (member: Member) => void
  sortable?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selectedIds: () => [],
  sortable: true,
  loading: false
})

const emit = defineEmits<{
  'update:selectedIds': [ids: string[]]
}>()

const sortField = ref<SortField>('name')
const sortDirection = ref<SortDirection>('asc')
const showActionMenu = ref<Record<string, boolean>>({})

const columns = [
  { name: 'name', label: 'Name', field: 'name', sortable: true, align: 'left' as const },
  { name: 'status', label: 'Status', field: 'status', sortable: true, align: 'left' as const },
  { name: 'joinDate', label: 'Join Date', field: 'joinDate', sortable: true, align: 'left' as const },
  { name: 'attendance', label: 'Attendance', field: 'attendance', sortable: true, align: 'left' as const },
  { name: 'contact', label: 'Contact', field: 'contact', sortable: false, align: 'left' as const },
]

const allSelected = computed(() => {
  return props.members.length > 0 && props.selectedIds.length === props.members.length
})

const someSelected = computed(() => {
  return props.selectedIds.length > 0 && props.selectedIds.length < props.members.length
})

const selectedRows = computed(() => {
  return props.members.filter(m => props.selectedIds.includes(m.id))
})

const sortedMembers = computed(() => {
  if (!props.sortable) return props.members

  return [...props.members].sort((a, b) => {
    let comparison = 0

    switch (sortField.value) {
      case 'name':
        comparison = `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`
        )
        break
      case 'joinDate':
        comparison = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime()
        break
      case 'status':
        comparison = a.status.localeCompare(b.status)
        break
      case 'attendance':
        comparison = (a.attendancePercentage || 0) - (b.attendancePercentage || 0)
        break
    }

    return sortDirection.value === 'asc' ? comparison : -comparison
  })
})

const statusColors: Record<Member['status'], string> = {
  active: 'bg-success/10 text-success border-success/20',
  inactive: 'bg-muted text-muted-foreground border-border',
  visitor: 'bg-info/10 text-info border-info/20',
  alumni: 'bg-accent/10 text-accent border-accent/20',
}

const handleSort = (field: SortField) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const getSortIcon = (field: SortField): string => {
  if (sortField.value !== field) return 'unfold_more'
  return sortDirection.value === 'asc' ? 'arrow_upward' : 'arrow_downward'
}

const toggleAll = () => {
  if (allSelected.value) {
    props.onSelectionChange?.([])
  } else {
    props.onSelectionChange?.(props.members.map(m => m.id))
  }
}

const toggleMember = (id: string) => {
  const newSelection = props.selectedIds.includes(id)
    ? props.selectedIds.filter(sid => sid !== id)
    : [...props.selectedIds, id]
  props.onSelectionChange?.(newSelection)
}

const getInitials = (member: Member): string => {
  return `${member.firstName[0]}${member.lastName[0]}`.toUpperCase()
}

const getFullName = (member: Member): string => {
  return `${member.firstName} ${member.lastName}`
}

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const handleView = (member: Member) => {
  showActionMenu.value[member.id] = false
  props.onMemberClick?.(member)
}

const handleEdit = (member: Member) => {
  showActionMenu.value[member.id] = false
  props.onEdit?.(member)
}

const handleDelete = (member: Member) => {
  showActionMenu.value[member.id] = false
  props.onDelete?.(member)
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>

