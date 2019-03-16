import { LanguageStore } from '../store'
import lodash from 'lodash'
import { NoSuchLanguage } from '../NoSuchLanguage'
import { LanguageModel } from '../model'

export class InMemoryLanguageStore implements LanguageStore {
  private languages: LanguageModel[]
  private languageId: { [id: string]: LanguageModel }

  constructor(languages: LanguageModel[]) {
    this.languages = lodash.cloneDeep(languages)
    this.languageId = {}
    for (const lang of this.languages) {
      this.languageId[lang.id] = lang
    }
  }

  async getAvailableLanguages(): Promise<LanguageModel[]> {
    return lodash.cloneDeep(this.languages)
  }

  async getLanguageById(id: string): Promise<LanguageModel> {
    if (this.languageId[id]) {
      return lodash.cloneDeep(this.languageId[id])
    }
    throw new NoSuchLanguage('No Such Language')
  }
}
