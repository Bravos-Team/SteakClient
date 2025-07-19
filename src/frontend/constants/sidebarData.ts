import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Gamepad,
  ShoppingCart,
  Power,
  ArrowDownToLine,
} from 'lucide-vue-next'
export const navMain = [
  { title: 'Library', to: '/library', icon: Gamepad },
  { title: 'Store', to: '/store', icon: ShoppingCart },
  { title: 'Settings', to: '/settings', icon: Settings2 },
  { title: 'Logout', to: '/logout', icon: Power },
]

export const navFooter = [{ title: 'Download', to: '/download', icon: ArrowDownToLine }]
