import { app } from 'electron'
import path from 'path'

const configApp = app.getPath('appData')
const homeApp = app.getPath('home')
const appName = app.getName()
export const configPath = path.join(configApp, appName, 'config.json')
export const appPath = path.join(configApp, appName)
export const homePath = path.join(homeApp, appName)
