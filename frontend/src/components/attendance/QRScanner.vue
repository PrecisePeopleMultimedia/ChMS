<template>
  <q-card>
    <q-card-section>
      <div class="text-h6 q-mb-md">
        <q-icon name="qr_code_scanner" class="q-mr-sm" />
        QR Code Check-In
      </div>

      <!-- Camera Access Prompt -->
      <div v-if="!hasCameraPermission" class="q-pa-md text-center">
        <q-icon name="videocam_off" size="64px" color="grey" />
        <div class="text-body1 q-mt-md">Camera access required for QR scanning</div>
        <q-btn
          color="primary"
          label="Enable Camera"
          @click="requestCameraPermission"
          class="q-mt-md"
        />
      </div>

      <!-- Scanner Interface -->
      <div v-else>
        <!-- Video Preview -->
        <div class="scanner-container q-mb-md">
          <video
            ref="videoElement"
            autoplay
            playsinline
            class="scanner-video"
          ></video>
          <canvas ref="canvasElement" style="display: none;"></canvas>
          
          <!-- Scanning Overlay -->
          <div v-if="scanning" class="scanning-overlay">
            <div class="scan-frame"></div>
            <div class="scan-line"></div>
          </div>
        </div>

        <!-- Manual QR Code Input -->
        <q-input
          v-model="manualQrInput"
          filled
          label="Or enter QR code manually"
          placeholder="Paste QR code data here"
          @keyup.enter="processManualQr"
        >
          <template v-slot:append>
            <q-btn
              flat
              icon="check"
              @click="processManualQr"
              :loading="processingQr"
            />
          </template>
        </q-input>

        <!-- Status Messages -->
        <q-banner v-if="scanStatus" :class="scanStatusClass" class="q-mt-md">
          {{ scanStatusMessage }}
        </q-banner>

        <!-- Controls -->
        <div class="q-mt-md row q-gutter-sm justify-center">
          <q-btn
            v-if="!scanning"
            color="primary"
            icon="play_arrow"
            label="Start Scanning"
            @click="startScanning"
            :disable="!serviceId"
          />
          <q-btn
            v-else
            color="negative"
            icon="stop"
            label="Stop Scanning"
            @click="stopScanning"
          />
        </div>
      </div>

      <!-- Service Selection Warning -->
      <q-banner v-if="!serviceId" class="bg-warning text-white q-mt-md">
        Please select a service before scanning QR codes
      </q-banner>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useAttendanceStore } from '@/stores/attendance'
import { useQuasar } from 'quasar'

const props = defineProps<{
  serviceId?: number
}>()

const $q = useQuasar()
const attendanceStore = useAttendanceStore()

const videoElement = ref<HTMLVideoElement | null>(null)
const canvasElement = ref<HTMLCanvasElement | null>(null)
const hasCameraPermission = ref(false)
const scanning = ref(false)
const processingQr = ref(false)
const manualQrInput = ref('')
const scanStatus = ref<'success' | 'error' | null>(null)
const scanStatusMessage = ref('')

let stream: MediaStream | null = null
let scanInterval: number | null = null

const scanStatusClass = computed(() => {
  if (scanStatus.value === 'success') return 'bg-positive text-white'
  if (scanStatus.value === 'error') return 'bg-negative text-white'
  return ''
})

const requestCameraPermission = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' } // Use back camera on mobile
    })
    
    if (videoElement.value && stream) {
      videoElement.value.srcObject = stream
      hasCameraPermission.value = true
    }
  } catch (error) {
    console.error('Camera access denied:', error)
    $q.notify({
      type: 'negative',
      message: 'Camera access is required for QR scanning. Please enable it in your browser settings.'
    })
  }
}

const startScanning = async () => {
  if (!props.serviceId) {
    $q.notify({
      type: 'warning',
      message: 'Please select a service first'
    })
    return
  }

  if (!hasCameraPermission.value) {
    await requestCameraPermission()
    return
  }

  scanning.value = true
  scanStatus.value = null

  // Use jsQR library for QR scanning
  // For now, we'll implement a basic manual input method
  // Full camera-based scanning requires jsQR library
}

const stopScanning = () => {
  scanning.value = false
  if (scanInterval) {
    clearInterval(scanInterval)
    scanInterval = null
  }
}

const processQrCode = async (qrData: string) => {
  if (!props.serviceId || processingQr.value) return

  processingQr.value = true
  scanStatus.value = null

  try {
    const result = await attendanceStore.qrCheckIn({
      qr_code_data: qrData,
      service_id: props.serviceId
    })

    // Handle family check-in (multiple records)
    if (result.attendance_records) {
      scanStatus.value = 'success'
      scanStatusMessage.value = `${result.attendance_records.length} family members checked in successfully!`
    } else {
      scanStatus.value = 'success'
      scanStatusMessage.value = 'Check-in successful!'
    }

    // Clear manual input
    manualQrInput.value = ''

    $q.notify({
      type: 'positive',
      message: scanStatusMessage.value,
      icon: 'check_circle'
    })

    // Clear status after 3 seconds
    setTimeout(() => {
      scanStatus.value = null
    }, 3000)
  } catch (error: any) {
    scanStatus.value = 'error'
    scanStatusMessage.value = error.response?.data?.message || 'Failed to process QR code'
    
    $q.notify({
      type: 'negative',
      message: scanStatusMessage.value
    })

    setTimeout(() => {
      scanStatus.value = null
    }, 3000)
  } finally {
    processingQr.value = false
  }
}

const processManualQr = () => {
  if (manualQrInput.value.trim()) {
    processQrCode(manualQrInput.value.trim())
  }
}

onMounted(async () => {
  // Request camera permission on mount
  try {
    await requestCameraPermission()
  } catch (error) {
    console.warn('Camera permission not available:', error)
  }
})

onBeforeUnmount(() => {
  stopScanning()
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
  }
})
</script>

<style scoped lang="sass">
.scanner-container
  position: relative
  width: 100%
  max-width: 500px
  margin: 0 auto
  background: #000
  border-radius: 8px
  overflow: hidden

.scanner-video
  width: 100%
  height: auto
  display: block

.scanning-overlay
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  display: flex
  align-items: center
  justify-content: center

.scan-frame
  width: 250px
  height: 250px
  border: 2px solid #4CAF50
  border-radius: 8px
  position: relative

  &::before, &::after
    content: ''
    position: absolute
    width: 30px
    height: 30px
    border: 3px solid #4CAF50

  &::before
    top: -3px
    left: -3px
    border-right: none
    border-bottom: none

  &::after
    bottom: -3px
    right: -3px
    border-left: none
    border-top: none

.scan-line
  position: absolute
  width: 250px
  height: 2px
  background: linear-gradient(to bottom, transparent, #4CAF50, transparent)
  animation: scan 2s linear infinite

@keyframes scan
  0%
    top: 0
  100%
    top: 250px
</style>

