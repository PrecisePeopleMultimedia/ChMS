<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <ModernButton variant="ghost" @click="onBack" class="gap-2">
        <q-icon name="arrow_back" class="h-4 w-4" />
        Back to Members
      </ModernButton>

      <div class="flex items-center gap-2">
        <ModernButton variant="outline" @click="onMessage?.(member)" class="gap-2">
          <q-icon name="message" class="h-4 w-4" />
          Message
        </ModernButton>
        <ModernButton variant="outline" @click="onEdit?.(member)" class="gap-2">
          <q-icon name="edit" class="h-4 w-4" />
          Edit
        </ModernButton>
        <ModernButton variant="outline" class="gap-2">
          <q-icon name="download" class="h-4 w-4" />
          Export
        </ModernButton>
        <ModernButton
          variant="outline"
          @click="onDelete?.(member)"
          class="gap-2 text-destructive hover:text-destructive"
        >
          <q-icon name="delete" class="h-4 w-4" />
          Delete
        </ModernButton>
      </div>
    </div>

    <!-- Profile Header Card -->
    <ModernCard>
      <ModernCardContent class="pt-6">
        <div class="flex flex-col md:flex-row gap-6">
          <!-- Avatar and Basic Info -->
          <div class="flex flex-col items-center md:items-start gap-4">
            <q-avatar size="128px">
              <img v-if="member.photo" :src="member.photo" :alt="fullName" />
              <div v-else class="bg-primary/10 text-primary text-3xl flex items-center justify-center h-full w-full">
                {{ initials }}
              </div>
            </q-avatar>

            <div class="flex flex-wrap justify-center md:justify-start gap-2">
              <ModernBadge variant="outline" :class="statusColors[member.status]">
                {{ member.status }}
              </ModernBadge>
              <ModernBadge variant="outline" class="capitalize">
                {{ member.gender }}
              </ModernBadge>
              <ModernBadge
                v-if="member.ministries && member.ministries.length > 0"
                variant="secondary"
              >
                {{ member.ministries.length }} Ministries
              </ModernBadge>
            </div>
          </div>

          <!-- Main Info -->
          <div class="flex-1 space-y-4">
            <div>
              <h1 class="text-3xl mb-1">{{ fullName }}</h1>
              <p class="text-muted-foreground">
                Member #{{ member.membershipNumber || 'N/A' }}
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div v-if="member.contact.email" class="flex items-center gap-2">
                <q-icon name="mail" class="h-4 w-4 text-muted-foreground" />
                <a
                  :href="`mailto:${member.contact.email}`"
                  class="text-primary hover:underline"
                >
                  {{ member.contact.email }}
                </a>
              </div>

              <div v-if="member.contact.phone" class="flex items-center gap-2">
                <q-icon name="phone" class="h-4 w-4 text-muted-foreground" />
                <a
                  :href="`tel:${member.contact.phone}`"
                  class="text-primary hover:underline"
                >
                  {{ member.contact.phone }}
                </a>
              </div>

              <div class="flex items-center gap-2">
                <q-icon name="event" class="h-4 w-4 text-muted-foreground" />
                <span>Joined {{ formatDate(member.joinDate) }}</span>
              </div>

              <div v-if="member.dateOfBirth" class="flex items-center gap-2">
                <q-icon name="people" class="h-4 w-4 text-muted-foreground" />
                <span>{{ getAge(member.dateOfBirth) }} years old</span>
              </div>

              <div
                v-if="member.contact.address"
                class="flex items-center gap-2 md:col-span-2"
              >
                <q-icon name="place" class="h-4 w-4 text-muted-foreground" />
                <span>
                  {{ member.contact.address.street ? `${member.contact.address.street}, ` : '' }}
                  {{ member.contact.address.city }}, {{ member.contact.address.state }}
                  {{ member.contact.address.postalCode }}
                  {{ member.contact.address.country ? `, ${member.contact.address.country}` : '' }}
                </span>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="flex gap-6 pt-4">
              <div v-if="member.attendancePercentage !== undefined" class="text-center">
                <div class="flex items-center gap-1 text-2xl text-primary">
                  <q-icon name="favorite" class="h-5 w-5" />
                  {{ member.attendancePercentage }}%
                </div>
                <div class="text-xs text-muted-foreground">Attendance</div>
              </div>

              <div v-if="member.ministries" class="text-center">
                <div class="text-2xl text-primary">
                  {{ member.ministries.length }}
                </div>
                <div class="text-xs text-muted-foreground">Ministries</div>
              </div>

              <div class="text-center">
                <div class="text-2xl text-primary">
                  <q-icon v-if="member.status === 'active'" name="check_circle" class="h-6 w-6" />
                  <span v-else>—</span>
                </div>
                <div class="text-xs text-muted-foreground">Status</div>
              </div>
            </div>
          </div>
        </div>
      </ModernCardContent>
    </ModernCard>

    <!-- Tabs Content -->
    <ModernTabs
      :model-value="activeTab"
      :tabs="[
        { name: 'overview', label: 'Overview' },
        { name: 'family', label: 'Family' },
        { name: 'ministries', label: 'Ministries' },
        { name: 'attendance', label: 'Attendance' },
        { name: 'giving', label: 'Giving' },
        { name: 'activity', label: 'Activity' },
      ]"
      @update:model-value="activeTab = $event"
    >
      <!-- Overview Tab -->
      <template #panel-overview>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Personal Information -->
          <ModernCard>
            <ModernCardHeader>
              <ModernCardTitle class="flex items-center gap-2">
                <q-icon name="people" class="h-5 w-5" />
                Personal Information
              </ModernCardTitle>
            </ModernCardHeader>
            <ModernCardContent class="space-y-3 text-sm">
              <div>
                <div class="text-muted-foreground">Full Name</div>
                <div>{{ fullName }}</div>
              </div>
              <div class="h-px bg-border" />
              <div>
                <div class="text-muted-foreground">Date of Birth</div>
                <div>
                  {{ formatDate(member.dateOfBirth) }}
                  <span v-if="member.dateOfBirth"> ({{ getAge(member.dateOfBirth) }} years old)</span>
                </div>
              </div>
              <div class="h-px bg-border" />
              <div>
                <div class="text-muted-foreground">Gender</div>
                <div class="capitalize">{{ member.gender }}</div>
              </div>
              <div class="h-px bg-border" />
              <div>
                <div class="text-muted-foreground">Marital Status</div>
                <div class="capitalize">{{ member.maritalStatus || 'Not specified' }}</div>
              </div>
            </ModernCardContent>
          </ModernCard>

          <!-- Contact Information -->
          <ModernCard>
            <ModernCardHeader>
              <ModernCardTitle class="flex items-center gap-2">
                <q-icon name="mail" class="h-5 w-5" />
                Contact Information
              </ModernCardTitle>
            </ModernCardHeader>
            <ModernCardContent class="space-y-3 text-sm">
              <div>
                <div class="text-muted-foreground">Email</div>
                <div>
                  <a
                    v-if="member.contact.email"
                    :href="`mailto:${member.contact.email}`"
                    class="text-primary hover:underline"
                  >
                    {{ member.contact.email }}
                  </a>
                  <span v-else>Not provided</span>
                </div>
              </div>
              <div class="h-px bg-border" />
              <div>
                <div class="text-muted-foreground">Phone</div>
                <div>
                  <a
                    v-if="member.contact.phone"
                    :href="`tel:${member.contact.phone}`"
                    class="text-primary hover:underline"
                  >
                    {{ member.contact.phone }}
                  </a>
                  <span v-else>Not provided</span>
                </div>
              </div>
              <div class="h-px bg-border" />
              <div>
                <div class="text-muted-foreground">Address</div>
                <div>
                  <template v-if="member.contact.address">
                    <div v-if="member.contact.address.street">
                      {{ member.contact.address.street }}<br />
                    </div>
                    {{ member.contact.address.city }}, {{ member.contact.address.state }}
                    {{ member.contact.address.postalCode }}
                    <div v-if="member.contact.address.country">
                      <br />{{ member.contact.address.country }}
                    </div>
                  </template>
                  <span v-else>Not provided</span>
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>

          <!-- Membership Information -->
          <ModernCard>
            <ModernCardHeader>
              <ModernCardTitle class="flex items-center gap-2">
                <q-icon name="event" class="h-5 w-5" />
                Membership Information
              </ModernCardTitle>
            </ModernCardHeader>
            <ModernCardContent class="space-y-3 text-sm">
              <div>
                <div class="text-muted-foreground">Membership Number</div>
                <div>{{ member.membershipNumber || 'Not assigned' }}</div>
              </div>
              <div class="h-px bg-border" />
              <div>
                <div class="text-muted-foreground">Join Date</div>
                <div>{{ formatDate(member.joinDate) }}</div>
              </div>
              <div class="h-px bg-border" />
              <div>
                <div class="text-muted-foreground">Status</div>
                <div>
                  <ModernBadge variant="outline" :class="statusColors[member.status]">
                    {{ member.status }}
                  </ModernBadge>
                </div>
              </div>
              <div class="h-px bg-border" />
              <div>
                <div class="text-muted-foreground">Notes</div>
                <div class="text-muted-foreground italic">
                  {{ member.notes || 'No notes added' }}
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>

          <!-- Ministry Involvement -->
          <ModernCard>
            <ModernCardHeader>
              <ModernCardTitle class="flex items-center gap-2">
                <q-icon name="trending_up" class="h-5 w-5" />
                Ministry Involvement
              </ModernCardTitle>
            </ModernCardHeader>
            <ModernCardContent class="space-y-3 text-sm">
              <div v-if="member.ministries && member.ministries.length > 0" class="flex flex-wrap gap-2">
                <ModernBadge
                  v-for="(ministry, index) in member.ministries"
                  :key="index"
                  variant="secondary"
                >
                  {{ typeof ministry === 'string' ? ministry : ministry.name || 'Unknown Ministry' }}
                </ModernBadge>
              </div>
              <div v-else class="text-muted-foreground italic">
                Not involved in any ministries yet
              </div>
              <div class="h-px bg-border" />
              <div>
                <div class="text-muted-foreground">Attendance Rate</div>
                <div class="flex items-center gap-2">
                  <div class="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      class="h-full bg-success"
                      :style="{ width: `${member.attendancePercentage || 0}%` }"
                    />
                  </div>
                  <span>{{ member.attendancePercentage || 0 }}%</span>
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>
        </div>
      </template>

      <!-- Other tabs placeholder -->
      <template #panel-family>
        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle>Family Information</ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent>
            <div class="text-center text-muted-foreground py-8">
              Family information will be displayed here
            </div>
          </ModernCardContent>
        </ModernCard>
      </template>

      <template #panel-ministries>
        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle>Ministries</ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent>
            <div class="text-center text-muted-foreground py-8">
              Ministry involvement details will be displayed here
            </div>
          </ModernCardContent>
        </ModernCard>
      </template>

      <template #panel-attendance>
        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle>Attendance History</ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent>
            <div class="text-center text-muted-foreground py-8">
              Attendance records will be displayed here
            </div>
          </ModernCardContent>
        </ModernCard>
      </template>

      <template #panel-giving>
        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle>Giving History</ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent>
            <div class="text-center text-muted-foreground py-8">
              Giving records will be displayed here
            </div>
          </ModernCardContent>
        </ModernCard>
      </template>

      <template #panel-activity>
        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle>Activity Log</ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent>
            <div class="text-center text-muted-foreground py-8">
              Activity history will be displayed here
            </div>
          </ModernCardContent>
        </ModernCard>
      </template>
    </ModernTabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ModernCard from '@/components/ui/ModernCard.vue'
import ModernCardHeader from '@/components/ui/ModernCardHeader.vue'
import ModernCardTitle from '@/components/ui/ModernCardTitle.vue'
import ModernCardContent from '@/components/ui/ModernCardContent.vue'
import ModernButton from '@/components/ui/ModernButton.vue'
import ModernBadge from '@/components/ui/ModernBadge.vue'
import ModernTabs from '@/components/ui/ModernTabs.vue'
import type { Member } from '@/types/member'

interface Props {
  member: Member
  onBack: () => void
  onEdit?: (member: Member) => void
  onDelete?: (member: Member) => void
  onMessage?: (member: Member) => void
}

const props = defineProps<Props>()

const activeTab = ref('overview')

const initials = computed(() => {
  return `${props.member.firstName[0]}${props.member.lastName[0]}`.toUpperCase()
})

const fullName = computed(() => {
  return `${props.member.firstName} ${props.member.lastName}`
})

const statusColors: Record<Member['status'], string> = {
  active: 'bg-success/10 text-success border-success/20',
  inactive: 'bg-muted text-muted-foreground border-border',
  visitor: 'bg-info/10 text-info border-info/20',
  alumni: 'bg-accent/10 text-accent border-accent/20',
}

const formatDate = (date?: string): string => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

const getAge = (dob?: string): number | string => {
  if (!dob) return 'N/A'
  const today = new Date()
  const birthDate = new Date(dob)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}
</script>

