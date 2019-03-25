import { Language } from './language'

export interface LanguageService {
  getAllLanguages(): Promise<Language[]>
  getLanguageById(id: string): Promise<Language>
}
