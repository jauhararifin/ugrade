import { ApolloClient, ApolloError, gql } from 'apollo-boost'
import { action, observable, runInAction } from 'mobx'
import { ValidationError } from 'yup'
import { AuthStore } from './auth'
import { convertGraphqlError } from './graphqlError'

export interface Language {
  id: string
  name: string
  extensions: string[]
}

export interface ContestInfo {
  id: string
  shortId: string
  name: string
  shortDescription: string
  startTime: Date
  finishTime: Date
  freezed: boolean
  description: string
  permittedLanguages: Language[]
}

export class ContestStore {
  @observable current?: ContestInfo

  private authStore: AuthStore
  private client: ApolloClient<{}>

  constructor(auth: AuthStore, apolloClient: ApolloClient<{}>) {
    this.authStore = auth
    this.client = apolloClient
  }

  @action create = async (
    email: string,
    shortId: string,
    name: string,
    shortDescription: string
  ): Promise<ContestInfo> => {
    try {
      const response = await this.client.mutate({
        mutation: gql`
          mutation CreateContest($email: String!, $shortId: String!, $name: String!, $shortDescription: String!) {
            createContest(
              contest: { name: $name, shortId: $shortId, shortDescription: $shortDescription }
              email: $email
            ) {
              admin {
                id
                name
                username
                email
                permissions
              }
              contest {
                id
                name
                shortId
                shortDescription
                description
                startTime
                freezed
                finishTime
                permittedLanguages {
                  id
                  name
                  extensions
                }
              }
            }
          }
        `,
        variables: { email, shortId, name, shortDescription },
      })
      const contest = response.data.createContest.contest
      const me = { ...response.data.createContest.admin, contestId: contest.id }
      runInAction(() => {
        this.current = contest
        this.authStore.me = me
      })
      return contest
    } catch (error) {
      throw convertGraphqlError(error)
    }
  }

  @action setByShortId = async (shortId: string) => {
    try {
      const response = await this.client.query({
        query: gql`
          query ContestByShortId($shortId: String!) {
            contestByShortId(shortId: $shortId) {
              id
              name
              shortId
              shortDescription
              description
              startTime
              freezed
              finishTime
              permittedLanguages {
                id
                name
                extensions
              }
            }
          }
        `,
        variables: { shortId },
      })
      runInAction(() => {
        this.current = response.data.contestByShortId
      })
    } catch (error) {
      throw convertGraphqlError(error)
    }
  }
}
