import { LanguageModel } from './model'

export interface LanguageStore {
  getLanguageById(id: string): Promise<LanguageModel>
  getAvailableLanguages(): Promise<LanguageModel[]>
}
