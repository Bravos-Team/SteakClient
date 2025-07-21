import { Settings2, Gamepad, ShoppingCart, Power, ArrowDownToLine } from 'lucide-vue-next'
export const navMain = [
  { title: 'Library', to: '/library', icon: Gamepad },
  { title: 'Store', to: '/store', icon: ShoppingCart },
  { title: 'Settings', to: '/settings', icon: Settings2 },
  { title: 'Logout', to: '/logout', icon: Power },
]

export const navFooter = [{ title: 'Download', to: '/download', icon: ArrowDownToLine }]
