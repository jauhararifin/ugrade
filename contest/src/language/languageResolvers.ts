import { IFieldResolver } from 'graphql-tools'
import { LanguageStore } from './store'
import { ContestModel } from '../contest/store'

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
    languageById: (_parent, { id }) => store.getLanguageById(id),
  },
  Contest: {
    permittedLanguages: ({ permittedLanguageIds }) =>
      Promise.all(permittedLanguageIds.map(id => store.getLanguageById(id))),
  },
})
