import { ContestModel } from 'ugrade/contest/store'
import { AppFieldResolver } from 'ugrade/resolvers'
import { languageByIdResolver } from './languageByIdResolver'
import { LanguageModel, LanguageStore } from './store'

export type PermittedLanguageResolver = AppFieldResolver<
  ContestModel,
  any,
  Promise<LanguageModel[]>
>

export function permittedLanguageResolver(
  store: LanguageStore
): PermittedLanguageResolver {
  return (source, _args, context, info) => {
    const languageById = languageByIdResolver(store)
    const promises = source.permittedLanguageIds.map(id =>
      languageById(source, { id }, context, info)
    )
    return Promise.all(promises)
  }
}
