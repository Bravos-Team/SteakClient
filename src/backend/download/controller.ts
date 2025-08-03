import { ensureDir } from 'fs-extra'
import { downloadFile, stopDownload, toPascalCase } from '../utils'
import { DMQueueElement, DownloadInfo } from 'src/common/types/type'
import paths from 'path'
import { updateGameStatus } from './events'
import { notify } from '../dialog/dialog'

async function installGame(element: DMQueueElement, signal?: AbortSignal) {
  const { appName, path, gameInfo } = element.params
  const { fileName } = element.downloadInfo as DownloadInfo
  console.log(`Installing game ${appName} at path ${path}`)

  // Path zipURL
  const zipUrl = `https://mmatechnical.com/Download/Download-Test-File/(MMA)-500MB.zip`

  // Path to download the file
  // const downloadPath = paths.join(homePath, 'Games', appName)
  const outputPath = paths.join(path, appName.toString())

  // console.log(`Downloading ${appName} from ${zipUrl} to ${outputPath}`)

  notify({
    title: gameInfo.details.title,
    body: `Installing ...`,
  })
  updateGameStatus({
    appName,
    status: 'installing',
    folder: outputPath,
  })

  console.log(`Installing game ${appName} at path ${123}`)

  // Ensure the output directory exists
  ensureDir(outputPath)

  // Download the file
  await downloadFile({
    fileName,
    url: zipUrl,
    dest: outputPath,
    signal,
  })
}
async function stopDownloadFile(appName: string) {
  console.log(`Paused download for game: ${appName}`)
  stopDownload(appName)
}
export { installGame, stopDownloadFile }
