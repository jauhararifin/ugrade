import { ApolloClient, ApolloError, gql } from 'apollo-boost'
import { action, observable, runInAction } from 'mobx'
import { ValidationError } from 'yup'
import { AuthStore } from './auth'

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

  @action create = async (email: string, shortId: string, name: string, shortDescription: string) => {
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
      runInAction(() => {
        this.current = response.data.contest
        this.authStore.me = response.data.admin
      })
    } catch (error) {
      if (error instanceof ApolloError) {
        for (const err of error.graphQLErrors) {
          if (err && err.code === 'InvalidInput') {
            let messages: string[] = []
            for (const key in err.validations) {
              if (err.validations.hasOwnProperty(key)) {
                messages = messages.concat(err.validations[key])
              }
            }
            throw new ValidationError(messages, err.validations, '')
          }
        }
      }
      throw error
    }
  }
}
