<template>
  <div class="qr-scanner-container">
    <!-- Scanner Header -->
    <div class="scanner-header">
      <h3 class="text-h6 text-center q-mb-md">
        <q-icon name="qr_code_scanner" class="q-mr-sm" />
        QR Code Scanner
      </h3>
      <p class="text-center text-grey-6">
        Position the QR code within the frame to scan
      </p>
    </div>

    <!-- Camera View -->
    <div class="camera-container" ref="cameraContainer">
      <div v-if="!isScanning" class="camera-placeholder">
        <q-icon name="camera_alt" size="64px" color="grey-5" />
        <p class="text-grey-6 q-mt-md">Camera not active</p>
        <q-btn 
          color="primary" 
          label="Start Scanner" 
          @click="startScanner"
          :loading="isStarting"
          class="q-mt-md"
        />
      </div>
      
      <div v-else class="camera-view">
        <video ref="videoElement" class="camera-video" autoplay muted playsinline></video>
        <div class="scanner-overlay">
          <div class="scanner-frame"></div>
          <div class="scanner-corners">
            <div class="corner top-left"></div>
            <div class="corner top-right"></div>
            <div class="corner bottom-left"></div>
            <div class="corner bottom-right"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scanner Controls -->
    <div class="scanner-controls q-mt-md">
      <div class="row q-gutter-sm">
        <div class="col">
          <q-btn 
            v-if="!isScanning"
            color="primary" 
            label="Start Scanner" 
            @click="startScanner"
            :loading="isStarting"
            class="full-width"
            size="lg"
          />
          <q-btn 
            v-else
            color="negative" 
            label="Stop Scanner" 
            @click="stopScanner"
            class="full-width"
            size="lg"
          />
        </div>
        <div class="col-auto">
          <q-btn 
            icon="flash_on" 
            :color="flashOn ? 'warning' : 'grey'"
            @click="toggleFlash"
            :disable="!isScanning"
            round
            size="lg"
          />
        </div>
      </div>
    </div>

    <!-- Scan Results -->
    <div v-if="scanResult" class="scan-result q-mt-md">
      <q-card class="scan-result-card">
        <q-card-section>
          <div class="row items-center">
            <q-icon name="check_circle" color="positive" size="24px" class="q-mr-sm" />
            <div class="col">
              <div class="text-h6">QR Code Scanned Successfully!</div>
              <div class="text-caption text-grey-6">
                Member: {{ scanResult.member?.name || 'Unknown' }}
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions>
          <q-btn 
            color="primary" 
            label="Check In" 
            @click="processCheckIn"
            :loading="isProcessing"
            class="full-width"
          />
        </q-card-actions>
      </q-card>
    </div>

    <!-- Error Messages -->
    <div v-if="error" class="error-message q-mt-md">
      <q-banner class="bg-negative text-white">
        <template v-slot:avatar>
          <q-icon name="error" />
        </template>
        {{ error }}
        <template v-slot:action>
          <q-btn flat label="Dismiss" @click="clearError" />
        </template>
      </q-banner>
    </div>

    <!-- Manual Check-in Fallback -->
    <div class="manual-fallback q-mt-md">
      <q-separator />
      <div class="text-center q-py-md">
        <p class="text-grey-6 q-mb-sm">QR code not working?</p>
        <q-btn 
          color="secondary" 
          label="Manual Check-in" 
          @click="$emit('switch-to-manual')"
          outline
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useQuasar } from 'quasar';
import { useAttendanceStore } from '@/stores/attendance';

// Props
interface Props {
  serviceId: number;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  'switch-to-manual': [];
  'check-in-success': [data: any];
}>();

// Composables
const $q = useQuasar();
const attendanceStore = useAttendanceStore();

// State
const cameraContainer = ref<HTMLElement>();
const videoElement = ref<HTMLVideoElement>();
const isScanning = ref(false);
const isStarting = ref(false);
const isProcessing = ref(false);
const scanResult = ref<any>(null);
const error = ref<string | null>(null);
const flashOn = ref(false);
const stream = ref<MediaStream | null>(null);

// QR Code Detection
let quaggaInstance: any = null;

// Methods
const startScanner = async () => {
  isStarting.value = true;
  error.value = null;
  
  try {
    // Request camera permission
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment', // Use back camera on mobile
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    });
    
    stream.value = mediaStream;
    
    if (videoElement.value) {
      videoElement.value.srcObject = mediaStream;
      videoElement.value.play();
    }
    
    isScanning.value = true;
    
    // Initialize QR code detection
    await initializeQRDetection();
    
  } catch (err: any) {
    console.error('Camera access error:', err);
    error.value = 'Camera access denied. Please allow camera permission and try again.';
  } finally {
    isStarting.value = false;
  }
};

const stopScanner = () => {
  isScanning.value = false;
  
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop());
    stream.value = null;
  }
  
  if (videoElement.value) {
    videoElement.value.srcObject = null;
  }
  
  if (quaggaInstance) {
    quaggaInstance.stop();
    quaggaInstance = null;
  }
};

const initializeQRDetection = async () => {
  try {
    // Dynamic import of QuaggaJS
    const Quagga = await import('quagga');
    
    quaggaInstance = Quagga.default.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: videoElement.value,
        constraints: {
          width: 640,
          height: 480,
          facingMode: "environment"
        }
      },
      decoder: {
        readers: ["qr_reader"]
      },
      locate: true,
      locator: {
        patchSize: "medium",
        halfSample: true
      }
    }, (err: any) => {
      if (err) {
        console.error('Quagga initialization error:', err);
        error.value = 'Failed to initialize QR scanner';
        return;
      }
      
      quaggaInstance.start();
    });
    
    // Listen for successful scans
    quaggaInstance.onDetected((result: any) => {
      if (result && result.codeResult) {
        handleQRCodeDetected(result.codeResult.code);
      }
    });
    
  } catch (err) {
    console.error('QR detection setup error:', err);
    error.value = 'Failed to setup QR code detection';
  }
};

const handleQRCodeDetected = async (qrCodeData: string) => {
  try {
    // Stop scanning to prevent multiple detections
    stopScanner();
    
    // Validate QR code
    const validation = await attendanceStore.validateQrCode(qrCodeData);
    
    if (validation.valid) {
      scanResult.value = validation.data;
      
      // Play success sound
      playSuccessSound();
      
      // Show success notification
      $q.notify({
        type: 'positive',
        message: 'QR code scanned successfully!',
        position: 'top',
        timeout: 2000
      });
    } else {
      throw new Error(validation.message);
    }
    
  } catch (err: any) {
    console.error('QR code validation error:', err);
    error.value = err.message || 'Invalid QR code';
    
    // Restart scanner after error
    setTimeout(() => {
      startScanner();
    }, 2000);
  }
};

const processCheckIn = async () => {
  if (!scanResult.value || !scanResult.value.member) return;
  
  isProcessing.value = true;
  
  try {
    const attendance = await attendanceStore.checkInWithQr(
      scanResult.value.qr_code_data,
      props.serviceId
    );
    
    // Emit success event
    emit('check-in-success', attendance);
    
    // Show success notification
    $q.notify({
      type: 'positive',
      message: `${scanResult.value.member.name} checked in successfully!`,
      position: 'top',
      timeout: 3000
    });
    
    // Reset scanner
    scanResult.value = null;
    
  } catch (err: any) {
    console.error('Check-in error:', err);
    error.value = err.message || 'Failed to check in member';
  } finally {
    isProcessing.value = false;
  }
};

const toggleFlash = () => {
  if (!stream.value) return;
  
  const videoTrack = stream.value.getVideoTracks()[0];
  if (videoTrack && videoTrack.getCapabilities) {
    const capabilities = videoTrack.getCapabilities();
    if (capabilities.torch) {
      videoTrack.applyConstraints({
        advanced: [{ torch: !flashOn.value }]
      });
      flashOn.value = !flashOn.value;
    }
  }
};

const playSuccessSound = () => {
  // Create a simple beep sound
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
};

const clearError = () => {
  error.value = null;
};

// Lifecycle
onMounted(() => {
  // Check for camera support
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    error.value = 'Camera not supported on this device';
  }
});

onUnmounted(() => {
  stopScanner();
});
</script>

<style lang="sass" scoped>
.qr-scanner-container
  max-width: 100%
  margin: 0 auto

.camera-container
  position: relative
  width: 100%
  height: 300px
  background: #000
  border-radius: 12px
  overflow: hidden

.camera-placeholder
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  height: 100%
  color: #666

.camera-view
  position: relative
  width: 100%
  height: 100%

.camera-video
  width: 100%
  height: 100%
  object-fit: cover

.scanner-overlay
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  display: flex
  align-items: center
  justify-content: center

.scanner-frame
  width: 200px
  height: 200px
  border: 2px solid rgba(255, 255, 255, 0.3)
  border-radius: 12px
  position: relative

.scanner-corners
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%

.corner
  position: absolute
  width: 20px
  height: 20px
  border: 3px solid #4CAF50

  &.top-left
    top: -3px
    left: -3px
    border-right: none
    border-bottom: none

  &.top-right
    top: -3px
    right: -3px
    border-left: none
    border-bottom: none

  &.bottom-left
    bottom: -3px
    left: -3px
    border-right: none
    border-top: none

  &.bottom-right
    bottom: -3px
    right: -3px
    border-left: none
    border-top: none

.scan-result-card
  border-left: 4px solid #4CAF50

.error-message
  .q-banner
    border-radius: 8px

.manual-fallback
  .q-separator
    margin: 16px 0

// Mobile optimizations
@media (max-width: 768px)
  .camera-container
    height: 250px
  
  .scanner-frame
    width: 150px
    height: 150px
  
  .corner
    width: 15px
    height: 15px
    border-width: 2px
</style>
