import { AppFieldResolver } from 'ugrade/resolvers'
import { LanguageModel, LanguageStore } from './store'

export type AllLanguageResolver = AppFieldResolver<
  any,
  any,
  Promise<LanguageModel[]>
>

export function allLanguageResolver(store: LanguageStore): AllLanguageResolver {
  return () => store.getAvailableLanguages()
}
