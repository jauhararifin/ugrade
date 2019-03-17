import { ApolloError } from 'apollo-server-core'
import { userByTokenResolver } from 'ugrade/auth'
import { AuthStore } from 'ugrade/auth/store'
import { LanguageStore } from 'ugrade/language/store'
import { AppFieldResolver } from 'ugrade/resolvers'
import * as yup from 'yup'
import { contestByUserResolver } from './contestByUser'
import { ContestModel, ContestStore } from './store'
import {
  contestDescriptionSchema,
  contestNameSchema,
  contestShortDescriptionSchema,
  finishTimeSchema,
  freezedSchema,
  permittedLanguagesSchema,
  startTimeSchema,
} from './validationSchema'

export type SetMyContestResolver = AppFieldResolver<
  any,
  {
    name: string
    shortDescription: string
    description: string
    startTime: Date
    freezed: boolean
    finishTime: Date
    permittedLanguageIds: string[]
  },
  Promise<ContestModel>
>

export function setMyContestResolver(
  contestStore: ContestStore,
  authStore: AuthStore,
  languageStore: LanguageStore
): SetMyContestResolver {
  return async (source, args, context, info) => {
    // validate input
    const schemas = yup.object().shape({
      name: contestNameSchema.required(),
      shortDescription: contestShortDescriptionSchema.required(),
      description: contestDescriptionSchema.required(),
      startTime: startTimeSchema.required(),
      freezed: freezedSchema.required(),
      finishTime: finishTimeSchema.required(),
      permittedLanguageIds: permittedLanguagesSchema.required(),
    })
    try {
      args = await schemas.validate(args)
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw new ApolloError('Invalid Input', 'INVALID_INPUT', error.errors)
      }
    }

    // get currrent contest
    const userByToken = userByTokenResolver(authStore)
    const me = await userByToken(source, args, context, info)
    const contestByUser = contestByUserResolver(contestStore)
    const contest = await contestByUser(me, {}, context, info)

    // check languages ids
    const availableLangs = await languageStore.getAvailableLanguages()
    const availableLangIds = availableLangs.map(lang => lang.id)
    for (const langId of args.permittedLanguageIds || []) {
      if (!availableLangIds.includes(langId)) {
        throw new ApolloError('No Such Language', 'NO_SUCH_LANGUAGE')
      }
    }

    // update the contest
    contest.name = args.name
    contest.shortDescription = args.shortDescription
    contest.description = args.description
    contest.startTime = args.startTime
    contest.freezed = args.freezed
    contest.finishTime = args.finishTime
    contest.permittedLanguageIds = args.permittedLanguageIds

    return contestStore.putContest(contest)
  }
}
