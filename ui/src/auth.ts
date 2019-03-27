import { ApolloClient, gql } from 'apollo-boost'
import { action, autorun, observable, reaction, runInAction, toJS } from 'mobx'
import { convertGraphqlError } from './graphqlError'

const AUTH_TOKEN_KEY = 'AUTH_TOKEN'

export enum Permission {
  CreateSubmissions = 'create:submissions',
  ReadSubmissions = 'read:submissions',
  ReadProfiles = 'read:profiles',
  DeleteUsers = 'delete:users',
  UpdateUsersPermissions = 'update:usersPermissions',
  InviteUsers = 'invite:users',
  DeleteProblems = 'delete:problems',
  UpdateProblems = 'update:problems',
  ReadDisabledProblems = 'read:disabledProblems',
  ReadProblems = 'read:problems',
  CreateProblems = 'create:problems',
  ReplyClarification = 'reply:clarification',
  CreateClarifications = 'create:clarifications',
  ReadClarifications = 'read:clarifications',
  ReadAnnouncement = 'read:announcement',
  CreateAnnouncement = 'create:announcement',
  UpdateInfo = 'update:info',
}

export const allPermissions = [
  Permission.CreateSubmissions,
  Permission.ReadSubmissions,
  Permission.ReadProfiles,
  Permission.DeleteUsers,
  Permission.UpdateUsersPermissions,
  Permission.InviteUsers,
  Permission.DeleteProblems,
  Permission.UpdateProblems,
  Permission.ReadDisabledProblems,
  Permission.ReadProblems,
  Permission.CreateProblems,
  Permission.ReplyClarification,
  Permission.CreateClarifications,
  Permission.ReadClarifications,
  Permission.ReadAnnouncement,
  Permission.CreateAnnouncement,
  Permission.UpdateInfo,
]

export const adminPermissions = allPermissions

export const contestantPermissions = [
  Permission.ReadAnnouncement,
  Permission.ReadProblems,
  Permission.CreateClarifications,
]

export interface User {
  id: string
  name?: string
  username?: string
  contestId: string
  email: string
  permissions: Permission[]
}

export class AuthStore {
  @observable token: string = ''
  @observable me?: User

  private client: ApolloClient<{}>

  constructor(client: ApolloClient<{}>) {
    this.client = client
    this.token = ''

    setInterval(this.synchronize, 5000)

    // fetch me when token updated
    reaction(() => this.token, this.loadMe)

    this.token = sessionStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(AUTH_TOKEN_KEY) || ''
  }

  can = (permission: Permission): boolean => {
    return this.me && this.me.permissions.includes(permission) ? true : false
  }

  @action setMeByEmail = async (contestId: string, email: string): Promise<User> => {
    try {
      const response = await this.client.query({
        query: gql`
          query GetMeByEmail($contestId: String!, $email: String!) {
            contest(id: $contestId) {
              userByEmail(email: $email) {
                id
                name
                username
                email
                permissions
                contest {
                  id
                }
              }
            }
          }
        `,
        variables: { contestId, email },
      })
      const newMe = { ...response.data.contest.userByEmail, contestId: response.data.contest.userByEmail.contest.id }
      runInAction(() => {
        this.me = newMe
      })
      return newMe
    } catch (error) {
      throw convertGraphqlError(error)
    }
  }

  @action signIn = async (password: string, rememberMe: boolean): Promise<User> => {
    try {
      const me = this.me
      if (!me) throw new Error('Please Set The Contest And Your Email First')
      const response = await this.client.mutate({
        mutation: gql`
          mutation SignIn($contestId: String!, $email: String!, $password: String!) {
            signIn(contestId: $contestId, email: $email, password: $password) {
              user {
                id
                name
                username
                email
                permissions
                contest {
                  id
                }
              }
              token
            }
          }
        `,
        variables: { contestId: me.contestId, email: me.email, password },
      })
      const user = { ...response.data.signIn.user, contestId: response.data.signIn.user.contest.id }
      const token = response.data.signIn.token
      sessionStorage.setItem(AUTH_TOKEN_KEY, token)
      if (rememberMe) {
        localStorage.setItem(AUTH_TOKEN_KEY, token)
      }

      runInAction(() => {
        this.me = user
        this.token = token
      })

      return user
    } catch (error) {
      throw convertGraphqlError(error)
    }
  }

  @action forgotPassword = async (): Promise<User> => {
    try {
      const me = this.me
      if (!me) throw new Error('Please Set The Contest And Your Email First')
      const response = await this.client.mutate({
        mutation: gql`
          mutation ForgotPassword($contestId: String!, $email: String!) {
            forgotPassword(contestId: $contestId, email: $email) {
              id
              name
              username
              email
              permissions
              contest {
                id
              }
            }
          }
        `,
        variables: { contestId: me.contestId, email: me.email },
      })
      const user = { ...response.data.forgotPassword, contestId: response.data.forgotPassword.contest.id }
      runInAction(() => {
        this.me = user
      })
      return user
    } catch (error) {
      throw convertGraphqlError(error)
    }
  }

  @action resetPassword = async (newPassword: string, resetPasswordOtc: string): Promise<User> => {
    try {
      const me = this.me
      if (!me) throw new Error('Please Set The Contest And Your Email First')
      const response = await this.client.mutate({
        mutation: gql`
          mutation ResetPassword(
            $contestId: String!
            $email: String!
            $newPassword: String!
            $resetPasswordOtc: String!
          ) {
            resetPassword(
              contestId: $contestId
              email: $email
              newPassword: $newPassword
              resetPasswordOtc: $resetPasswordOtc
            ) {
              id
              name
              username
              email
              permissions
              contest {
                id
              }
            }
          }
        `,
        variables: { contestId: me.contestId, email: me.email, newPassword, resetPasswordOtc },
      })
      const user = { ...response.data.resetPassword, contestId: response.data.resetPassword.contest.id }
      runInAction(() => {
        this.me = user
      })
      return user
    } catch (error) {
      throw convertGraphqlError(error)
    }
  }

  @action signUp = async (
    username: string,
    signupCode: string,
    password: string,
    name: string,
    rememberMe: boolean
  ): Promise<User> => {
    try {
      const me = this.me
      if (!me) throw new Error('Please Set The Contest And Your Email First')
      const response = await this.client.mutate({
        mutation: gql`
          mutation SignUp(
            $contestId: String!
            $email: String!
            $signupCode: String!
            $username: String!
            $name: String!
            $password: String!
          ) {
            signUp(
              contestId: $contestId
              email: $email
              signupCode: $signupCode
              user: { name: $name, password: $password, username: $username }
            ) {
              user {
                id
                name
                username
                email
                permissions
                contest {
                  id
                }
              }
              token
            }
          }
        `,
        variables: { contestId: me.contestId, email: me.email, username, signupCode, password, name, rememberMe },
      })
      const user = { ...response.data.signUp.user, contestId: response.data.signUp.user.contest.id }
      const token = response.data.signUp.token
      sessionStorage.setItem(AUTH_TOKEN_KEY, token)
      if (rememberMe) {
        localStorage.setItem(AUTH_TOKEN_KEY, token)
      }

      runInAction(() => {
        this.me = user
        this.token = token
      })

      return user
    } catch (error) {
      throw convertGraphqlError(error)
    }
  }

  @action signOut = () => {
    sessionStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_TOKEN_KEY)
    this.token = ''
    this.me = undefined
  }

  @action updateUserPermission = (userId: string, permission: Permission[]) => {
    return permission
  }

  @action loadMe = async () => {
    if (this.me || this.token.length === 0) return
    try {
      const response = await this.client.query({
        query: gql`
          {
            me {
              id
              name
              username
              email
              permissions
              contest {
                id
              }
            }
          }
        `,
        context: {
          headers: {
            authorization: `Bearer ${this.token}`,
          },
        },
        fetchPolicy: 'no-cache',
      })
      const user = { ...response.data.me, contestId: response.data.me.contest.id }
      runInAction(() => {
        this.me = user
      })
      return user
    } catch (error) {
      throw convertGraphqlError(error)
    }
  }

  private synchronize = () => {
    if (this.token.length > 0 && !this.me) {
      this.loadMe()
    }
  }
}
