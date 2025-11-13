<template>
  <div
    class="p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors touch-target"
    @click="handleClick"
  >
    <div class="flex items-start gap-3">
      <div class="relative">
        <q-avatar size="40px">
          <img v-if="conversation.avatar" :src="conversation.avatar" :alt="conversation.name" />
          <q-icon
            v-else-if="conversation.type === 'group'"
            name="groups"
            color="primary"
          />
          <q-icon v-else name="person" color="primary" />
        </q-avatar>
        <div
          v-if="conversation.online && conversation.type === 'direct'"
          class="absolute bottom-0 right-0 h-3 w-3 bg-success rounded-full border-2 border-card"
        />
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-1">
          <p class="font-medium text-sm truncate">{{ conversation.name }}</p>
          <span class="text-xs text-muted-foreground">
            {{ conversation.timestamp }}
          </span>
        </div>
        <p class="text-xs text-muted-foreground truncate">
          {{ conversation.lastMessage }}
        </p>
      </div>

      <q-badge
        v-if="conversation.unread > 0"
        color="primary"
        :label="conversation.unread"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  conversation: {
    id: string
    type: 'direct' | 'group'
    name: string
    avatar: string
    lastMessage: string
    timestamp: string
    unread: number
    online: boolean
  }
}

const props = defineProps<Props>()
const router = useRouter()

const handleClick = () => {
  router.push(`/chat/${props.conversation.id}`)
}
</script>

<style scoped>
.touch-target {
  min-height: 48px;
  min-width: 48px;
}
</style>

