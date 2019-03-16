import { ApolloError } from 'apollo-server-core'
import { IFieldResolver } from 'graphql-tools'
import { LanguageStore, NoSuchLanguage } from './store'

export type LanguageByIdResolver = IFieldResolver<any, any, { id: string }>

export function languageByIdResolver(
  store: LanguageStore
): LanguageByIdResolver {
  return async (_parent, { id }) => {
    try {
      return await store.getLanguageById(id)
    } catch (error) {
      if (error instanceof NoSuchLanguage) {
        throw new ApolloError('No Such Language', 'NO_SUCH_LANGUAGE')
      }
      throw error
    }
  }
}
