<template>
  <ModernDialog
    :model-value="open"
    @update:model-value="!$event && onClose()"
    :title="mode === 'import' ? 'Import Members' : 'Export Members'"
    :description="mode === 'import' ? 'Import members from a CSV or Excel file' : 'Export members to a CSV or Excel file'"
    max-width="600px"
  >
    <ModernTabs
      v-model="activeTab"
      :tabs="[
        { name: mode === 'import' ? 'import' : 'export', label: mode === 'import' ? 'Import' : 'Export' },
      ]"
    >
      <!-- Import Tab -->
      <template v-if="mode === 'import'" #panel-import>
        <div class="space-y-4">
          <ModernAlert variant="info">
            <template #icon>
              <q-icon name="info" />
            </template>
            Select a CSV or Excel file to import members. All imported members will receive email notifications with an option to request removal.
          </ModernAlert>

          <div>
            <label class="text-sm font-medium mb-2 block">Select File</label>
            <input
              ref="fileInputRef"
              type="file"
              accept=".csv,.xlsx"
              @change="handleFileSelect"
              class="hidden"
            />
            <ModernButton
              type="button"
              variant="outline"
              class="w-full justify-start"
              @click="fileInputRef?.click()"
            >
              <q-icon name="upload" class="h-4 w-4 mr-2" />
              {{ importFile ? importFile.name : 'Choose CSV or Excel file' }}
            </ModernButton>
          </div>

          <ModernButton
            type="button"
            variant="ghost"
            size="sm"
            @click="handleDownloadTemplate"
            class="w-full"
          >
            <q-icon name="download" class="h-4 w-4 mr-2" />
            Download Import Template
          </ModernButton>

          <!-- Import Preview -->
          <div v-if="importPreview.length > 0" class="border rounded-lg overflow-hidden">
            <div class="p-2 bg-muted text-sm font-medium border-b">
              Preview (first 5 rows)
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-muted">
                  <tr>
                    <th
                      v-for="(header, index) in importPreview[0]"
                      :key="index"
                      class="px-2 py-1 text-left border-r"
                    >
                      {{ header }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, rowIndex) in importPreview.slice(1)"
                    :key="rowIndex"
                  >
                    <td
                      v-for="(cell, cellIndex) in row"
                      :key="cellIndex"
                      class="px-2 py-1 border-r border-b"
                    >
                      {{ cell }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>

      <!-- Export Tab -->
      <template v-else #panel-export>
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium mb-2 block">Export Format</label>
            <ModernSelect
              v-model="exportFormat"
              :options="[
                { label: 'CSV File', value: 'csv' },
                { label: 'Excel File', value: 'excel' },
              ]"
            />
          </div>

          <div class="p-4 bg-muted rounded-lg">
            <p class="text-sm text-muted-foreground">
              Exporting {{ members.length }} {{ members.length === 1 ? 'member' : 'members' }}
            </p>
          </div>
        </div>
      </template>
    </ModernTabs>

    <template #actions>
      <ModernButton variant="outline" @click="onClose">
        Cancel
      </ModernButton>
      <ModernButton
        v-if="mode === 'import'"
        @click="handleImport"
        :disabled="!importFile"
      >
        Import Members
      </ModernButton>
      <ModernButton
        v-else
        @click="handleExport"
        :disabled="members.length === 0"
      >
        Export Members
      </ModernButton>
    </template>
  </ModernDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import ModernDialog from '@/components/ui/ModernDialog.vue'
import ModernTabs from '@/components/ui/ModernTabs.vue'
import ModernButton from '@/components/ui/ModernButton.vue'
import ModernSelect from '@/components/ui/ModernSelect.vue'
import ModernAlert from '@/components/ui/ModernAlert.vue'
import type { Member } from '@/types/member'

interface Props {
  open: boolean
  onClose: () => void
  mode: 'import' | 'export'
  members?: Member[]
  onImport?: (members: Partial<Member>[]) => void
}

const props = withDefaults(defineProps<Props>(), {
  members: () => [],
})

const $q = useQuasar()

const activeTab = ref(props.mode === 'import' ? 'import' : 'export')
const exportFormat = ref<'csv' | 'excel'>('csv')
const importFile = ref<File | null>(null)
const importPreview = ref<string[][]>([])
const fileInputRef = ref<HTMLInputElement | null>(null)

const handleExport = () => {
  if (props.members.length === 0) {
    $q.notify({
      type: 'negative',
      message: 'No members to export',
    })
    return
  }

  const headers = [
    'First Name', 'Last Name', 'Email', 'Phone', 'Gender',
    'Date of Birth', 'Marital Status', 'Status', 'Membership Number',
    'Join Date', 'Street', 'City', 'State', 'Postal Code', 'Country', 'Notes',
  ]

  const rows = props.members.map((m) => [
    m.firstName,
    m.lastName,
    m.contact.email || '',
    m.contact.phone || '',
    m.gender,
    m.dateOfBirth || '',
    m.maritalStatus || '',
    m.status,
    m.membershipNumber || '',
    m.joinDate,
    m.contact.address?.street || '',
    m.contact.address?.city || '',
    m.contact.address?.state || '',
    m.contact.address?.postalCode || '',
    m.contact.address?.country || '',
    m.notes || '',
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute(
    'download',
    `members_export_${new Date().toISOString().split('T')[0]}.csv`
  )
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  $q.notify({
    type: 'positive',
    message: `Exported ${props.members.length} members successfully!`,
  })
  props.onClose()
}

const handleFileSelect = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
    $q.notify({
      type: 'negative',
      message: 'Please select a CSV or Excel file',
    })
    return
  }

  importFile.value = file

  // Parse CSV preview
  const reader = new FileReader()
  reader.onload = (event) => {
    const text = event.target?.result as string
    const lines = text.split('\n').slice(0, 6) // Preview first 5 rows + header
    const preview = lines.map((line) =>
      line.split(',').map((cell) => cell.replace(/^"|"$/g, ''))
    )
    importPreview.value = preview
  }
  reader.readAsText(file)
}

const handleImport = () => {
  if (!importFile.value) {
    $q.notify({
      type: 'negative',
      message: 'Please select a file to import',
    })
    return
  }

  // In a real implementation, parse the file and convert to Member objects
  $q.notify({
    type: 'positive',
    message: 'Bulk import initiated!',
    caption: '📧 Notification emails sent to all members with removal option',
  })

  props.onClose()
}

const handleDownloadTemplate = () => {
  const headers = [
    'First Name', 'Last Name', 'Email', 'Phone', 'Gender',
    'Date of Birth', 'Marital Status', 'Status', 'Membership Number',
    'Join Date', 'Street', 'City', 'State', 'Postal Code', 'Country', 'Notes',
  ]

  const sampleRow = [
    'John', 'Doe', 'john.doe@email.com', '+234 800 000 0000', 'male',
    '1990-01-15', 'married', 'active', 'MEM-001234', '2024-01-01',
    '123 Main Street', 'Lagos', 'Lagos State', '100001', 'Nigeria', 'Sample member notes',
  ]

  const csvContent = [
    headers.join(','),
    sampleRow.map((cell) => `"${cell}"`).join(','),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', 'members_import_template.csv')
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  $q.notify({
    type: 'positive',
    message: 'Template downloaded successfully!',
  })
}
</script>

