import axios from 'axios'
import https from 'node:https'
export type Type =
  | 'Wine-GE'
  | 'GE-Proton'
  | 'Proton'
  | 'Wine-Lutris'
  | 'Wine-Kron4ek'
  | 'Wine-Crossover'
  | 'Wine-Staging-macOS'
  | 'Game-Porting-Toolkit'

interface fetchProps {
  url: string
  type: Type
  count: number
}
function getVersionName(type: string, tag_name: string): string {
  if (type.includes('Wine')) {
    return `Wine-${tag_name}`
  } else {
    return tag_name
  }
}
export interface VersionInfo {
  version: string
  type: Type
  date: string
  download: string
  downsize: number
  disksize: number
  checksum: string
}
 
export async function fetchReleases({ url, type, count }: fetchProps): Promise<VersionInfo[]> {
  const releases: Array<VersionInfo> = []
  return new Promise((resolve, reject) => {
    axiosClient
      .get(url + '?per_page=' + count)
      .then((data) => {
        for (const release of data.data) {
          const release_data = {} as VersionInfo
          release_data.version = getVersionName(type, release.tag_name)
          release_data.type = type
          release_data.date = release.published_at.split('T')[0]
          release_data.disksize = 0

          for (const asset of release.assets) {
            if (asset.name.endsWith('sha512sum')) {
              release_data.checksum = asset.browser_download_url
            } else if (asset.name.endsWith('tar.gz') || asset.name.endsWith('tar.xz')) {
              release_data.download = asset.browser_download_url
              release_data.downsize = asset.size
            }
          }

          releases.push(release_data)
        }

        // sort out specific versions like LoL or diablo wine
        const latest = releases.find((release) => /\d+-\d+$/.test(release.version)) ?? releases[0]
        // add latest to list
        releases.unshift({
          version: `${latest.type}-latest`,
          type: latest.type,
          date: latest.date,
          download: latest.download,
          downsize: latest.downsize,
          disksize: latest.disksize,
          checksum: latest.checksum,
        })

        resolve(releases)
      })
      .catch((error) => {
        reject(new Error(`Could not fetch available releases from ${url} with error:\n ${error}`))
      })
  })
}
const axiosClient = axios.create({
  timeout: 10 * 1000,
  httpsAgent: new https.Agent({ keepAlive: true }),
})
