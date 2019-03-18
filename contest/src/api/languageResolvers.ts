import { ContestModel } from 'ugrade/contest/store'
import { Language, LanguageService } from 'ugrade/language'
import { AppFieldResolver } from './resolvers'
import { wrap } from './wrap'

export type AllLanguageResolver = AppFieldResolver<
  any,
  any,
  Promise<Language[]>
>

export type LanguageByIdResolver = AppFieldResolver<
  any,
  { id: string },
  Promise<Language>
>

export type PermittedLanguageResolver = AppFieldResolver<
  ContestModel,
  any,
  Promise<Language[]>
>

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
  languageService: LanguageService
): LanguageResolvers => {
  return {
    Query: {
      languages: () => wrap(languageService.getAllLanguage()),
      languageById: (_source, { id }) =>
        wrap(languageService.getLanguageById(id)),
    },
    Contest: {
      permittedLanguages: source => {
        const promises = source.permittedLanguageIds.map(
          languageService.getLanguageById
        )
        return wrap(Promise.all(promises))
      },
    },
  }
}
