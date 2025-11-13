<template>
  <ModernCard
    :class="[
      'transition-all hover:shadow-md hover:border-primary/50',
      onClick && 'cursor-pointer'
    ]"
    @click="handleClick"
  >
    <ModernCardContent class="pt-6">
      <div class="flex items-start gap-4">
        <!-- Avatar -->
        <q-avatar size="64px" class="flex-shrink-0">
          <img v-if="member.photo" :src="member.photo" :alt="fullName" />
          <div v-else class="bg-primary/10 text-primary text-lg flex items-center justify-center h-full w-full">
            {{ initials }}
          </div>
        </q-avatar>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2 mb-2">
            <div class="flex-1 min-w-0">
              <h4 class="truncate">{{ fullName }}</h4>
              <p class="text-sm text-muted-foreground truncate">
                {{ member.membershipNumber || 'No membership #' }}
              </p>
            </div>

            <!-- Actions Menu -->
            <q-btn
              flat
              round
              dense
              icon="more_vert"
              size="sm"
              class="h-8 w-8 flex-shrink-0"
              @click.stop="showMenu = !showMenu"
            >
              <q-menu v-model="showMenu" @click.stop>
                <q-list dense>
                  <q-item clickable @click="handleView">
                    <q-item-section avatar>
                      <q-icon name="person" />
                    </q-item-section>
                    <q-item-section>View Details</q-item-section>
                  </q-item>
                  <q-item clickable @click="handleEdit">
                    <q-item-section>Edit</q-item-section>
                  </q-item>
                  <q-item clickable @click="handleMessage">
                    <q-item-section avatar>
                      <q-icon name="message" />
                    </q-item-section>
                    <q-item-section>Send Message</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable @click="handleDelete" class="text-destructive">
                    <q-item-section>Delete</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>

          <!-- Badges -->
          <div class="flex flex-wrap gap-2 mb-3">
            <ModernBadge
              variant="outline"
              :class="statusColors[member.status]"
            >
              {{ member.status }}
            </ModernBadge>
            <ModernBadge variant="outline" class="capitalize">
              {{ member.gender }}
            </ModernBadge>
            <ModernBadge
              v-if="member.ministries && member.ministries.length > 0"
              variant="secondary"
            >
              {{ member.ministries.length }} {{ member.ministries.length === 1 ? 'Ministry' : 'Ministries' }}
            </ModernBadge>
          </div>

          <!-- Contact Info (if not compact) -->
          <div v-if="!compact" class="space-y-1 text-sm text-muted-foreground">
            <div v-if="member.contact.phone" class="flex items-center gap-2">
              <q-icon name="phone" class="h-3 w-3" />
              <span class="truncate">{{ member.contact.phone }}</span>
            </div>
            <div v-if="member.contact.email" class="flex items-center gap-2">
              <q-icon name="mail" class="h-3 w-3" />
              <span class="truncate">{{ member.contact.email }}</span>
            </div>
            <div v-if="member.contact.address?.city" class="flex items-center gap-2">
              <q-icon name="place" class="h-3 w-3" />
              <span class="truncate">
                {{ member.contact.address.city }}, {{ member.contact.address.state }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <q-icon name="event" class="h-3 w-3" />
              <span>Joined {{ formatDate(member.joinDate) }}</span>
            </div>
          </div>

          <!-- Stats (if compact) -->
          <div v-if="compact" class="flex gap-4 text-xs text-muted-foreground">
            <div v-if="member.attendancePercentage !== undefined" class="flex items-center gap-1">
              <q-icon name="favorite" class="h-3 w-3" />
              <span>{{ member.attendancePercentage }}%</span>
            </div>
            <div>
              Joined {{ formatDate(member.joinDate) }}
            </div>
          </div>
        </div>
      </div>
    </ModernCardContent>
  </ModernCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ModernCard from '@/components/ui/ModernCard.vue'
import ModernCardContent from '@/components/ui/ModernCardContent.vue'
import ModernBadge from '@/components/ui/ModernBadge.vue'
import type { Member } from '@/types/member'

interface Props {
  member: Member
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false
})

const emit = defineEmits<{
  click: [member: Member]
  edit: [member: Member]
  delete: [member: Member]
  message: [member: Member]
}>()

const showMenu = ref(false)

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

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const handleClick = () => {
  emit('click', props.member)
}

const handleView = () => {
  showMenu.value = false
  emit('click', props.member)
}

const handleEdit = () => {
  showMenu.value = false
  emit('edit', props.member)
}

const handleDelete = () => {
  showMenu.value = false
  emit('delete', props.member)
}

const handleMessage = () => {
  showMenu.value = false
  emit('message', props.member)
}
</script>

