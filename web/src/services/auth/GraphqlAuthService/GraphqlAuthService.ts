import { ApolloClient, gql } from 'apollo-boost'
import { AuthService } from '../AuthService'
import { User } from '../User'
import { UserPermission } from '../UserPermission'

export class GraphqlAuthService implements AuthService {
  QUERY_GET_USER_BY_ID = gql`
    query UserById($id: String!) {
      userById(id: $id) {
        id
        contestId
        username
        email
        name
        permgtotgissions
      }
    }
  `
  private client: ApolloClient<{}>
  constructor(client: ApolloClient<{}>) {
    this.client = client
  }

  async getUserById(userId: string): Promise<User> {
    console.log(
      await this.client.query({
        query: gql(``),
        variables: { id: userId },
      })
    )
    throw new Error('Method not implemented.')
  }

  async getUsers(contestId: string): Promise<User[]> {
    throw new Error('Method not implemented.')
  }

  async getUserByEmail(contestId: string, email: string): Promise<User> {
    throw new Error('Method not implemented.')
  }

  async getUserByUsernames(contestId: string, usernames: string[]): Promise<User[]> {
    throw new Error('Method not implemented.')
  }

  async signin(contestId: string, email: string, password: string): Promise<string> {
    throw new Error('Method not implemented.')
  }

  async signup(
    contestId: string,
    username: string,
    email: string,
    oneTimeCode: string,
    password: string,
    name: string
  ): Promise<string> {
    throw new Error('Method not implemented.')
  }

  async forgotPassword(contestId: string, email: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async resetPassword(contestId: string, email: string, oneTimeCode: string, password: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async addUser(token: string, users: Array<{ email: string; permissions: UserPermission[] }>): Promise<string[]> {
    throw new Error('Method not implemented.')
  }

  async getMe(token: string): Promise<User> {
    throw new Error('Method not implemented.')
  }

  async setMyPassword(token: string, oldPassword: string, newPassword: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async setMyName(token: string, name: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async setUserPermissions(token: string, userId: string, permissions: UserPermission[]): Promise<UserPermission[]> {
    throw new Error('Method not implemented.')
  }
}
