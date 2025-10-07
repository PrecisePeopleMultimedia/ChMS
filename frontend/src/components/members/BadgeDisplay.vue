<template>
  <div class="badge-display">
    <!-- Single Badge -->
    <q-chip
      v-if="!multiple && badge"
      :style="{
        backgroundColor: badge.color,
        color: getContrastColor(badge.color)
      }"
      :size="size"
      :class="chipClass"
      :clickable="clickable"
      @click="handleClick(badge)"
    >
      <q-icon v-if="showIcon" :name="badge.icon" :class="iconClass" />
      {{ badge.name }}
      
      <!-- Expiration indicator -->
      <q-icon
        v-if="badge.expiration_status === 'expiring_soon'"
        name="schedule"
        color="warning"
        size="xs"
        class="q-ml-xs"
      >
        <q-tooltip>Expires in {{ badge.days_until_expiration }} days</q-tooltip>
      </q-icon>
      
      <q-icon
        v-if="badge.expiration_status === 'expired'"
        name="error"
        color="negative"
        size="xs"
        class="q-ml-xs"
      >
        <q-tooltip>Expired</q-tooltip>
      </q-icon>
    </q-chip>

    <!-- Multiple Badges -->
    <div v-else-if="multiple && badges.length" class="row q-gutter-xs flex-wrap">
      <q-chip
        v-for="badge in displayedBadges"
        :key="badge.id"
        :style="{
          backgroundColor: badge.color,
          color: getContrastColor(badge.color)
        }"
        :size="size"
        :class="chipClass"
        :clickable="clickable"
        @click="handleClick(badge)"
      >
        <q-icon v-if="showIcon" :name="badge.icon" :class="iconClass" />
        {{ badge.name }}
        
        <!-- Expiration indicator -->
        <q-icon
          v-if="badge.expiration_status === 'expiring_soon'"
          name="schedule"
          color="warning"
          size="xs"
          class="q-ml-xs"
        >
          <q-tooltip>Expires in {{ badge.days_until_expiration }} days</q-tooltip>
        </q-icon>
        
        <q-icon
          v-if="badge.expiration_status === 'expired'"
          name="error"
          color="negative"
          size="xs"
          class="q-ml-xs"
        >
          <q-tooltip>Expired</q-tooltip>
        </q-icon>
      </q-chip>

      <!-- Show more indicator -->
      <q-chip
        v-if="hasMoreBadges"
        color="grey-5"
        text-color="grey-8"
        :size="size"
        :class="chipClass"
        :clickable="clickable"
        @click="$emit('showAll')"
      >
        +{{ remainingCount }}
      </q-chip>
    </div>

    <!-- Empty State -->
    <div v-else-if="showEmpty" class="text-caption text-grey-6">
      No badges
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Badge {
  id: number
  name: string
  color: string
  icon: string
  expiration_status?: 'never' | 'active' | 'expiring_soon' | 'expired'
  days_until_expiration?: number
}

interface Props {
  badge?: Badge | null
  badges?: Badge[]
  multiple?: boolean
  maxDisplay?: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showIcon?: boolean
  showEmpty?: boolean
  clickable?: boolean
  dense?: boolean
}

interface Emits {
  (e: 'click', badge: Badge): void
  (e: 'showAll'): void
}

const props = withDefaults(defineProps<Props>(), {
  badge: null,
  badges: () => [],
  multiple: false,
  maxDisplay: 3,
  size: 'sm',
  showIcon: true,
  showEmpty: false,
  clickable: false,
  dense: false
})

const emit = defineEmits<Emits>()

// Computed properties
const displayedBadges = computed(() => {
  if (!props.multiple || !props.badges.length) return []
  return props.badges.slice(0, props.maxDisplay)
})

const hasMoreBadges = computed(() => {
  return props.multiple && props.badges.length > props.maxDisplay
})

const remainingCount = computed(() => {
  return props.badges.length - props.maxDisplay
})

const chipClass = computed(() => {
  const classes = []
  
  if (props.dense) {
    classes.push('q-px-sm')
  }
  
  if (props.clickable) {
    classes.push('cursor-pointer')
  }
  
  return classes.join(' ')
})

const iconClass = computed(() => {
  const classes = ['q-mr-xs']
  
  switch (props.size) {
    case 'xs':
      classes.push('text-xs')
      break
    case 'sm':
      classes.push('text-sm')
      break
    case 'md':
      classes.push('text-md')
      break
    case 'lg':
      classes.push('text-lg')
      break
    case 'xl':
      classes.push('text-xl')
      break
  }
  
  return classes.join(' ')
})

// Methods
const getContrastColor = (hexColor: string): string => {
  // Remove # if present
  const hex = hexColor.replace('#', '')
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  // Return black for light colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

const handleClick = (badge: Badge) => {
  if (props.clickable) {
    emit('click', badge)
  }
}
</script>

<style scoped>
.badge-display {
  display: inline-block;
}

.q-chip {
  font-weight: 500;
  border-radius: 12px;
}

.cursor-pointer:hover {
  opacity: 0.8;
  transform: translateY(-1px);
  transition: all 0.2s ease;
}
</style>
