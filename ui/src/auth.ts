import { ApolloClient, gql } from 'apollo-boost'
import { action, observable, runInAction } from 'mobx'
import { convertGraphqlError } from './graphqlError'

export interface User {
  id: string
  name?: string
  username?: string
  email: string
  permissions: string[]
}

export class AuthStore {
  @observable token: string = ''
  @observable me?: User

  private client: ApolloClient<{}>

  constructor(client: ApolloClient<{}>) {
    this.client = client
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
      runInAction(() => {
        this.me = response.data.contest.userByEmail
      })
      return response.data.contest.userByEmail
    } catch (error) {
      throw convertGraphqlError(error)
    }
  }
}
