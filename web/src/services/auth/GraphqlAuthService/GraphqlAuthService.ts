import { ApolloClient, ApolloError, gql } from 'apollo-boost'
import { AuthService } from '../AuthService'
import {
  AuthError,
  ForbiddenActionError,
  InvalidTokenError,
  NoSuchUserError,
  UserAlreadyAddedError,
  UserRegistrationError,
} from '../errors'
import { User } from '../User'
import { UserPermission } from '../UserPermission'

export class GraphqlAuthService implements AuthService {
  private client: ApolloClient<{}>
  constructor(client: ApolloClient<{}>) {
    this.client = client
  }

  getUserById(userId: string): Promise<User> {
    const QUERY_GET_USER_BY_ID = gql`
      query UserById($id: String!) {
        userById(id: $id) {
          id
          contest {
            id
          }
          username
          email
          name
          permissions
        }
      }
    `
    return this.client
      .query({
        query: QUERY_GET_USER_BY_ID,
        variables: { id: userId },
      })
      .then(r => this.convertUser(r.data.UserById))
      .catch(this.convertError)
  }

  getUsers(token: string, contestId: string): Promise<User[]> {
    const QUERY_GET_CONTEST_USERS = gql`
      query ContestById($contestId: String!) {
        contestById(id: $contestId) {
          users {
            id
            contest {
              id
            }
            username
            email
            name
            permissions
          }
        }
      }
    `
    return this.client
      .query({
        query: QUERY_GET_CONTEST_USERS,
        variables: { contestId },
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      })
      .then(r => r.data.contestById.users.map((u: any) => this.convertUser(u)))
      .catch(this.convertError)
  }

  getUserByEmail(contestId: string, email: string): Promise<User> {
    const QUERY_GET_USER_BY_EMAIL = gql`
      query UserByEmail($contestId: String!, $email: String!) {
        contestById(id: $contestId) {
          userByEmail(email: $email) {
            id
            contest {
              id
            }
            username
            email
            name
            permissions
          }
        }
      }
    `
    return this.client
      .query({
        query: QUERY_GET_USER_BY_EMAIL,
        variables: { contestId, email },
      })
      .then(r => this.convertUser(r.data.contestById.userByEmail))
      .catch(this.convertError)
  }

  async getUserByUsernames(_contestId: string, _usernames: string[]): Promise<User[]> {
    // const QUERY_GET_USER_BY_USERNAMES = gql`
    //   query UserByUsernames($contestId: String!, $email: String!) {
    //     contestById(id: $contestId) {
    //       userByUsername(email: $email) {
    //         id
    //         contest {
    //           id
    //         }
    //         username
    //         email
    //         name
    //         permissions
    //       }
    //     }
    //   }
    // `
    // return this.client
    //   .query({
    //     query: QUERY_GET_USER_BY_EMAIL,
    //     variables: { contestId, email },
    //   })
    //   .then(r => this.convertUser(r.data.contestById.userByEmail))
    //   .catch(this.convertError)
    throw new Error('not implemented')
  }

  signin(contestId: string, email: string, password: string): Promise<string> {
    const MUTATION_SIGNIN = gql`
      mutation SignIn($contestId: String!, $email: String!, $password: String!) {
        signin(contestId: $contestId, email: $email, password: $password)
      }
    `
    return this.client
      .mutate({
        mutation: MUTATION_SIGNIN,
        variables: { contestId, email, password },
      })
      .then(r => r.data.signin)
      .catch(this.convertError)
  }

  async signup(
    contestId: string,
    username: string,
    email: string,
    oneTimeCode: string,
    password: string,
    name: string
  ): Promise<string> {
    const MUTATION_SIGNUP = gql`
      mutation SignUp(
        $contestId: String!
        $username: String!
        $email: String!
        $oneTimeCode: String!
        $password: String!
        $name: String!
      ) {
        signup(
          contestId: $contestId
          username: $username
          email: $email
          oneTimeCode: $oneTimeCode
          password: $password
          name: $name
        )
      }
    `
    return this.client
      .mutate({
        mutation: MUTATION_SIGNUP,
        variables: { contestId, username, email, oneTimeCode, password, name },
      })
      .then(r => r.data.signup)
      .catch(this.convertError)
  }

  async forgotPassword(contestId: string, email: string): Promise<void> {
    const MUTATION_FORGOT_PASSWORD = gql`
      mutation ForgotPassword($contestId: String!, $email: String!) {
        forgotPassword(contestId: $contestId, email: $email) {
          id
          contest {
            id
          }
          username
          email
          name
          permissions
        }
      }
    `
    return this.client
      .mutate({
        mutation: MUTATION_FORGOT_PASSWORD,
        variables: { contestId, email },
      })
      .then(r => this.convertUser(r.data.forgotPassword))
      .catch(this.convertError)
  }

  async resetPassword(contestId: string, email: string, oneTimeCode: string, password: string): Promise<void> {
    const MUTATION_RESET_PASSWORD = gql`
      mutation ResetPassword($contestId: String!, $email: String!, $oneTimeCode: String!, $password: String!) {
        resetPassword(contestId: $contestId, email: $email, oneTimeCode: $oneTimeCode, password: $password) {
          id
          contest {
            id
          }
          username
          email
          name
          permissions
        }
      }
    `
    return this.client
      .mutate({
        mutation: MUTATION_RESET_PASSWORD,
        variables: { contestId, email, oneTimeCode, password },
      })
      .then(r => this.convertUser(r.data.resetPassword))
      .catch(this.convertError)
  }

  async addUser(token: string, users: Array<{ email: string; permissions: UserPermission[] }>): Promise<string[]> {
    throw new Error('Method not implemented.')
  }

  getMe(token: string): Promise<User> {
    const QUERY_GET_ME = gql`
      {
        user {
          id
          contest {
            id
          }
          username
          email
          name
          permissions
        }
      }
    `
    return this.client
      .query({
        query: QUERY_GET_ME,
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      })
      .then(r => this.convertUser(r.data.user))
      .catch(this.convertError)
  }

  async setMyPassword(token: string, oldPassword: string, newPassword: string): Promise<void> {
    const MUTATION_SET_PASS = gql`
      mutation SetMyPassword($oldPassword: String!, $newPassword: String!) {
        setMyPassword(oldPassword: $oldPassword, newPassword: $newPassword)
      }
    `
    return this.client
      .query({
        query: MUTATION_SET_PASS,
        variables: { oldPassword, newPassword },
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      })
      .then(r => this.convertUser(r.data.setMyPassword))
      .catch(this.convertError)
  }

  async setMyName(token: string, name: string): Promise<void> {
    const MUTATION_SET_NAME = gql`
      mutation SetMyName($name: String!) {
        setMyName(name: $name)
      }
    `
    return this.client
      .query({
        query: MUTATION_SET_NAME,
        variables: { name },
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      })
      .then(r => this.convertUser(r.data.setMyName))
      .catch(this.convertError)
  }

  async setUserPermissions(token: string, userId: string, permissions: UserPermission[]): Promise<UserPermission[]> {
    const MUTATION_SET_PERMISSIONS = gql`
      mutation SetMyPermissions($userId: String!, $permissions: [Permission!]!) {
        setPermissions(userId: $userId, permissions: $permissions)
      }
    `
    return this.client
      .query({
        query: MUTATION_SET_PERMISSIONS,
        variables: { userId, permissions },
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      })
      .then(r => this.convertUser(r.data.setPermissions))
      .catch(this.convertError)
  }

  private convertUser(ret: any): User {
    return {
      id: ret.id,
      contestId: ret.contest.id,
      username: ret.username,
      email: ret.email,
      name: ret.name,
      permissions: ret.permissions,
    }
  }

  private convertError(err: Error): any {
    if (err instanceof ApolloError) {
      for (const gerr of err.graphQLErrors) {
        const code = gerr.extensions && gerr.extensions.code
        if (code === 'ForbiddenAction') throw new ForbiddenActionError(gerr.message)
        if (code === 'NoSuchUser') throw new NoSuchUserError(gerr.message)
        if (code === 'WrongPassword') throw new AuthError(gerr.message)
        if (code === 'InvalidToken') throw new InvalidTokenError(gerr.message)
        if (code === 'InvalidCredential') throw new AuthError(gerr.message)
        if (code === 'InvalidCode') throw new AuthError(gerr.message)
        if (code === 'AuthError') throw new AuthError(gerr.message)
        if (code === 'AlreadyUsedUsername') throw new UserRegistrationError(gerr.message)
        if (code === 'AlreadyRegistered') throw new UserRegistrationError(gerr.message)
        if (code === 'AlreadyInvitedUser') throw new UserAlreadyAddedError(gerr.message)
      }
    }
    throw err
  }
}
