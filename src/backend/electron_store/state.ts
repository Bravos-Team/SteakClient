import { TypeCheckedStoreBackEnd } from './manager'

export const wineStore = new TypeCheckedStoreBackEnd('wineManager', {
  cwd: 'store',
  name: 'wine-manager',
})

export const configStore = new TypeCheckedStoreBackEnd('configStore', {
  cwd: 'store',
  name: 'config-store',
})

export const downloadStore = new TypeCheckedStoreBackEnd('downloadManager', {
  cwd: 'store',
  name: 'download-manager',
})
  