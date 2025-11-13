<template>
  <div class="member-list-view">
    <MemberList
      :members="members"
      @add-member="handleAddMember"
      @edit-member="handleEditMember"
      @delete-member="handleDeleteMember"
      @view-member="handleViewMember"
      @export="handleExport"
      @import="handleImport"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import MemberList from '@/components/members/MemberList.vue'
import { useMembersStore } from '@/stores/members'
import type { Member } from '@/types/member'

const router = useRouter()
const $q = useQuasar()
const membersStore = useMembersStore()

// Convert store members to new format
const members = computed<Member[]>(() => {
  return (membersStore.members || []).map(m => ({
    id: m.id.toString(),
    firstName: m.first_name,
    lastName: m.last_name,
    middleName: undefined,
    photo: undefined,
    dateOfBirth: m.date_of_birth,
    gender: (m.gender || 'other') as Member['gender'],
    contact: {
      phone: m.phone || '',
      email: m.email,
      address: m.address ? {
        street: m.address,
        city: undefined,
        state: undefined,
        country: undefined,
        postalCode: undefined,
      } : undefined,
    },
    membershipNumber: undefined,
    membershipType: 'regular',
    status: m.is_active ? 'active' : 'inactive',
    joinDate: m.joined_date || m.created_at,
    maritalStatus: 'single',
    createdAt: m.created_at,
    updatedAt: m.updated_at,
  }))
})

const handleAddMember = (member: Partial<Member>) => {
  router.push('/members/new')
}

const handleEditMember = (member: Member) => {
  router.push(`/members/${member.id}/edit`)
}

const handleDeleteMember = async (member: Member) => {
  try {
    await membersStore.deleteMember(parseInt(member.id))
    $q.notify({
      type: 'positive',
      message: 'Member deleted successfully',
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to delete member',
    })
  }
}

const handleViewMember = (member: Member) => {
  router.push(`/members/${member.id}`)
}

const handleExport = () => {
  // Export functionality
  console.log('Export members')
}

const handleImport = (members: Partial<Member>[]) => {
  // Import functionality
  console.log('Import members', members)
}

onMounted(async () => {
  try {
    await membersStore.fetchMembers()
  } catch (error) {
    console.error('Failed to load members:', error)
  }
})
</script>

<style scoped>
.member-list-view {
  width: 100%;
  max-width: 100%;
}
</style>
