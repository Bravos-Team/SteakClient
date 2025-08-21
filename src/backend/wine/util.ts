import { axiosClient } from '../utils'
import { fetchProps, VersionInfo } from './type'

function getVersionName(type: string, tag_name: string): string {
  if (type.includes('Wine')) {
    return `Wine-${tag_name}`
  } else {
    return tag_name
  }
}

/**
 * Configuration Manager để lưu/load settings
 */
// export class ConfigManager {
//   private configPath: string;
//   private config: any = {};

//   constructor(configFileName: string = 'wine-manager.json') {
//     const { homeDirectory } = SystemUtils.getCurrentUser();
//     this.configPath = path.join(homeDirectory, '.config', configFileName);
//     this.loadConfig();
//   }

//   private async loadConfig(): Promise<void> {
//     try {
//       if (SystemUtils.fileExists(this.configPath)) {
//         const data = await fs.promises.readFile(this.configPath, 'utf8');
//         this.config = JSON.parse(data);
//       }
//     } catch (error) {
//       console.warn(`Failed to load config: ${error}`);
//       this.config = {};
//     }
//   }

//   async saveConfig(): Promise<void> {
//     try {
//       const configDir = path.dirname(this.configPath);
//       await SystemUtils.createDirectory(configDir);

//       await fs.promises.writeFile(
//         this.configPath,
//         JSON.stringify(this.config, null, 2),
//         'utf8'
//       );
//     } catch (error) {
//       console.error(`Failed to save config: ${error}`);
//     }
//   }

//   get<T>(key: string, defaultValue?: T): T {
//     const keys = key.split('.');
//     let value = this.config;

//     for (const k of keys) {
//       value = value?.[k];
//     }

//     return value !== undefined ? value : defaultValue;
//   }

//   set(key: string, value: any): void {
//     const keys = key.split('.');
//     let current = this.config;

//     for (let i = 0; i < keys.length - 1; i++) {
//       const k = keys[i];
//       if (!current[k]) current[k] = {};
//       current = current[k];
//     }

//     current[keys[keys.length - 1]] = value;
//   }
// }
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
