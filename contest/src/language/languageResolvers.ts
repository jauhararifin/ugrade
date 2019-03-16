import {
  allLanguageResolver,
  AllLanguageResolver,
} from './allLanguagesResolver'
import {
  languageByIdResolver,
  LanguageByIdResolver,
} from './languageByIdResolver'
import {
  permittedLanguageResolver,
  PermittedLanguageResolver,
} from './permittedLanguagesResolver'
import { LanguageStore } from './store'

export interface LanguageResolvers {
  Query: {
    languages: AllLanguageResolver
    languageById: LanguageByIdResolver
  }
  Contest: {
    permittedLanguages: PermittedLanguageResolver
  }
}

export const createLanguageResolvers = (
  store: LanguageStore
): LanguageResolvers => ({
  Query: {
    languages: allLanguageResolver(store),
    languageById: languageByIdResolver(store),
  },
  Contest: {
    permittedLanguages: permittedLanguageResolver(store),
  },
})
