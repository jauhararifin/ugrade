import { IFieldResolver } from 'graphql-tools'
import { LanguageStore, NoSuchLanguage } from './store'
import { ContestModel } from '../contest/store'
import { NO_SUCH_LANGUAGE } from './errors'

export interface LanguageResolvers {
  Query: {
    languages: IFieldResolver<any, any, any>
    languageById: IFieldResolver<any, any, { id: string }>
  }
  Contest: {
    permittedLanguages: IFieldResolver<ContestModel, any, any>
  }
}

export const createLanguageResolvers = (
  store: LanguageStore
): LanguageResolvers => ({
  Query: {
    languages: () => store.getAvailableLanguages(),

    languageById: async (_parent, { id }) => {
      try {
        return await store.getLanguageById(id)
      } catch (error) {
        if (error instanceof NoSuchLanguage) throw NO_SUCH_LANGUAGE
        throw error
      }
    },
  },
  Contest: {
    permittedLanguages: ({ permittedLanguageIds }) =>
      Promise.all(permittedLanguageIds.map(id => store.getLanguageById(id))),
  },
})
