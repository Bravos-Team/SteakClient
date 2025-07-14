import { useRouter } from 'vue-router'
import { ref } from 'vue'

type NavigationAction = 'back' | 'forward' | 'refresh' | 'openInBrowser'

export function useNavigation() {
  const router = useRouter()
  const isProcessing = ref(false)
  const canGoForward = ref(false)

  // Check if browser can go forward
  const updateForwardState = () => {
    if (window.history) {
      canGoForward.value = window.history.length > 1 && window.history.state !== null
    }
  }
  // Listen for popstate events to dynamically update forward state
  window.addEventListener('popstate', () => {
    updateForwardState()
  })

  updateForwardState()

  const handleNavigation = async (action: NavigationAction, routeToUrl: string | null) => {
    if (isProcessing.value) return

    try {
      isProcessing.value = true

      switch (action) {
        case 'back':
          router.back()
          break
        case 'forward':
          if (canGoForward.value) {
            router.forward()
          }
          break
        case 'refresh':
          window.location.reload()
          break
        case 'openInBrowser':
          if (!routeToUrl) {
            console.warn('No URL provided for openInBrowser action')
            return
          }

          try {
            await window.electronAPI.openExternal(routeToUrl)
          } catch (error) {
            console.error('Failed to open URL in browser:', error)
          }
          break
        default:
          console.warn('Unknown navigation action:', action)
      }
    } finally {
      setTimeout(() => {
        updateForwardState()
        isProcessing.value = false
      }, 500)
    }
  }

  return {
    handleNavigation,
    isProcessing,
    canGoForward,
    updateForwardState,
  }
}
