import { Settings2, Gamepad, ShoppingCart, Power, ArrowDownToLine } from 'lucide-vue-next'
export const navMain = [
  {key : 'library', title: 'Library', to: '/library', icon: Gamepad },
  { key: 'store', title: 'Store', to: '/store', icon: ShoppingCart },
  { key: 'settings', title: 'Settings', to: '/settings', icon: Settings2 },
  { key: 'logout', title: 'Logout', to: '/logout', icon: Power },
]

export const navFooter = [{ key: 'download', title: 'Download', to: '/download', icon: ArrowDownToLine }]
