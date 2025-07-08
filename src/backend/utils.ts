import axios from 'axios'
import EasyDl from 'easydl'
import { createWriteStream, ensureDir, existsSync, remove, statSync } from 'fs-extra'
import https from 'node:https'
import path from 'node:path'
import { mkdirp } from 'mkdirp'
import { Entry, open } from 'yauzl'
import {} from 'easydl'
import { sendFrontendMessage } from './ipc'
import { GameStatus } from 'src/common/types/type'
import { updateGameStatus } from './download'
import { callAbortController } from './util/aborthandler/aborthandler'
interface ProgressCallback {
  (downloadedBytes: number, downloadSpeed: number, progress: number, diskWriteSpeed: number): void
}
function bytesToSize(bytes: number) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return `0 ${sizes[0]}`
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`
}

function formatETA(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}m ${secs}s`
}
const axiosClient = axios.create({
  timeout: 10 * 1000,
  httpAgent: new https.Agent({ keepAlive: true }),
})

interface DownloadArgs {
  appName: string
  url: string
  dest: string
  progressCallback?: ProgressCallback
  signal?: AbortSignal
}
function throttle<T extends (...args: any[]) => any>(
  callback: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let lastCall = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= limit) {
      lastCall = now
      callback(...args)
    }
  }
}

export const unzip = (zipPath: string, unzipToDir: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    try {
      mkdirp.sync(unzipToDir)

      open(zipPath, { lazyEntries: true }, (err, zipFile) => {
        if (err || !zipFile) {
          zipFile?.close()
          return reject(err)
        }

        zipFile.readEntry()

        zipFile.on('entry', (entry: Entry) => {
          try {
            const entryPath = path.join(unzipToDir, entry.fileName)

            if (/\/$/.test(entry.fileName)) {
              mkdirp.sync(entryPath)
              zipFile.readEntry()
            } else {
              zipFile.openReadStream(entry, (readErr, readStream) => {
                if (readErr || !readStream) {
                  zipFile.close()
                  return reject(readErr)
                }

                const file = createWriteStream(entryPath)
                readStream.pipe(file)

                file.on('finish', () => {
                  file.close(() => {
                    zipFile.readEntry()
                  })
                })

                file.on('error', (err) => {
                  zipFile.close()
                  reject(err)
                })
              })
            }
          } catch (e) {
            zipFile.close()
            reject(e)
          }
        })

        zipFile.on('end', () => {
          resolve()
        })

        zipFile.on('error', (err) => {
          zipFile.close()
          reject(err)
        })
      })
    } catch (e) {
      reject(e)
    }
  })
}
export async function downloadFile({ url, dest, appName, signal }: DownloadArgs) {
  const zipPath = path.join(dest, `${appName}.zip`)
  const pathOutDir = dest
  let fileSize = 0

  const connections = 5

  try {
    const response = await axiosClient.head(url)
    fileSize = parseInt(response.headers['content-length'], 10)
    console.log(`Expected file size: ${bytesToSize(fileSize)}`)
  } catch (error) {
    throw new Error(`Failed to get headers: ${(error as Error).message}`)
  }

  let lastBytesWritten = 0
  let lastProgressUpdateTime = Date.now()

  const throttledProgress = throttle(
    (bytes: number, speed: number, percentage: number, writingSpeed: number, eta: string) => {
      updateGameStatus({
        appName,
        folder: pathOutDir,
        status: 'downloading',
        progress: {
          bytes: bytes.toString(),
          eta: eta, // Placeholder, calculate ETA if needed
          downSpeed: speed.toString(),
          diskWriteSpeed: writingSpeed.toString(),
          percent: percentage,
        },
      })
    },
    1000, // Throttle to 1 second
  )

  try {
    await ensureDir(pathOutDir)
    const dl = new EasyDl(url, zipPath, { existBehavior: 'overwrite', connections })
    dl.on('progress', ({ total }) => {
      const { bytes = 0, speed = 0, percentage = 0 } = total
      const now = Date.now()
      const elapsed = now - lastProgressUpdateTime
      if (elapsed < 1000) return
      const byteWritten = bytes - lastBytesWritten
      const writingSpeed = byteWritten / (elapsed / 1000)
      const remainingBytes = fileSize - bytes
      const etaSeconds = speed > 0 ? remainingBytes / speed : 0
      const etaStr = formatETA(etaSeconds)

      throttledProgress(bytes, speed, percentage, writingSpeed, etaStr)

      lastProgressUpdateTime = now
      lastBytesWritten = bytes
    })

    signal?.addEventListener('abort', () => {
      dl.destroy()
    })
    dl.on('error', (err) => {
      console.error(err)
    })
    dl.on('retry', (ready) => {
      console.log(ready)
    })
    const download=  await dl.wait()

    if (!download){
      throw new Error('Download stopped or pausedd')
    }
    if (existsSync(zipPath) && statSync(zipPath).isFile()) {
      await unzip(zipPath, pathOutDir)
      await remove(zipPath)
    }
  } catch (error) {
    console.error(`Error downloading file: ${(error as Error).message}`)
    throw error
  }
}
export function stopDownload(appName: string) {
  callAbortController(appName)
  console.log(`Paused download for game: ${appName}`)
}

export function removeFolder(pathFolder: string, folderName: string) {
  const folderPath = path.join(pathFolder, folderName)
  if (existsSync(folderPath)) {
    remove(folderPath)
      .then(() => {
        console.log(`Folder ${folderName} removed successfully.`)
      })
      .catch((err) => {
        console.error(`Error removing folder ${folderName}:`, err)
      })
  } else {
    console.warn(`Folder ${folderName} does not exist at path: ${path}`)
  }
}
