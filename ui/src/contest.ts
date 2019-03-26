import { action, observable } from 'mobx'
import { AuthStore } from './auth'

export interface Language {
  id: string
  name: string
}

export interface ContestInfo {
  id: string
  shortId: string
  name: string
  shortDescription: string
  startTime: Date
  finishTime: Date
  freezed: boolean
  description: string
  permittedLanguages: Language[]
}

export class ContestStore {
  @observable current?: ContestInfo

  private authStore: AuthStore

  constructor(auth: AuthStore) {
    this.authStore = auth
  }

  @action create = (email: string, sid: string, name: string, shortDescription: string): ContestInfo => {
    return {
      id: '',
      shortId: '',
      name: '',
      shortDescription: '',
      startTime: new Date(),
      finishTime: new Date(),
      freezed: false,
      description: '',
      permittedLanguages: [],
    }
  }
}
