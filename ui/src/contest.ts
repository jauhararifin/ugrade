import { ApolloClient, gql } from 'apollo-boost'
import { action, observable, reaction, runInAction } from 'mobx'
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
  @observable languages: Language[] = []

  private authStore: AuthStore
  private client: ApolloClient<{}>

  constructor(auth: AuthStore, apolloClient: ApolloClient<{}>) {
    this.authStore = auth
    this.client = apolloClient

    reaction(() => this.authStore.me && this.authStore.me.contestId, this.loadUserContest)
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
      const contest = this.toContest(response.data.createContest.contest)
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
        this.current = this.toContest(response.data.contestByShortId)
      })
    } catch (error) {
      throw convertGraphqlError(error)
    }
  }

  @action update = async (
    name: string,
    shortDescription: string,
    description: string,
    startTime: Date,
    freezed: boolean,
    finishTime: Date,
    permittedLanguages: string[]
  ) => {
    try {
      const response = await this.client.mutate({
        mutation: gql`
          mutation UpdateContest(
            $name: String!
            $shortDescription: String!
            $description: String!
            $startTime: DateTime!
            $freezed: Boolean!
            $finishTime: DateTime!
            $permittedLanguages: [String]!
          ) {
            updateContest(
              contest: {
                name: $name
                shortDescription: $shortDescription
                description: $description
                startTime: $startTime
                freezed: $freezed
                finishTime: $finishTime
                permittedLanguages: $permittedLanguages
              }
            ) {
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
        variables: { name, shortDescription, description, startTime, freezed, finishTime, permittedLanguages },
        context: {
          headers: {
            authorization: `Bearer ${this.authStore.token}`,
          },
        },
      })
      runInAction(() => {
        this.current = this.toContest(response.data.updateContest)
      })
    } catch (error) {
      throw convertGraphqlError(error)
    }
  }

  @action loadLanguages = async (): Promise<Language[]> => {
    try {
      const response = await this.client.query({
        query: gql`
          {
            languages {
              id
              name
              extensions
            }
          }
        `,
      })
      runInAction(() => {
        this.languages = response.data.languages
      })
      return response.data.languages
    } catch (error) {
      throw convertGraphqlError(error)
    }
  }

  private toContest(value: any): ContestInfo {
    return {
      ...value,
      startTime: new Date(value.startTime),
      finishTime: new Date(value.finishTime),
    }
  }

  @action private loadUserContest = async () => {
    if (!this.authStore.me) return
    try {
      const response = await this.client.query({
        query: gql`
          query Contest($id: String!) {
            contest(id: $id) {
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
        variables: { id: this.authStore.me.contestId },
      })
      runInAction(() => {
        this.current = this.toContest(response.data.contest)
      })
    } catch (error) {
      throw convertGraphqlError(error)
    }
  }
}
