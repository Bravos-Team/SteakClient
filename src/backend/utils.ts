import axios from 'axios'
import EasyDl from 'easydl'
import { createWriteStream, ensureDir, existsSync, remove, statSync } from 'fs-extra'
import https from 'node:https'
import path from 'node:path'
import { mkdirp } from 'mkdirp'
import { Entry, open } from 'yauzl'
import { updateGameStatus } from './download'
import { callAbortController } from './util/aborthandler/aborthandler'
import { exec, spawn } from 'node:child_process'
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
export const axiosClient = axios.create({
  timeout: 10 * 1000,
  httpAgent: new https.Agent({ keepAlive: true }),
})

interface DownloadArgs {
  fileName: string
  url: string
  dest: string
  progressCallback?: ProgressCallback
  signal?: AbortSignal
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
export async function downloadFile({ url, dest, fileName, signal }: DownloadArgs) {
  const zipPath = path.join(dest, `${fileName}`)
  const pathOutDir = dest
  let fileSize = 0
  console.log(`Starting download from ${pathOutDir} to ${zipPath}`)

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
        appName: fileName,
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
    const download = await dl.wait()

    if (!download) {
      throw new Error('Download stopped or pausedd')
    }
    if (existsSync(zipPath) && statSync(zipPath).isFile()) {
      // await extractFile(zipPath, pathOutDir)
      // await extractFileTarZst(zipPath, pathOutDir)
      // console.log(`Extracting tar.zst file: ${zipPath} to ${pathOutDir}`)
      // const zipFileTar = zipPath.replace('.tar.zst', '.tar')
      // console.log(`Extracting tar file: ${zipFileTar} to ${pathOutDir}`)
      // await extractFileTar(zipFileTar, pathOutDir)
      // console.log(`Download and extraction completed successfully.`)
      console.log(dest + ' ' + path.basename(zipPath))

      removeFolder(dest, path.basename(zipPath))
      const tarPath = zipPath.replace(/\.zst$/, '') // -> path/to/xxx.tar
      removeFolder(tarPath, path.basename(tarPath))
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
export function toPascalCase(str: string): string {
  return str
    .trim() // loại bỏ khoảng trắng đầu/cuối
    .split(/\s+/) // tách theo 1 hoặc nhiều khoảng trắng
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

function runCommand(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) return reject(stderr || err)
      resolve()
    })
  })
}

// export function extractFileTarZst(zstPath: string, dest: string): Promise<void> {
//   return new Promise((resolve, reject) => {
//     const tarPath = zstPath.replace(/\.zst$/, '') // -> path/to/xxx.tar

//     const command = `zstd -d --long=31 ${zstPath} -o ${tarPath}`
//     runCommand(command)
//       .then(() => {
//         console.log(`Extracted ${tarPath} to ${dest}`)
//         resolve()
//       })
//       .catch((error) => {
//         console.error(`Error extracting tar.zst file: ${error}`)
//         reject(error)
//       })
//   })
// }
// export function extractFileTar(tarPath: string, dest: string): Promise<void> {
//   return new Promise((resolve, reject) => {
//     const command = `tar -xf ${tarPath} -C ${dest}`
//     runCommand(command)
//       .then(() => {
//         console.log(`Extracted ${tarPath} to ${dest}`)
//         resolve()
//       })
//       .catch((error) => {
//         console.error(`Error extracting tar file: ${error}`)
//         reject(error)
//       })
//   })
// }

export function extractFile(zstPath: string, dest: string): Promise<void> {
  const tarPath = zstPath.replace(/\.zst$/, '') // -> path/to/xxx.tar
  return new Promise((resolve, reject) => {
    if (process.platform === 'win32') {
      const zstdPath = path.join(process.resourcesPath, 'public', 'tools', 'zstd.exe')
      const zstd = spawn(zstdPath, ['-d', '--long=31', zstPath, '-o', tarPath], { cwd: dest })
      zstd.on('close', (code) => {
        if (code !== 0) {
          console.error(`zstd extraction failed with code ${code}`)
          return reject(new Error(`Failed to extract ${zstPath}`))
        }
        console.log(`Extracted ${tarPath} to ${dest}`)
        const tarExePath = path.join(process.resourcesPath, 'public', 'tools', 'tar.exe')
        const tar = spawn(tarExePath, ['-xf', tarPath, '-C', dest])
        tar.on('close', (code) => {
          if (code !== 0) {
            console.error(`tar extraction failed with code ${code}`)
            return reject(new Error(`Failed to extract ${tarPath}`))
          }
          console.log(`Extracted ${tarPath} to ${dest}`)
          resolve()
        })
      })
      zstd.stderr.on('data', (data) => {
        console.error(`[zstd error]: ${data}`)
      })
      zstd.on('error', (err) => {
        console.error(`Error extracting zst file: ${err}`)
        reject(err)
      })
    } else {
      const zstdCommand = `zstd -d --long=31 ${zstPath} -o ${tarPath}`
      const tarCommand = `tar -xf ${tarPath} -C ${dest}`
      runCommand(zstdCommand)
        .then(() => runCommand(tarCommand))
        .then(() => resolve())
        .catch(reject)
    }
  })
}
export function extractFileTar(tarPath: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const command = `tar -xf ${tarPath} -C ${dest}`
    runCommand(command)
      .then(() => {
        console.log(`Extracted ${tarPath} to ${dest}`)
        resolve()
      })
      .catch((error) => {
        console.error(`Error extracting tar file: ${error}`)
        reject(error)
      })
  })
}

export function launchGame(exePath: string, workingDir: string) {
  const child = spawn(exePath, {
    cwd: workingDir,
    detached: true,
    stdio: 'ignore',
  })
  if (child.stdout) {
    child.stdout.on('data', (data) => {
      console.log(`[stdout] ${data}`)
    })
  }

  if (child.stderr) {
    child.stderr.on('data', (data) => {
      console.error(`[stderr] ${data}`)
    })
  }

  child.on('close', (code) => {
    console.log(`Game exited with code ${code}`)
  })

  child.on('error', (err) => {
    console.error('Failed to launch game:', err)
  })

  child.unref()
}
