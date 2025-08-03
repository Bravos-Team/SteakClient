import { addHandler } from '../ipc'
import { showDialog } from './dialog'

addHandler('openFolder', async (e, path: string) => {
  const result = await showDialog({
    title: 'Select Folder',
    defaultPath: path,
    properties: {
      openDirectory: true,
      createDirectory: true,
      noResolveAliases: true,
      showHiddenFiles: false,
    },
  })
  return result.length > 0 ? result[0] : null
})
addHandler('openFile', async (e, path: string) => {
  const result = await showDialog({
    title: 'Select File',
    defaultPath: path,
    filters: [
      { name: 'All Files', extensions: ['*'] },
      { name: 'Executable Files', extensions: ['exe', 'app', 'sh'] },
      { name: 'Game Files', extensions: ['exe', 'app', 'sh', 'bat'] },
    ],

    properties: {
      openFile: true,
      createDirectory: true,
      noResolveAliases: true,
    },
  })
  return result.length > 0 ? result[0] : null
})
