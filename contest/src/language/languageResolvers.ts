import { IFieldResolver } from 'graphql-tools'
import { LanguageStore } from './store'

export interface LanguageResolvers {
  languages: IFieldResolver<any, any, any>
  languageById: IFieldResolver<any, any, { id: string }>
}

export const createLanguageResolvers = (
  store: LanguageStore
): LanguageResolvers => ({
  languages: () => {
    return store.getAvailableLanguages()
  },
  languageById: (_parent, { id }) => {
    return store.getLanguageById(id)
  },
})
