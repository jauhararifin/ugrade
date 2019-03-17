import { ApolloError } from 'apollo-server-core'
import { genId as getUserId } from 'ugrade/auth'
import { adminPermissions, AuthStore, UserModel } from 'ugrade/auth/store'
import { emailSchema } from 'ugrade/auth/validationSchema'
import { allLanguageResolver } from 'ugrade/language'
import { LanguageStore } from 'ugrade/language/store'
import { AppFieldResolver } from 'ugrade/resolvers'
import * as yup from 'yup'
import { ContestIdTaken, ContestStore, NoSuchContest } from './store'
import { genId } from './util'
import {
  contestDescriptionSchema,
  contestNameSchema,
  contestShortDescriptionSchema,
  contestShortIdSchema,
  finishTimeSchema,
  permittedLanguagesSchema,
  startTimeSchema,
} from './validationSchema'

export type CreateContestResolver = AppFieldResolver<
  any,
  {
    email: string
    shortId: string
    name: string
    shortDescription: string
    description: string
    startTime: Date
    finishTime: Date
    permittedLanguageIds: string[]
  },
  Promise<UserModel>
>

export function createContestResolver(
  contestStore: ContestStore,
  authStore: AuthStore,
  languageStore: LanguageStore
): CreateContestResolver {
  return async (source, args, context, info) => {
    // validate input
    const schemas = yup.object().shape({
      email: emailSchema.required(),
      shortId: contestShortIdSchema.required(),
      name: contestNameSchema.required(),
      shortDescription: contestShortDescriptionSchema.required(),
      description: contestDescriptionSchema.required(),
      startTime: startTimeSchema.required(),
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

    // check taken shortId
    try {
      await contestStore.getContestByShortId(args.shortId)
      throw new ApolloError(
        'Contest ID Already Taken',
        'CONTEST_ID_ALREADY_TAKEN'
      )
    } catch (error) {
      if (!(error instanceof NoSuchContest)) throw error
    }

    // check languages ids
    const availableLangs = await languageStore.getAvailableLanguages()
    const availableLangIds = availableLangs.map(lang => lang.id)
    for (const langId of args.permittedLanguageIds || []) {
      if (!availableLangIds.includes(langId)) {
        throw new ApolloError('No Such Language', 'NO_SUCH_LANGUAGE')
      }
    }

    try {
      const contest = await contestStore.putContest({
        id: genId(),
        shortId: args.shortId,
        name: args.name,
        shortDescription: args.shortDescription,
        description: args.description,
        startTime: args.startTime,
        freezed: false,
        finishTime: args.finishTime,
        permittedLanguageIds: args.permittedLanguageIds,
      })
      const user = await authStore.putUser({
        id: getUserId(),
        contestId: contest.id,
        username: '',
        email: args.email,
        name: '',
        permissions: adminPermissions,
        password: '',
        token: '',
      })
      return user
    } catch (error) {
      if (error instanceof ContestIdTaken) {
        throw new ApolloError(
          'Contest ID Already Taken',
          'CONTEST_ID_ALREADY_TAKEN'
        )
      }
      throw error
    }
  }
}
