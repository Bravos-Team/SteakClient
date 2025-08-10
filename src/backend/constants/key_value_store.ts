import { TypeCheckedStoreBackEnd } from '../electron_store'

export const configStore = new TypeCheckedStoreBackEnd('configStore', {
  cwd: 'store',
})

export const wineStore = new TypeCheckedStoreBackEnd('wineManager', {
  cwd: 'store',
  name: 'wine-manager',
})
