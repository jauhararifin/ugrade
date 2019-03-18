import lodash from 'lodash'
import { Language } from '../language'
import { NoSuchLanguage } from '../NoSuchLanguage'
import { LanguageService } from '../service'
import { languageServiceValidator as validator } from '../validations'
import { availableLanguages } from './fixture'

export class InMemoryLanguageService implements LanguageService {
  private languages: Language[]
  private languageId: { [id: string]: Language }

  constructor(languages: Language[] = availableLanguages) {
    this.languages = lodash.cloneDeep(languages)
    this.languageId = {}
    for (const lang of this.languages) {
      this.languageId[lang.id] = lang
    }
  }

  async getAllLanguage(): Promise<Language[]> {
    return lodash.cloneDeep(this.languages)
  }

  async getLanguageById(id: string): Promise<Language> {
    await validator.getLanguageById(id)
    if (this.languageId[id]) {
      return lodash.cloneDeep(this.languageId[id])
    }
    throw new NoSuchLanguage()
  }
}
