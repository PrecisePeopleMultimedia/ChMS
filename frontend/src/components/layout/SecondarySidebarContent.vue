<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="p-4 border-b border-border">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold">Messages & Activity</h3>
        <q-btn
          v-if="isMobile"
          flat
          round
          dense
          icon="close"
          size="sm"
          @click="$emit('close')"
        />
      </div>

      <!-- Search -->
      <div class="relative">
        <q-icon
          name="search"
          class="absolute left-3 top-1/2 -translate-y-1/2"
          size="16px"
          color="muted"
        />
        <q-input
          v-model="searchQuery"
          type="search"
          placeholder="Search conversations..."
          dense
          outlined
          class="pl-9"
        />
      </div>
    </div>

    <!-- Tabs -->
    <q-tabs
      v-model="activeTab"
      class="mx-4 mt-2"
      indicator-color="primary"
      active-color="primary"
    >
      <q-tab name="messages" label="Messages" icon="chat" />
      <q-tab name="activity" label="Activity" icon="people" />
    </q-tabs>

    <!-- Tab Panels -->
    <q-tab-panels v-model="activeTab" class="flex-1 overflow-hidden">
      <!-- Messages Tab -->
      <q-tab-panel name="messages" class="p-0">
        <q-scroll-area class="h-full">
          <div class="p-2">
            <ConversationItem
              v-for="conversation in filteredConversations"
              :key="conversation.id"
              :conversation="conversation"
            />
          </div>
        </q-scroll-area>
      </q-tab-panel>

      <!-- Activity Tab -->
      <q-tab-panel name="activity" class="p-0">
        <q-scroll-area class="h-full">
          <div class="p-4 space-y-4">
            <ActivityItem
              v-for="activity in recentActivity"
              :key="activity.id"
              :activity="activity"
            />
          </div>
        </q-scroll-area>
      </q-tab-panel>
    </q-tab-panels>

    <!-- New Message Button -->
    <div class="p-4 border-t border-border">
      <q-btn
        color="primary"
        label="New Message"
        icon="send"
        class="w-full touch-target"
        unelevated
        @click="handleNewMessage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ConversationItem from './SecondarySidebarConversationItem.vue'
import ActivityItem from './SecondarySidebarActivityItem.vue'

interface Props {
  isMobile: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const router = useRouter()
const activeTab = ref('messages')
const searchQuery = ref('')

// Mock conversation data
const conversations = ref([
  {
    id: '1',
    type: 'direct',
    name: 'Sarah Williams',
    avatar: '',
    lastMessage: 'Thank you for your prayers!',
    timestamp: '2m ago',
    unread: 2,
    online: true
  },
  {
    id: '2',
    type: 'group',
    name: 'Youth Ministry',
    avatar: '',
    lastMessage: 'Meeting this Saturday at 3pm',
    timestamp: '15m ago',
    unread: 5,
    online: false
  },
  {
    id: '3',
    type: 'direct',
    name: 'Pastor John',
    avatar: '',
    lastMessage: 'Can we discuss the event planning?',
    timestamp: '1h ago',
    unread: 0,
    online: true
  },
  {
    id: '4',
    type: 'group',
    name: 'Prayer Warriors',
    avatar: '',
    lastMessage: 'New prayer request from John',
    timestamp: '2h ago',
    unread: 1,
    online: false
  }
])

// Mock activity data
const recentActivity = ref([
  {
    id: '1',
    type: 'new_member',
    description: 'Sarah Williams joined the church',
    timestamp: '5m ago'
  },
  {
    id: '2',
    type: 'event',
    description: 'Youth Service scheduled for Saturday',
    timestamp: '1h ago'
  },
  {
    id: '3',
    type: 'attendance',
    description: '127 members checked in today',
    timestamp: '2h ago'
  }
])

const filteredConversations = computed(() => {
  if (!searchQuery.value) return conversations.value
  const query = searchQuery.value.toLowerCase()
  return conversations.value.filter(
    conv => conv.name.toLowerCase().includes(query) ||
            conv.lastMessage.toLowerCase().includes(query)
  )
})

const handleNewMessage = () => {
  router.push('/chat/new')
  emit('close')
}
</script>

