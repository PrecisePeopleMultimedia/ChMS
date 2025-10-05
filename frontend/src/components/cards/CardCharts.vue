<template>
  <div class="row q-col-gutter-sm q-py-sm">
    <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs" style="background-color: #38b1c5">
        <q-card-section class="text-h6 text-white">
          Weekly Attendance
        </q-card-section>
        <q-card-section class="q-pa-none">
          <div class="chart-container" style="height: 250px; padding: 20px;">
            <canvas ref="attendanceChart"></canvas>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs" style="background-color: #ea4b64">
        <q-card-section class="text-h6 text-white">
          Member Growth
        </q-card-section>
        <q-card-section class="q-pa-none">
          <div class="chart-container" style="height: 250px; padding: 20px;">
            <canvas ref="memberChart"></canvas>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
      <q-card class="q-ma-xs" style="background-color: #1e88e5">
        <q-card-section class="text-h6 text-white">
          Event Participation
        </q-card-section>
        <q-card-section class="q-pa-none">
          <div class="chart-container" style="height: 250px; padding: 20px;">
            <canvas ref="eventChart"></canvas>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

const attendanceChart = ref<HTMLCanvasElement>()
const memberChart = ref<HTMLCanvasElement>()
const eventChart = ref<HTMLCanvasElement>()

const drawSimpleChart = (canvas: HTMLCanvasElement, data: number[], color: string) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight

  const width = canvas.width
  const height = canvas.height
  const padding = 20

  // Clear canvas
  ctx.clearRect(0, 0, width, height)

  // Draw simple line chart
  ctx.strokeStyle = color
  ctx.lineWidth = 3
  ctx.beginPath()

  const stepX = (width - padding * 2) / (data.length - 1)
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const range = maxValue - minValue || 1

  data.forEach((value, index) => {
    const x = padding + index * stepX
    const y = height - padding - ((value - minValue) / range) * (height - padding * 2)
    
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })

  ctx.stroke()

  // Draw points
  ctx.fillStyle = color
  data.forEach((value, index) => {
    const x = padding + index * stepX
    const y = height - padding - ((value - minValue) / range) * (height - padding * 2)
    
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, 2 * Math.PI)
    ctx.fill()
  })
}

onMounted(async () => {
  await nextTick()
  
  // Sample data for charts
  const attendanceData = [120, 150, 180, 160, 200, 175, 190]
  const memberData = [1000, 1050, 1100, 1150, 1200, 1250, 1300]
  const eventData = [5, 8, 6, 10, 12, 9, 15]

  if (attendanceChart.value) {
    drawSimpleChart(attendanceChart.value, attendanceData, '#ffffff')
  }
  
  if (memberChart.value) {
    drawSimpleChart(memberChart.value, memberData, '#ffffff')
  }
  
  if (eventChart.value) {
    drawSimpleChart(eventChart.value, eventData, '#ffffff')
  }
})
</script>

<style lang="sass" scoped>
.chart-container
  display: flex
  align-items: center
  justify-content: center
  
  canvas
    max-width: 100%
    max-height: 100%
</style>
