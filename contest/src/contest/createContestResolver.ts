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
    shortDescription?: string
    description?: string
    startTime?: Date
    finishTime?: Date
    permittedLanguageIds?: string[]
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
      shortDescription: contestShortDescriptionSchema,
      description: contestDescriptionSchema,
      startTime: startTimeSchema,
      finishTime: finishTimeSchema,
      permittedLanguageIds: permittedLanguagesSchema,
    })
    try {
      args = await schemas.validate(args)
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw new ApolloError('Invalid Input', 'INVALID_INPUT', error.errors)
      }
    }

    // populate with default value
    if (!args.shortDescription) {
      args.shortDescription = 'Just another competitive programming competition'
    }
    if (!args.description) {
      args.description = `**Lorem Ipsum** is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
    }
    if (!args.startTime) {
      args.startTime = new Date(Date.now() + 10 * 60 * 60 * 24)
      args.finishTime = new Date(args.startTime.getTime() + 60 * 60 * 5)
    }
    const allLanguage = allLanguageResolver(languageStore)
    if (!args.permittedLanguageIds) {
      const langs = await allLanguage(source, args, context, info)
      args.permittedLanguageIds = langs.map(lang => lang.id)
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
        shortId: args.shortId as string,
        name: args.name as string,
        shortDescription: args.shortDescription as string,
        description: args.description as string,
        startTime: args.startTime as Date,
        freezed: false,
        finishTime: args.finishTime as Date,
        permittedLanguageIds: args.permittedLanguageIds as string[],
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
