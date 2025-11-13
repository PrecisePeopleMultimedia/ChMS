import { ref, onMounted, onUnmounted } from 'vue'

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const isMobile = ref<boolean>(false)

  const checkMobile = () => {
    isMobile.value = window.innerWidth < MOBILE_BREAKPOINT
  }

  onMounted(() => {
    checkMobile()
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    mql.addEventListener('change', checkMobile)
    
    // Also listen to window resize for better responsiveness
    window.addEventListener('resize', checkMobile)
    
    return () => {
      mql.removeEventListener('change', checkMobile)
      window.removeEventListener('resize', checkMobile)
    }
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
  })

  return isMobile
}

