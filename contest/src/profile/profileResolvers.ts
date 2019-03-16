import { IFieldResolver } from 'graphql-tools'
import { FORBIDDEN_ACTION, INVALID_TOKEN } from 'ugrade/auth'
import { AuthStore, NoSuchCredential } from 'ugrade/auth/store'
import { AppContext } from 'ugrade/context'
import { NO_SUCH_USER } from 'ugrade/user'
import { Permission, UserModel, UserStore } from 'ugrade/user/store'
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
  authStore: AuthStore,
  userStore: UserStore
): ProfileResolvers => ({
  Query: {
    profile: async (_parent, _args, { authToken }) => {
      try {
        const user = await authStore.getCredentialByToken(authToken)
        return await profileStore.getProfile(user.userId)
      } catch (error) {
        if (error instanceof NoSuchCredential) throw INVALID_TOKEN
        if (error instanceof NoSuchProfile) return {}
        throw error
      }
    },

    userProfile: async (_parent, { userId }, { authToken }) => {
      try {
        const me = await authStore.getCredentialByToken(authToken)
        const userMe = await userStore.getUserById(me.userId)
        const allowed = userMe.permissions.includes(Permission.ProfilesRead)
        if (!allowed) throw FORBIDDEN_ACTION

        const [profile, user] = await Promise.all([
          profileStore.getProfile(userId),
          userStore.getUserById(userId),
        ])
        if (user.contestId !== userMe.contestId) throw NO_SUCH_USER

        return profile
      } catch (error) {
        if (error instanceof NoSuchCredential) throw INVALID_TOKEN
        if (error instanceof NoSuchProfile) return {}
        throw error
      }
    },
  },
  Mutation: {
    setMyProfile: async (_parent, args, { authToken }) => {
      try {
        const me = await authStore.getCredentialByToken(authToken)
        return await profileStore.putProfile({
          userId: me.userId,
          ...args,
        })
      } catch (error) {
        if (error instanceof NoSuchCredential) throw INVALID_TOKEN
        throw error
      }
    },
  },
  User: {
    profile: async ({ id }, _args, { authToken }) => {
      try {
        const me = await authStore.getCredentialByToken(authToken)
        const userMe = await userStore.getUserById(me.userId)
        const allowed =
          me.userId === id ||
          userMe.permissions.includes(Permission.ProfilesRead)
        if (!allowed) throw FORBIDDEN_ACTION

        const [profile, user] = await Promise.all([
          profileStore.getProfile(id),
          userStore.getUserById(id),
        ])
        if (user.contestId !== userMe.contestId) throw NO_SUCH_USER
        return profile
      } catch (error) {
        if (error instanceof NoSuchCredential) throw INVALID_TOKEN
        if (error instanceof NoSuchProfile) return {}
        throw error
      }
    },
  },
})
