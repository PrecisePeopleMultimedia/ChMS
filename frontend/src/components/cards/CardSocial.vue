<template>
  <q-card class="bg-transparent no-shadow no-border">
    <q-card-section class="q-pa-none">
      <div class="row q-col-gutter-sm">
        <div v-for="(item, index) in items" :key="index" class="col-md-3 col-sm-12 col-xs-12">
          <q-item :style="`background-color: ${item.color1}`" class="q-pa-none">
            <q-item-section v-if="icon_position === 'left'" side :style="`background-color: ${item.color2}`"
                            class="q-pa-lg q-mr-none text-white">
              <q-icon :name="item.icon" color="white" size="24px"></q-icon>
            </q-item-section>
            <q-item-section class="q-pa-md q-ml-none text-white">
              <q-item-label class="text-white text-h6 text-weight-bolder">{{ item.value }}</q-item-label>
              <q-item-label>{{ item.title }}</q-item-label>
            </q-item-section>
            <q-item-section v-if="icon_position === 'right'" side class="q-mr-md text-white">
              <q-icon :name="item.icon" color="white" size="44px"></q-icon>
            </q-item-section>
          </q-item>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  icon_position?: 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  icon_position: 'left'
})

interface StatItem {
  title: string
  icon: string
  value: string
  color1: string
  color2: string
}

const items = computed<StatItem[]>(() => {
  return props.icon_position === 'left'
    ? [
        {
          title: 'Total Members',
          icon: 'people',
          value: '1,250',
          color1: '#5064b5',
          color2: '#3e51b5'
        },
        {
          title: 'Active Members',
          icon: 'person',
          value: '980',
          color1: '#ea4b64',
          color2: '#e91e63'
        },
        {
          title: 'This Week Attendance',
          icon: 'check_circle',
          value: '750',
          color1: '#38b1c5',
          color2: '#00bcd4'
        },
        {
          title: 'Events This Month',
          icon: 'event',
          value: '12',
          color1: '#1e88e5',
          color2: '#2196f3'
        }
      ]
    : [
        {
          title: 'Total Members',
          icon: 'people',
          value: '1,250',
          color1: '#5064b5',
          color2: '#3e51b5'
        },
        {
          title: 'Active Members',
          icon: 'person',
          value: '980',
          color1: '#ea4b64',
          color2: '#e91e63'
        },
        {
          title: 'This Week Attendance',
          icon: 'check_circle',
          value: '750',
          color1: '#38b1c5',
          color2: '#00bcd4'
        },
        {
          title: 'Events This Month',
          icon: 'event',
          value: '12',
          color1: '#1e88e5',
          color2: '#2196f3'
        }
      ]
})
</script>
