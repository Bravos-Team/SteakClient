// export class TypeCheckedStoreBackEnd<Name extends>

import { Get } from 'type-fest'
import { AppSettings, DMQueueElement, InstalledInfo, UserInfo, WindowProps } from './type'

export interface StoreStructure {
  configStore: {
    userHome: string
    userInfo: UserInfo
    // theme: string
    // zoomPercent: number
    // contentFontFamily: string
    // actionsFontFamily: string
    // disableDialogBackdropClose: boolean
    // language: string
    // 'general-logs': {
    //   currentLogFile: string
    //   lastLogFile: string
    //   legendaryLogFile: string
    //   gogdlLogFile: string
    //   nileLogFile: string
    // }
    'window-props': WindowProps
    settings: AppSettings
  }
  timestampStore: {
    [K: string]: {
      firstPlayed: string
      lastPlayed: string
      totalPlayed: number
    }
  }
  downloadManager: {
    installedGames: Record<string, InstalledInfo>
    queue: DMQueueElement[]
    finished: DMQueueElement[]
  }
  wikiGameInfo: {
    [title: string]: ''
  }
  migrationsStore: {
    appliedMigrations: string[]
  }
}

export type ValidStoreName = keyof StoreStructure

export type UnknownGuard<T> = unknown extends T ? ([T] extends [null] ? T : never) : T
export interface TypeCheckStore<Name extends ValidStoreName> {
  has(key: string): boolean
  get<KeyType extends string>(
    key: KeyType,
    defaultValue: NonNullable<UnknownGuard<Get<StoreStructure[Name], KeyType>>>,
  ): NonNullable<UnknownGuard<Get<StoreStructure[Name], KeyType>>>

  get_nodefault<KeyType extends string>(
    key: KeyType,
  ): UnknownGuard<Get<StoreStructure[Name], KeyType> | undefined>

  set<KeyType extends string>(
    key: KeyType,
    value: NonNullable<UnknownGuard<Get<StoreStructure[Name], KeyType>>>,
  ): void

  delete<KeyType extends string>(key: KeyType): void

  clear(): void
}
