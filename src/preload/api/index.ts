import * as DownloadManager from './downloadmanager'
import * as App from './appmanager'
import * as AuthManager from './authmanager'

export default {
  ...AuthManager,
  ...DownloadManager,
  ...App,
}