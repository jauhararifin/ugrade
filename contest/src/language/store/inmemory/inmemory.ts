import { LanguageStore } from '../store'
import { Language } from '../../language'
import lodash from 'lodash'
import { NoSuchLanguage } from '../NoSuchLanguage'

export class InMemoryLanguageStore implements LanguageStore {
  private languages: Language[]
  private languageId: { [id: string]: Language }

  constructor(languages: Language[]) {
    this.languages = lodash.cloneDeep(languages)
    this.languageId = {}
    for (const lang of this.languages) {
      this.languageId[lang.id] = lang
    }
  }

  async getAvailableLanguages(): Promise<Language[]> {
    return lodash.cloneDeep(this.languages)
  }

  async getLanguageById(id: string): Promise<Language> {
    if (this.languageId[id]) {
      return lodash.cloneDeep(this.languageId[id])
    }
    throw new NoSuchLanguage('No Such Language')
  }
}
