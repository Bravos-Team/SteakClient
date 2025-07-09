
import { ensureDir } from 'fs-extra'
import { downloadFile, stopDownload } from '../utils'
import { InstallParams } from 'src/common/types/type'
import paths from 'path'
import { homePath } from '../constants/path'


async function installGame(params: InstallParams, signal?: AbortSignal) {
  const { appName, path } = params
  console.log(`Installing game ${appName} at path ${path}`)
  
  // Path zipURL
  const zipUrl = `https://mmatechnical.com/Download/Download-Test-File/(MMA)-500MB.zip`
  // Path to download the file
  const downloadPath = paths.join(homePath,'Games', appName)
  const outputPath = paths.join(path,appName)

  console.log(`Downloading ${appName} from ${zipUrl} to ${outputPath}`)

  // Ensure the output directory exists
  ensureDir(outputPath)

  // Download the file
  await downloadFile({
    appName,
    url: zipUrl,
    dest: outputPath,
    signal,
  })
}
async function stopDownloadFile(appName: string) {
  console.log(`Paused download for game: ${appName}`)
  stopDownload(appName) 
}
export { installGame , stopDownloadFile }
