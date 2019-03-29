import { ContextCallback, ContextParameters } from 'graphql-yoga/dist/types'
import { verify } from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server-core'
import { UserModel } from './models'

export function authMiddleware(secret: string): ContextCallback {
  return async (context: ContextParameters) => {
    const authHeader = context.request.header('authorization')
    if (authHeader && authHeader.length > 0) {
      const parts = authHeader.split(/\s+/)
      if (parts.length === 2) {
        const type = parts[0].toLowerCase()
        const token = parts[1]
        if (type === 'bearer') {
          try {
            const value = verify(token, secret) as { userId: string }
            try {
              const user = await UserModel.findOne({ _id: value.userId }).exec()
              return { ...context, user }
            } catch (err) {
              throw new AuthenticationError('Invalid Token')
            }
          } catch (err) {
            throw new AuthenticationError('Invalid Token')
          }
        }
      }
    }
    return {
      ...context,
    }
  }
}
