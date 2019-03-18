import { Language } from './language'

export interface LanguageService {
  getAllLanguage(): Promise<Language[]>
  getLanguageById(id: string): Promise<Language>
}
