import { IFieldResolver } from 'graphql-tools'
import { FORBIDDEN_ACTION, INVALID_TOKEN, NO_SUCH_USER } from 'ugrade/auth'
import { AuthStore, NoSuchUser, Permission, UserModel } from 'ugrade/auth/store'
import { AppContext } from 'ugrade/context'
import { GenderType, NoSuchProfile, ProfileStore, ShirtSizeType } from './store'

export interface ProfileResolvers {
  Query: {
    profile: IFieldResolver<any, AppContext, any>
    userProfile: IFieldResolver<any, AppContext, { userId: string }>
  }
  Mutation: {
    setMyProfile: IFieldResolver<
      any,
      AppContext,
      { gender?: GenderType; shirtSize?: ShirtSizeType; address?: string }
    >
  }
  User: {
    profile: IFieldResolver<UserModel, any, any>
  }
}

export const createProfileResolvers = (
  profileStore: ProfileStore,
  authStore: AuthStore
): ProfileResolvers => ({
  Query: {
    profile: async (_parent, _args, { authToken }) => {
      try {
        const user = await authStore.getUserByToken(authToken)
        return await profileStore.getProfile(user.id)
      } catch (error) {
        if (error instanceof NoSuchUser) throw INVALID_TOKEN
        if (error instanceof NoSuchProfile) return {}
        throw error
      }
    },

    userProfile: async (_parent, { userId }, { authToken }) => {
      try {
        const me = await authStore.getUserByToken(authToken)
        const allowed = me.permissions.includes(Permission.ProfilesRead)
        if (!allowed) throw FORBIDDEN_ACTION

        const [profile, user] = await Promise.all([
          profileStore.getProfile(userId),
          authStore.getUserById(userId),
        ])
        if (user.contestId !== me.contestId) throw NO_SUCH_USER

        return profile
      } catch (error) {
        if (error instanceof NoSuchUser) throw INVALID_TOKEN
        if (error instanceof NoSuchProfile) return {}
        throw error
      }
    },
  },
  Mutation: {
    setMyProfile: async (_parent, args, { authToken }) => {
      try {
        const me = await authStore.getUserByToken(authToken)
        return await profileStore.putProfile({
          userId: me.id,
          ...args,
        })
      } catch (error) {
        if (error instanceof NoSuchUser) throw INVALID_TOKEN
        throw error
      }
    },
  },
  User: {
    profile: async ({ id }, _args, { authToken }) => {
      try {
        const me = await authStore.getUserByToken(authToken)
        const allowed =
          me.id === id || me.permissions.includes(Permission.ProfilesRead)
        if (!allowed) throw FORBIDDEN_ACTION

        const [profile, user] = await Promise.all([
          profileStore.getProfile(id),
          authStore.getUserById(id),
        ])
        if (user.contestId !== me.contestId) throw NO_SUCH_USER
        return profile
      } catch (error) {
        if (error instanceof NoSuchUser) throw INVALID_TOKEN
        if (error instanceof NoSuchProfile) return {}
        throw error
      }
    },
  },
})
