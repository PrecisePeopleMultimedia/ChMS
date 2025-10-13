<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round @click="toggleLeftDrawer" icon="menu" aria-label="Menu" />
        <q-toolbar-title>ChurchAfrica</q-toolbar-title>
        <q-space />
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn
            round
            dense
            flat
            color="white"
            :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
            @click="$q.fullscreen.toggle()"
            v-if="$q.screen.gt.sm"
          >
          </q-btn>
          <q-btn
            round
            dense
            flat
            color="white"
            icon="fab fa-github"
            type="a"
            href="https://github.com/PrecisePeopleMultimedia/ChMS"
            target="_blank"
          >
          </q-btn>
          <q-btn round dense flat color="white" icon="notifications">
            <q-badge color="red" text-color="white" floating>5</q-badge>
            <q-menu>
              <q-list style="min-width: 100px">
                <messages></messages>
                <q-card class="text-center no-shadow no-border">
                  <q-btn
                    label="View All"
                    style="max-width: 120px !important"
                    flat
                    dense
                    class="text-indigo-8"
                  ></q-btn>
                </q-card>
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn round flat>
            <q-avatar size="26px">
              <img :src="user?.avatar || 'https://cdn.quasar.dev/img/boy-avatar.png'" />
            </q-avatar>
          </q-btn>
          <!-- Theme toggle removed - using dark mode only -->
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-primary text-white">
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px">
        <q-list>
          <q-item to="/dashboard" active-class="q-item-no-link-highlighting">
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Dashboard</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="bg-grey-7" size="2px" inset></q-separator>

          <q-expansion-item icon="people" label="Members">
            <q-list class="q-pl-lg">
              <q-item to="/members" active-class="q-item-no-link-highlighting">
                <q-item-section avatar>
                  <q-icon name="people" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>All Members</q-item-label>
                </q-item-section>
              </q-item>
              <q-item to="/members/add" active-class="q-item-no-link-highlighting">
                <q-item-section avatar>
                  <q-icon name="person_add" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Add Member</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <q-item to="/attendance" active-class="q-item-no-link-highlighting">
            <q-item-section avatar>
              <q-icon name="check_circle" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Attendance</q-item-label>
            </q-item-section>
          </q-item>

          <q-item to="/events" active-class="q-item-no-link-highlighting">
            <q-item-section avatar>
              <q-icon name="event" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Events</q-item-label>
            </q-item-section>
          </q-item>

          <q-item to="/reports" active-class="q-item-no-link-highlighting">
            <q-item-section avatar>
              <q-icon name="assessment" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Reports</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="bg-grey-7" size="2px" inset></q-separator>

          <q-item-label header class="text-weight-bolder text-white">Settings</q-item-label>

          <q-item to="/profile" active-class="q-item-no-link-highlighting">
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Profile</q-item-label>
            </q-item-section>
          </q-item>

          <q-item to="/settings" active-class="q-item-no-link-highlighting">
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Settings</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img :src="user?.avatar || 'https://cdn.quasar.dev/img/boy-avatar.png'" />
          </q-avatar>
          <div class="text-weight-bold">{{ user?.name || 'Church Admin' }}</div>
          <div>{{ user?.email || 'admin@church.com' }}</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth'
import Messages from '@/components/Messages.vue'

// Composables
const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

// State
const leftDrawerOpen = ref(false)

// Computed
const user = computed(() => authStore.user)

// Methods
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>


