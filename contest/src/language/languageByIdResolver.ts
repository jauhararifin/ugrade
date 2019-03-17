import { ApolloError } from 'apollo-server-core'
import { AppFieldResolver } from 'ugrade/resolvers'
import { LanguageModel, LanguageStore, NoSuchLanguage } from './store'

export type LanguageByIdResolver = AppFieldResolver<
  any,
  { id: string },
  Promise<LanguageModel>
>

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
