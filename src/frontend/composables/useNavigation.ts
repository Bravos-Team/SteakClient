import { useRouter } from 'vue-router'

type NavigationAction = 'back' | 'forward' | 'refresh' | 'openInBrowser'

export function useNavigation() {
  const router = useRouter()

  const handleNavigation = (action: NavigationAction) => {
    switch (action) {
      case 'back':
        router.back()
        break
      case 'forward':
        router.forward()
        break
      case 'refresh':
        window.location.reload()
        break
      case 'openInBrowser':
        window.open(window.location.href, '_blank')
        break
      default:
        console.warn('Unknown navigation action:', action)
    }
  }

  return {
    handleNavigation,
  }
}
