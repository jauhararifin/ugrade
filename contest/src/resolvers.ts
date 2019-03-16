import { IResolvers } from 'graphql-tools'
import { createContestResolvers } from './contest'
import { ContestStore } from './contest/store'
import { LanguageStore } from './language/store'
import { createLanguageResolvers } from './language/languageResolvers'

export function createResolvers(
  contestStore: ContestStore,
  languageStore: LanguageStore
): IResolvers {
  const contestResolvers = createContestResolvers(contestStore)
  const languageResolvers = createLanguageResolvers(languageStore)
  return {
    Query: {
      contest: contestResolvers.contest,
      contestById: contestResolvers.contestById,
      contestByShortId: contestResolvers.contestByShortId,

      languages: languageResolvers.languages,
      languageById: languageResolvers.languageById,
    },
  }
}
