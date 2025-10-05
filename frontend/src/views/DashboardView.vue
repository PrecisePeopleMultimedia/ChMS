<template>
  <q-page class="q-pa-sm">
    <div class="text-h2">Welcome to ChurchAfrica</div>
    <card-social icon_position="left" />

    <card-charts />

    <div class="row q-col-gutter-sm q-py-sm">
      <tab-social />
      <card-with-image />
    </div>

    <div class="row q-col-gutter-sm q-pb-sm">
      <todo-list />
      <card-time-line />
    </div>

    <table-visits />
  </q-page>
</template>

<script setup lang="ts">
import CardSocial from '@/components/cards/CardSocial.vue'
import CardCharts from '@/components/cards/CardCharts.vue'
import TabSocial from '@/components/tabs/TabSocial.vue'
import CardWithImage from '@/components/cards/CardWithImage.vue'
import CardTimeLine from '@/components/cards/CardTimeLine.vue'
import TodoList from '@/components/list/TodoList.vue'
import TableVisits from '@/components/tables/TableVisits.vue'
</script>