<template>
  <div>
    <q-item
      v-for="message in messages"
      :key="message.id"
      clickable
      v-ripple
      class="message-item"
    >
      <q-item-section avatar>
        <q-avatar>
          <img :src="message.avatar" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-weight-medium">{{ message.name }}</q-item-label>
        <q-item-label caption lines="2">{{ message.msg }}</q-item-label>
      </q-item-section>
      <q-item-section side top>
        <q-item-label caption>{{ message.time }}</q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Message {
  id: number
  name: string
  msg: string
  avatar: string
  time: string
}

const messages = ref<Message[]>([
  {
    id: 1,
    name: 'Church Admin',
    msg: 'Welcome to ChurchAfrica! Your church management system is ready.',
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
    time: '10:42 AM'
  },
  {
    id: 2,
    name: 'System',
    msg: 'New member registration received. Please review and approve.',
    avatar: 'https://cdn.quasar.dev/img/avatar6.jpg',
    time: '9:15 AM'
  },
  {
    id: 3,
    name: 'Attendance',
    msg: 'Sunday service attendance recorded: 150 members present.',
    avatar: 'https://cdn.quasar.dev/team/jeff_galbraith.jpg',
    time: '8:30 AM'
  }
])
</script>

<style lang="sass" scoped>
.message-item
  min-height: 60px
  
  &:hover
    background: rgba(0, 0, 0, 0.05)
</style>
