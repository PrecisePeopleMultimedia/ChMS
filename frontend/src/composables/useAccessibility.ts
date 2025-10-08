import { ref, onMounted, onUnmounted, nextTick } from 'vue'

/**
 * Accessibility composable for WCAG AA compliance
 * Provides utilities for screen readers, keyboard navigation, and focus management
 */
export function useAccessibility() {
  const isScreenReaderActive = ref(false)
  const currentFocusElement = ref<HTMLElement | null>(null)
  const skipLinksVisible = ref(false)

  // Screen reader detection
  function detectScreenReader() {
    // Check for common screen reader indicators
    const hasScreenReader = !!(
      window.speechSynthesis ||
      (navigator as any).userAgent.includes('NVDA') ||
      (navigator as any).userAgent.includes('JAWS') ||
      (navigator as any).userAgent.includes('VoiceOver') ||
      document.querySelector('[aria-live]') ||
      window.getComputedStyle(document.body).getPropertyValue('-ms-high-contrast')
    )
    
    isScreenReaderActive.value = hasScreenReader
    return hasScreenReader
  }

  // Announce to screen readers
  function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  // Focus management
  function focusElement(selector: string | HTMLElement, options?: FocusOptions) {
    nextTick(() => {
      let element: HTMLElement | null = null
      
      if (typeof selector === 'string') {
        element = document.querySelector(selector)
      } else {
        element = selector
      }
      
      if (element) {
        element.focus(options)
        currentFocusElement.value = element
        announceToScreenReader(`Focused on ${element.getAttribute('aria-label') || element.textContent || 'element'}`)
      }
    })
  }

  // Skip link functionality
  function showSkipLinks() {
    skipLinksVisible.value = true
  }

  function hideSkipLinks() {
    skipLinksVisible.value = false
  }

  function skipToMain() {
    focusElement('#main-content')
    announceToScreenReader('Skipped to main content')
  }

  function skipToNavigation() {
    focusElement('#main-navigation')
    announceToScreenReader('Skipped to navigation')
  }

  // Keyboard navigation helpers
  function handleKeyboardNavigation(event: KeyboardEvent, options: {
    onEscape?: () => void
    onEnter?: () => void
    onSpace?: () => void
    onArrowUp?: () => void
    onArrowDown?: () => void
    onArrowLeft?: () => void
    onArrowRight?: () => void
    onTab?: () => void
  } = {}) {
    switch (event.key) {
      case 'Escape':
        options.onEscape?.()
        break
      case 'Enter':
        options.onEnter?.()
        break
      case ' ':
        event.preventDefault()
        options.onSpace?.()
        break
      case 'ArrowUp':
        event.preventDefault()
        options.onArrowUp?.()
        break
      case 'ArrowDown':
        event.preventDefault()
        options.onArrowDown?.()
        break
      case 'ArrowLeft':
        options.onArrowLeft?.()
        break
      case 'ArrowRight':
        options.onArrowRight?.()
        break
      case 'Tab':
        options.onTab?.()
        break
    }
  }

  // ARIA helpers
  function generateId(prefix = 'a11y') {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
  }

  function setAriaExpanded(element: HTMLElement, expanded: boolean) {
    element.setAttribute('aria-expanded', expanded.toString())
  }

  function setAriaSelected(element: HTMLElement, selected: boolean) {
    element.setAttribute('aria-selected', selected.toString())
  }

  function setAriaPressed(element: HTMLElement, pressed: boolean) {
    element.setAttribute('aria-pressed', pressed.toString())
  }

  // Form accessibility helpers
  function associateErrorWithField(fieldId: string, errorId: string, hasError: boolean) {
    const field = document.getElementById(fieldId)
    if (field) {
      if (hasError) {
        field.setAttribute('aria-describedby', errorId)
        field.setAttribute('aria-invalid', 'true')
      } else {
        field.removeAttribute('aria-describedby')
        field.setAttribute('aria-invalid', 'false')
      }
    }
  }

  // Color contrast checker
  function checkColorContrast(foreground: string, background: string): {
    ratio: number
    wcagAA: boolean
    wcagAAA: boolean
  } {
    // Simple contrast ratio calculation
    const getLuminance = (color: string) => {
      const rgb = color.match(/\d+/g)?.map(Number) || [0, 0, 0]
      const [r, g, b] = rgb.map(c => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    const l1 = getLuminance(foreground)
    const l2 = getLuminance(background)
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)

    return {
      ratio,
      wcagAA: ratio >= 4.5,
      wcagAAA: ratio >= 7
    }
  }

  // Lifecycle
  onMounted(() => {
    detectScreenReader()
    
    // Add keyboard event listeners
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        showSkipLinks()
      }
    })
    
    document.addEventListener('click', hideSkipLinks)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', showSkipLinks)
    document.removeEventListener('click', hideSkipLinks)
  })

  return {
    // State
    isScreenReaderActive,
    currentFocusElement,
    skipLinksVisible,
    
    // Methods
    detectScreenReader,
    announceToScreenReader,
    focusElement,
    showSkipLinks,
    hideSkipLinks,
    skipToMain,
    skipToNavigation,
    handleKeyboardNavigation,
    generateId,
    setAriaExpanded,
    setAriaSelected,
    setAriaPressed,
    associateErrorWithField,
    checkColorContrast
  }
}
