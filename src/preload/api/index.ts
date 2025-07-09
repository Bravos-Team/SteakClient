import * as DownloadManager from './downloadmanager'
import * as App from './appmanager'
import * as Setting from './setting'


export default {
  ...Setting,
  ...DownloadManager,
  ...App,
}