import { ensureDir, existsSync } from 'fs-extra'
import {
  downloadFile,
  extractFileTar,
  extractFileTarZst,
  removeFolder,
  stopDownload,
} from '../utils'

import paths from 'path'
import { updateGameStatus } from './events'
import { notify } from '../dialog/dialog'
import { statSync } from 'fs'
import { DMQueueElement, DownloadInfo } from './type'

async function installGame(element: DMQueueElement, signal?: AbortSignal) {
  const { id, path, gameInfo } = element.params

  const { fileName, downloadUrl } = element.downloadInfo as DownloadInfo
  console.log(`Installing game ${id} at path ${path}`)

  // Path zipURL
  const testUrl = `https://mmatechnical.com/Download/Download-Test-File/(MMA)-500MB.zip`


  const outputPath = paths.join(path, id.toString())


  notify({
    title: gameInfo.details.title,
    body: `Installing ...`,
  })
  updateGameStatus({
    id: id,
    status: 'installing',
    folder: outputPath,
  })

  console.log(`Installing game ${id} at path ${123}`)

  // Ensure the output directory exists
  ensureDir(outputPath)

  // Download the file
  await downloadFile({
    fileName,
    url: downloadUrl,
    dest: outputPath,
    progressCallback: (downloadedBytes, downloadSpeed, progress, diskWriteSpeed, eta) => {
      updateGameStatus({
        id,
        folder: outputPath,
        status: 'downloading',
        progress: {
          bytes: downloadedBytes.toString(),
          eta,
          downSpeed: downloadSpeed.toString(),
          diskWriteSpeed: diskWriteSpeed.toString(),
          percent: progress,
        },
      })
    },
    signal,
  })
  const zipPath = paths.join(outputPath, `${fileName}`)
  if (existsSync(zipPath) && statSync(zipPath).isFile()) {
    const tarPath = zipPath.replace(/\.zst$/, '')
    console.log(`Extracting ${zipPath} to ${tarPath}`)

    await extractFileTarZst(zipPath, tarPath)
    removeFolder(outputPath, paths.basename(zipPath))
    // -> path/to/xxx.tar
    await extractFileTar(tarPath, outputPath)
    removeFolder(outputPath, paths.basename(tarPath))
  }
}
async function stopDownloadFile(id: string) {
  console.log(`Paused download for game: ${id}`)
  stopDownload(id)
}
export { installGame, stopDownloadFile }
