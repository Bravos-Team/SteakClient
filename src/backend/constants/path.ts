import { app } from "electron";
import path from "path";


const configApp =  app.getPath('appData')


export const appPath = path.join(configApp, 'SteakClient');