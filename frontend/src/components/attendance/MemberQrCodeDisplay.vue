<template>
  <q-card>
    <q-card-section>
      <div class="text-h6 q-mb-md">
        <q-icon name="qr_code" class="q-mr-sm" />
        Member QR Code
      </div>

      <div v-if="loading" class="text-center q-pa-lg">
        <q-spinner color="primary" size="3em" />
        <div class="text-body2 q-mt-md">Generating QR code...</div>
      </div>

      <div v-else-if="qrCodeData" class="text-center">
        <!-- QR Code Display -->
        <div class="qr-code-container q-mb-md">
          <canvas ref="qrCanvas"></canvas>
        </div>

        <!-- QR Code Data (for manual entry) -->
        <q-input
          :model-value="qrCodeData"
          readonly
          filled
          label="QR Code Data"
          class="q-mb-md"
        >
          <template v-slot:append>
            <q-btn
              flat
              round
              icon="content_copy"
              @click="copyToClipboard"
            />
          </template>
        </q-input>

        <!-- Actions -->
        <div class="row q-gutter-sm justify-center">
          <q-btn
            color="primary"
            label="Download QR Code"
            icon="download"
            @click="downloadQrCode"
          />
          <q-btn
            flat
            label="Regenerate"
            @click="generateQrCode"
            :loading="loading"
          />
        </div>

        <!-- Service Selection -->
        <div v-if="allowServiceSelection" class="q-mt-md">
          <q-select
            v-model="selectedServiceId"
            :options="serviceOptions"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            label="Service (Optional)"
            clearable
            @update:model-value="onServiceChanged"
          />
        </div>
      </div>

      <div v-else class="text-center q-pa-lg">
        <q-icon name="qr_code" size="64px" color="grey" />
        <div class="text-body2 q-mt-md">No QR code generated</div>
        <q-btn
          color="primary"
          label="Generate QR Code"
          @click="generateQrCode"
          class="q-mt-md"
          :loading="loading"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAttendanceStore } from '@/stores/attendance'
import { useQuasar } from 'quasar'
import QRCode from 'qrcode'

const props = defineProps<{
  memberId: number
  familyId?: number
  allowServiceSelection?: boolean
}>()

const $q = useQuasar()
const attendanceStore = useAttendanceStore()

const qrCodeData = ref<string | null>(null)
const loading = ref(false)
const qrCanvas = ref<HTMLCanvasElement | null>(null)
const selectedServiceId = ref<number | null>(null)

const serviceOptions = computed(() => {
  return attendanceStore.todayServices.map(service => ({
    label: `${service.name} - ${new Date(service.scheduled_date).toLocaleDateString()}`,
    value: service.id
  }))
})

const generateQrCode = async () => {
  loading.value = true
  try {
    let qrData
    if (props.familyId) {
      qrData = await attendanceStore.generateFamilyQrCode(
        props.familyId,
        selectedServiceId.value || undefined
      )
    } else {
      qrData = await attendanceStore.generateMemberQrCode(
        props.memberId,
        selectedServiceId.value || undefined
      )
    }

    qrCodeData.value = qrData.qr_code_data || qrData.qr_code?.qr_code_data

    // Generate QR code image
    if (qrCanvas.value && qrCodeData.value) {
      await QRCode.toCanvas(qrCanvas.value, qrCodeData.value, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
    }
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to generate QR code'
    })
  } finally {
    loading.value = false
  }
}

const onServiceChanged = () => {
  generateQrCode()
}

const copyToClipboard = async () => {
  if (!qrCodeData.value) return

  try {
    await navigator.clipboard.writeText(qrCodeData.value)
    $q.notify({
      type: 'positive',
      message: 'QR code data copied to clipboard',
      icon: 'check'
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to copy to clipboard'
    })
  }
}

const downloadQrCode = () => {
  if (!qrCanvas.value) return

  const url = qrCanvas.value.toDataURL('image/png')
  const link = document.createElement('a')
  link.download = `qr-code-${props.memberId}.png`
  link.href = url
  link.click()
}

onMounted(async () => {
  // Auto-generate QR code on mount
  await generateQrCode()
})
</script>

<style scoped lang="sass">
.qr-code-container
  display: flex
  justify-content: center
  padding: 16px
  background: white
  border-radius: 8px

  canvas
    max-width: 100%
    height: auto
</style>

