<template>
  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
    <q-card>
      <q-card-section>
        <div class="text-h6 q-mb-md">Church Tasks & Reminders</div>
        
        <q-input
          v-model="newTask"
          placeholder="Add a new task..."
          dense
          outlined
          @keyup.enter="addTask"
        >
          <template v-slot:append>
            <q-btn flat round dense icon="add" @click="addTask" />
          </template>
        </q-input>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-none">
        <q-list>
          <q-item
            v-for="(task, index) in tasks"
            :key="task.id"
            clickable
            v-ripple
            @click="toggleTask(index)"
            :class="{ 'task-completed': task.completed }"
          >
            <q-item-section avatar>
              <q-checkbox
                v-model="task.completed"
                :color="task.priority === 'high' ? 'negative' : task.priority === 'medium' ? 'warning' : 'positive'"
                @click.stop
              />
            </q-item-section>
            
            <q-item-section>
              <q-item-label :class="{ 'text-strike': task.completed }">
                {{ task.text }}
              </q-item-label>
              <q-item-label caption>
                {{ task.category }} • Due: {{ task.dueDate }}
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <div class="row items-center">
                <q-chip
                  :color="getPriorityColor(task.priority)"
                  text-color="white"
                  size="sm"
                  class="q-mr-sm"
                >
                  {{ task.priority }}
                </q-chip>
                <q-btn
                  flat
                  round
                  dense
                  icon="delete"
                  color="negative"
                  @click.stop="removeTask(index)"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-section v-if="tasks.length === 0" class="text-center text-grey-6">
        <q-icon name="task_alt" size="3em" class="q-mb-md" />
        <div>No tasks yet. Add one above!</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Task {
  id: number
  text: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  category: string
  dueDate: string
}

const newTask = ref('')
const tasks = ref<Task[]>([
  {
    id: 1,
    text: 'Prepare Sunday sermon notes',
    completed: false,
    priority: 'high',
    category: 'Ministry',
    dueDate: 'Tomorrow'
  },
  {
    id: 2,
    text: 'Review new member applications',
    completed: false,
    priority: 'medium',
    category: 'Administration',
    dueDate: 'This week'
  },
  {
    id: 3,
    text: 'Schedule youth group meeting',
    completed: true,
    priority: 'low',
    category: 'Events',
    dueDate: 'Completed'
  },
  {
    id: 4,
    text: 'Update church website content',
    completed: false,
    priority: 'medium',
    category: 'Communication',
    dueDate: 'Next week'
  },
  {
    id: 5,
    text: 'Organize Easter celebration',
    completed: false,
    priority: 'high',
    category: 'Events',
    dueDate: 'March 25'
  }
])

const addTask = () => {
  if (newTask.value.trim()) {
    tasks.value.unshift({
      id: Date.now(),
      text: newTask.value.trim(),
      completed: false,
      priority: 'medium',
      category: 'General',
      dueDate: 'No due date'
    })
    newTask.value = ''
  }
}

const toggleTask = (index: number) => {
  if (tasks.value[index]) {
    tasks.value[index].completed = !tasks.value[index].completed
  }
}

const removeTask = (index: number) => {
  tasks.value.splice(index, 1)
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'negative'
    case 'medium': return 'warning'
    case 'low': return 'positive'
    default: return 'grey'
  }
}
</script>

<style lang="sass" scoped>
.task-completed
  opacity: 0.6

.text-strike
  text-decoration: line-through
</style>
