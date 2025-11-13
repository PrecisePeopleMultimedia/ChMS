<template>
  <div class="space-y-4">
    <!-- Camera View -->
    <div class="relative bg-black rounded-lg overflow-hidden" style="aspect-ratio: 1">
      <video
        ref="videoRef"
        autoplay
        playsinline
        class="w-full h-full object-cover"
        :class="{ hidden: !scanning }"
      />
      <div
        v-if="!scanning"
        class="absolute inset-0 flex items-center justify-center bg-muted"
      >
        <q-icon name="camera_alt" size="48px" class="text-muted-foreground" />
      </div>

      <!-- Scanning Overlay -->
      <div
        v-if="scanning"
        class="absolute inset-0 flex items-center justify-center"
      >
        <div class="border-2 border-primary rounded-lg" style="width: 80%; height: 80%">
          <div class="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-primary rounded-tl-lg" />
          <div class="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-primary rounded-tr-lg" />
          <div class="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-primary rounded-bl-lg" />
          <div class="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-primary rounded-br-lg" />
        </div>
      </div>

      <canvas ref="canvasRef" class="hidden" />
    </div>

    <!-- Controls -->
    <div class="flex items-center gap-2">
      <ModernButton
        v-if="!scanning"
        @click="startCamera"
        class="flex-1 gap-2"
      >
        <q-icon name="camera" class="h-4 w-4" />
        Start Scanning
      </ModernButton>
      <ModernButton
        v-else
        variant="outline"
        @click="stopCamera"
        class="flex-1 gap-2"
      >
        <q-icon name="camera_off" class="h-4 w-4" />
        Stop Scanning
      </ModernButton>

      <ModernButton
        variant="outline"
        @click="handleFileUpload"
        class="gap-2"
      >
        <q-icon name="upload" class="h-4 w-4" />
        Upload QR
      </ModernButton>
    </div>

    <!-- Scan Result -->
    <ModernAlert
      v-if="scanResult"
      :variant="scanResult.type === 'success' ? 'success' : scanResult.type === 'error' ? 'error' : 'info'"
    >
      <template #icon>
        <q-icon
          :name="scanResult.type === 'success' ? 'check_circle' : scanResult.type === 'error' ? 'error' : 'info'"
        />
      </template>
      {{ scanResult.message }}
    </ModernAlert>

    <!-- File Input (hidden) -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ModernButton from '@/components/ui/ModernButton.vue'
import ModernAlert from '@/components/ui/ModernAlert.vue'

interface Props {
  onScanSuccess: (data: {
    memberId: string
    name: string
    membershipNumber?: string
  }) => void
  onScanError?: (error: string) => void
  isActive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false
})

const scanning = ref(false)
const scanResult = ref<{ type: 'success' | 'error' | 'info'; message: string; data?: any } | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const streamRef = ref<MediaStream | null>(null)

const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    })

    if (videoRef.value) {
      videoRef.value.srcObject = stream
      streamRef.value = stream
      scanning.value = true
      scanResult.value = null
      startScanning()
    }
  } catch (error) {
    console.error('Camera error:', error)
    scanResult.value = {
      type: 'error',
      message: 'Failed to access camera. Please check permissions.',
    }
    props.onScanError?.('Camera access denied')
  }
}

const stopCamera = () => {
  if (streamRef.value) {
    streamRef.value.getTracks().forEach(track => track.stop())
    streamRef.value = null
  }
  if (videoRef.value) {
    videoRef.value.srcObject = null
  }
  scanning.value = false
  scanResult.value = null
}

const startScanning = () => {
  // In production, use jsQR or similar library
  // For now, simulate scanning
  const interval = setInterval(() => {
    if (!scanning.value) {
      clearInterval(interval)
      return
    }
    // Simulate QR scan (in production, decode from canvas)
    // This is a placeholder - actual QR decoding would happen here
  }, 300)
}

const handleFileUpload = () => {
  fileInputRef.value?.click()
}

const handleFileSelect = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  // In production, decode QR from image file
  // For now, simulate success
  scanResult.value = {
    type: 'info',
    message: 'QR code image uploaded. Decoding...',
  }

  // Simulate decode
  setTimeout(() => {
    // Mock data - in production, decode actual QR code
    const mockData = {
      type: 'member-checkin',
      memberId: 'm123',
      name: 'John Doe',
      membershipNumber: 'MEM-001234',
    }

    scanResult.value = {
      type: 'success',
      message: `Successfully scanned: ${mockData.name}`,
      data: mockData,
    }

    props.onScanSuccess({
      memberId: mockData.memberId,
      name: mockData.name,
      membershipNumber: mockData.membershipNumber,
    })
  }, 1000)
}
</script>

