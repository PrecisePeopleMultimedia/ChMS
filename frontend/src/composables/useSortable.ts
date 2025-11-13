import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import Sortable, { type SortableEvent } from 'sortablejs'

interface UseSortableOptions {
  onEnd?: (event: SortableEvent) => void
  onStart?: (event: SortableEvent) => void
  handle?: string
  disabled?: boolean
  animation?: number
  ghostClass?: string
  chosenClass?: string
  dragClass?: string
}

export function useSortable(
  el: Ref<HTMLElement | null>,
  options: UseSortableOptions = {}
) {
  const sortableInstance = ref<Sortable | null>(null)
  const isDragging = ref(false)

  const {
    onEnd,
    onStart,
    handle,
    disabled = false,
    animation = 150,
    ghostClass = 'sortable-ghost',
    chosenClass = 'sortable-chosen',
    dragClass = 'sortable-drag',
  } = options

  onMounted(() => {
    if (!el.value) return

    sortableInstance.value = new Sortable(el.value, {
      handle,
      animation,
      ghostClass,
      chosenClass,
      dragClass,
      disabled,
      onStart: (event: SortableEvent) => {
        isDragging.value = true
        onStart?.(event)
      },
      onEnd: (event: SortableEvent) => {
        isDragging.value = false
        onEnd?.(event)
      },
    })
  })

  onUnmounted(() => {
    sortableInstance.value?.destroy()
    sortableInstance.value = null
  })

  const enable = () => {
    if (sortableInstance.value) {
      sortableInstance.value.option('disabled', false)
    }
  }

  const disable = () => {
    if (sortableInstance.value) {
      sortableInstance.value.option('disabled', true)
    }
  }

  return {
    sortableInstance,
    isDragging,
    enable,
    disable,
  }
}

