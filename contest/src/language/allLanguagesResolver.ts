import { IFieldResolver } from 'graphql-tools'
import { LanguageStore } from './store'

export type AllLanguageResolver = IFieldResolver<any, any, any>

export function allLanguageResolver(store: LanguageStore): AllLanguageResolver {
  return () => store.getAvailableLanguages()
}
