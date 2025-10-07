<template>
  <q-card flat bordered class="note-card">
    <q-card-section>
      <!-- Header -->
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center space-x-2">
          <q-icon
            :name="getNoteTypeIcon(note.note_type)"
            :color="getNoteTypeColor(note.note_type)"
            size="sm"
          />
          <span class="font-medium text-sm">{{ note.note_type }}</span>
          <q-badge
            v-if="note.is_alert"
            color="red"
            label="Alert"
            class="ml-1"
          />
          <q-badge
            v-if="note.is_pinned"
            color="yellow"
            label="Pinned"
            class="ml-1"
          />
        </div>
        <q-btn
          icon="more_vert"
          size="sm"
          flat
          round
          @click="showMenu = !showMenu"
        >
          <q-menu v-model="showMenu" anchor="bottom right" self="top right">
            <q-list>
              <q-item clickable @click="$emit('edit', note)">
                <q-item-section avatar>
                  <q-icon name="edit" />
                </q-item-section>
                <q-item-section>Edit</q-item-section>
              </q-item>
              <q-item clickable @click="$emit('delete', note)">
                <q-item-section avatar>
                  <q-icon name="delete" />
                </q-item-section>
                <q-item-section>Delete</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>

      <!-- Title -->
      <div v-if="note.title" class="font-semibold text-gray-900 dark:text-white mb-2">
        {{ note.title }}
      </div>

      <!-- Content -->
      <div class="text-gray-700 dark:text-gray-300 mb-3">
        {{ note.content }}
      </div>

      <!-- Privacy Level -->
      <div class="flex items-center mb-2">
        <q-icon
          :name="getPrivacyIcon(note.privacy_level)"
          :color="getPrivacyColor(note.privacy_level)"
          size="xs"
          class="mr-1"
        />
        <span class="text-xs text-gray-500">
          {{ note.privacy_level_description }}
        </span>
      </div>

      <!-- Alert Expiry -->
      <div v-if="note.is_alert && note.alert_expires_at" class="text-xs text-orange-600 mb-2">
        <q-icon name="schedule" size="xs" class="mr-1" />
        Alert expires: {{ formatDate(note.alert_expires_at) }}
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between text-xs text-gray-500">
        <div class="flex items-center">
          <q-icon name="person" size="xs" class="mr-1" />
          <span>{{ note.author?.first_name }} {{ note.author?.last_name }}</span>
        </div>
        <div>{{ formatDate(note.created_at) }}</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { MemberNote } from '@/types/notes'

interface Props {
  note: MemberNote
}

defineProps<Props>()

defineEmits<{
  edit: [note: MemberNote]
  delete: [note: MemberNote]
}>()

const showMenu = ref(false)

const getNoteTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    'Personal Note': 'person',
    'Follow-up': 'follow_the_signs',
    'Prayer Request': 'favorite',
    'Ministry Note': 'church',
    'Administrative': 'admin_panel_settings',
    'Pastoral Care': 'support',
    'Emergency': 'warning'
  }
  return icons[type] || 'note'
}

const getNoteTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    'Personal Note': 'blue',
    'Follow-up': 'green',
    'Prayer Request': 'purple',
    'Ministry Note': 'orange',
    'Administrative': 'gray',
    'Pastoral Care': 'teal',
    'Emergency': 'red'
  }
  return colors[type] || 'gray'
}

const getPrivacyIcon = (level: string) => {
  const icons: Record<string, string> = {
    'public': 'public',
    'private': 'lock',
    'extreme': 'security'
  }
  return icons[level] || 'public'
}

const getPrivacyColor = (level: string) => {
  const colors: Record<string, string> = {
    'public': 'green',
    'private': 'orange',
    'extreme': 'red'
  }
  return colors[level] || 'gray'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}
</script>

<style scoped>
.note-card {
  @apply transition-all duration-200 hover:shadow-md;
}

.note-card:hover {
  @apply transform scale-105;
}
</style>
