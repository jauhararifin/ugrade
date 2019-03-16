import { Language } from '../language'

export interface LanguageStore {
  getLanguageById(id: string): Promise<Language>
  getAvailableLanguages(): Promise<Language[]>
}
