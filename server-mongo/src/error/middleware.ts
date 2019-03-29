import { Context } from 'graphql-yoga/dist/types'
import { ApolloError } from 'apollo-server-core'
import { IMiddleware } from 'graphql-middleware'

export function errorMaskerMiddleware(): IMiddleware {
  return async (resolve, root, args, context: Context, info) => {
    try {
      return await resolve(root, args, context, info)
    } catch (err) {
      console.error(err)
      throw new ApolloError('Internal Server Error', 'InternalServerError')
    }
  }
}
