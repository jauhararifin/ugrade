import { IFieldResolver } from 'graphql-tools'
import { ContestModel } from 'ugrade/contest/store'
import { languageByIdResolver } from './languageByIdResolver'
import { LanguageStore } from './store'

export type PermittedLanguageResolver = IFieldResolver<ContestModel, any, any>

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
