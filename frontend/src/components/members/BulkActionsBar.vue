<template>
  <Teleport to="body">
    <Transition name="slide-up">
      <div
        v-if="selectedMembers.length > 0"
        class="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4"
      >
        <ModernCard class="shadow-2xl border-2 border-primary px-4 py-3">
          <div class="flex items-center gap-3">
            <!-- Selection Count -->
            <div class="flex items-center gap-2">
              <ModernBadge variant="default" class="text-sm px-3 py-1">
                {{ selectedMembers.length }} selected
              </ModernBadge>
              <q-btn
                flat
                round
                dense
                icon="close"
                size="sm"
                class="h-8 w-8"
                @click="onClearSelection"
              />
            </div>

            <div class="h-8 w-px bg-border" />

            <!-- Quick Actions -->
            <div class="flex items-center gap-2">
              <!-- Message -->
              <ModernButton
                variant="outline"
                size="sm"
                @click="onMessage(selectedMembers)"
                class="gap-2"
              >
                <q-icon name="message" class="h-4 w-4" />
                Message
              </ModernButton>

              <!-- Export Dropdown -->
              <q-btn-dropdown
                outline
                size="sm"
                label="Export"
                class="gap-2"
              >
                <q-list>
                  <q-item clickable @click="onExport('csv', selectedMembers)">
                    <q-item-section avatar>
                      <q-icon name="description" />
                    </q-item-section>
                    <q-item-section>CSV File</q-item-section>
                  </q-item>
                  <q-item clickable @click="onExport('excel', selectedMembers)">
                    <q-item-section avatar>
                      <q-icon name="table_chart" />
                    </q-item-section>
                    <q-item-section>Excel File</q-item-section>
                  </q-item>
                  <q-item clickable @click="onExport('pdf', selectedMembers)">
                    <q-item-section avatar>
                      <q-icon name="picture_as_pdf" />
                    </q-item-section>
                    <q-item-section>PDF Report</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>

              <!-- More Actions -->
              <q-btn-dropdown
                outline
                size="sm"
                label="More"
                class="gap-2"
              >
                <q-list>
                  <q-item
                    v-if="onAddToGroup"
                    clickable
                    @click="onAddToGroup(selectedMembers)"
                  >
                    <q-item-section avatar>
                      <q-icon name="group_add" />
                    </q-item-section>
                    <q-item-section>Add to Group</q-item-section>
                  </q-item>
                  <q-item
                    v-if="onAddTags"
                    clickable
                    @click="onAddTags(selectedMembers)"
                  >
                    <q-item-section avatar>
                      <q-icon name="label" />
                    </q-item-section>
                    <q-item-section>Add Tags</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item
                    clickable
                    class="text-destructive"
                    @click="showDeleteDialog = true"
                  >
                    <q-item-section avatar>
                      <q-icon name="delete" />
                    </q-item-section>
                    <q-item-section>Delete Selected</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
          </div>
        </ModernCard>
      </div>
    </Transition>
  </Teleport>

  <!-- Delete Confirmation Dialog -->
  <ModernDialog
    v-model="showDeleteDialog"
    title="Delete Members?"
    description="This action cannot be undone. This will permanently delete the selected members and remove their data from the database."
    max-width="500px"
  >
    <div v-if="selectedMembers.length <= 5" class="mt-4 space-y-1">
      <p class="font-medium text-foreground">Members to be deleted:</p>
      <p
        v-for="member in selectedMembers"
        :key="member.id"
        class="text-sm"
      >
        • {{ member.firstName }} {{ member.lastName }}
      </p>
    </div>

    <template #actions>
      <ModernButton variant="outline" @click="showDeleteDialog = false">
        Cancel
      </ModernButton>
      <ModernButton
        variant="destructive"
        @click="handleDelete"
      >
        Delete {{ selectedMembers.length }} Members
      </ModernButton>
    </template>
  </ModernDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ModernCard from '@/components/ui/ModernCard.vue'
import ModernButton from '@/components/ui/ModernButton.vue'
import ModernBadge from '@/components/ui/ModernBadge.vue'
import ModernDialog from '@/components/ui/ModernDialog.vue'
import type { Member } from '@/types/member'

interface Props {
  selectedMembers: Member[]
  onClearSelection: () => void
  onExport: (format: 'csv' | 'excel' | 'pdf', members: Member[]) => void
  onDelete: (members: Member[]) => void
  onMessage: (members: Member[]) => void
  onAddToGroup?: (members: Member[]) => void
  onAddTags?: (members: Member[]) => void
}

const props = defineProps<Props>()

const showDeleteDialog = ref(false)

const handleDelete = () => {
  props.onDelete(props.selectedMembers)
  showDeleteDialog.value = false
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translate(-50%, 20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
</style>

