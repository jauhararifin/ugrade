import { ApolloClient, gql } from 'apollo-boost'
import { action, observable, runInAction } from 'mobx'
import { convertGraphqlError } from './graphqlError'

const AUTH_TOKEN_KEY = 'AUTH_TOKEN'

export interface User {
  id: string
  name?: string
  username?: string
  contestId: string
  email: string
  permissions: string[]
}

export class AuthStore {
  @observable token: string = ''
  @observable me?: User

  private client: ApolloClient<{}>

  constructor(client: ApolloClient<{}>) {
    this.client = client
    this.token = sessionStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(AUTH_TOKEN_KEY) || ''
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
              }
            }
          }
        `,
        variables: { contestId, email },
      })
      const newMe = { ...response.data.contest.userByEmail, contestId }
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
              }
              token
            }
          }
        `,
        variables: { contestId: me.contestId, email: me.email, password },
      })
      const user = { ...response.data.signIn.user, contestId: me.contestId }
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
            }
          }
        `,
        variables: { contestId: me.contestId, email: me.email },
      })
      const user = { ...response.data.signIn.user, contestId: me.contestId }
      runInAction(() => {
        this.me = user
      })
      return user
    } catch (error) {
      throw convertGraphqlError(error)
    }
  }
}
