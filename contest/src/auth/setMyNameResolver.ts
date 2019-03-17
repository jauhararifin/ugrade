import { ApolloError } from 'apollo-server-core'
import { AppFieldResolver } from 'ugrade/resolvers'
import { ValidationError } from 'yup'
import { AuthStore, UserModel } from './store'
import { userByTokenResolver } from './userByTokenResolver'
import { nameSchema } from './validationSchema'

export type SetMyNameResolver = AppFieldResolver<
  any,
  { name: string },
  Promise<UserModel>
>

export function setMyNameResolver(store: AuthStore): SetMyNameResolver {
  return async (source, args, context, info) => {
    const schema = nameSchema
    let name
    try {
      name = await schema.validate(args.name)
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new ApolloError('Invalid Input', 'INVALID_INPUT')
      }
      throw error
    }

    const userByToken = userByTokenResolver(store)
    const user = await userByToken(source, args, context, info)

    user.name = name
    return store.putUser(user)
  }
}
