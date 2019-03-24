import { ApolloClient, ApolloError, gql } from 'apollo-boost'
import { Language } from 'ugrade/contest/store'
import { User } from 'ugrade/services/auth'
import { convertError as convertAuthError } from 'ugrade/services/auth/GraphqlAuthService'
import { simplePublisher } from 'ugrade/utils'
import { Contest } from '../Contest'
import { ContestService, SubscriptionCallback, UnsubscriptionFunction } from '../ContestService'
import { ContestIdTaken, NoSuchContest } from '../errors'

export class GraphqlContestService implements ContestService {
  QUERY_GET_CONTEST_BY_SHORT_ID = gql`
    query contestByShortId($shortId: String!) {
      contestByShortId(shortId: $shortId) {
        id
        shortId
        name
        shortDescription
        description
        startTime
        freezed
        finishTime
        permittedLanguages {
          id
          name
        }
      }
    }
  `

  QUERY_MY_CONTEST = gql`
    {
      user {
        contest {
          id
          shortId
          name
          shortDescription
          description
          startTime
          freezed
          finishTime
          permittedLanguages {
            id
            name
          }
        }
      }
    }
  `

  QUERY_GET_ALL_LANGUAGES = gql`
    {
      languages {
        id
        name
      }
    }
  `

  QUERY_GET_MY_CONTEST = gql`
    {
      user {
        contest {
          id
          shortId
          name
          shortDescription
          description
          startTime
          freezed
          finishTime
          permittedLanguages {
            id
            name
          }
        }
      }
    }
  `

  MUTATE_SET_MY_CONTEST = gql`
    mutation cetMyContest(
      $name: String!
      $shortDescription: String!
      $description: String!
      $startTime: String!
      $freezed: String!
      $finishTime: String!
      $permittedLanguageIds: [String!]!
    ) {
      setMyContest(
        name: $name
        shortDescription: $shortDescription
        description: $description
        startTime: $startTime
        freezed: $freezed
        finishTime: $finishTime
        permittedLanguageIds: $permittedLanguageIds
      ) {
        contest {
          id
          shortId
          name
          shortDescription
          description
          startTime
          freezed
          finishTime
          permittedLanguages {
            id
            name
          }
        }
      }
    }
  `

  MUTATE_CREATE_CONTEST = gql`
    mutation createContest(
      $name: String!
      $shortDescription: String!
      $description: String!
      $startTime: String!
      $freezed: String!
      $finishTime: String!
      $permittedLanguageIds: [String!]!
    ) {
      createContest(
        name: $name
        shortDescription: $shortDescription
        description: $description
        startTime: $startTime
        freezed: $freezed
        finishTime: $finishTime
        permittedLanguageIds: $permittedLanguageIds
      ) {
        id
        contest {
          id
          shortId
          name
          shortDescription
          description
          startTime
          freezed
          finishTime
          permittedLanguages {
            id
            name
          }
        }
        username
        email
        name
        permissions
        profile
      }
    }
  `

  private client: ApolloClient<{}>
  constructor(client: ApolloClient<{}>) {
    this.client = client
  }

  getAvailableLanguages(): Promise<Language[]> {
    return this.client
      .query({ query: this.QUERY_GET_ALL_LANGUAGES })
      .then(result => result.data)
      .catch(this.convertError)
  }

  getContestByShortId(shortId: string): Promise<Contest> {
    return this.client
      .query({
        query: this.QUERY_GET_CONTEST_BY_SHORT_ID,
        variables: { shortId },
      })
      .then(result => result.data.contestByShortId)
      .catch(this.convertError)
  }

  getMyContest(token: string): Promise<Contest> {
    return this.client
      .query({
        query: this.QUERY_MY_CONTEST,
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      })
      .then(result => result.data.user.contest)
      .catch(this.convertError)
  }

  updateContestInfo(
    token: string,
    name: string,
    shortDescription: string,
    description: string,
    startTime: Date,
    freezed: boolean,
    finishTime: Date,
    permittedLanguages: string[]
  ): Promise<Contest> {
    return this.client
      .mutate({
        mutation: this.MUTATE_SET_MY_CONTEST,
        variables: {
          name,
          shortDescription,
          description,
          startTime,
          freezed,
          finishTime,
          permittedLanguageIds: permittedLanguages,
        },
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      })
      .then(result => result.data.contest)
      .catch(this.convertError)
  }

  subscribeMyContest(token: string, callback: SubscriptionCallback<Contest>): UnsubscriptionFunction {
    return simplePublisher(this.getMyContest.bind(this, token), callback, undefined, undefined, 5000)
  }

  createContest(
    email: string,
    shortId: string,
    name: string,
    shortDescription: string,
    description: string,
    startTime: Date,
    finishTime: Date,
    permittedLanguages?: string[] | undefined
  ): Promise<[Contest, User]> {
    throw new Error('Method not implemented.')
  }

  private convertError(err: Error) {
    if (err instanceof ApolloError) {
      for (const gerr of err.graphQLErrors) {
        const code = gerr.extensions && gerr.extensions.code
        if (code === 'NoSuchContest') throw new NoSuchContest(gerr.message)
        if (code === 'ContestIdTaken') throw new ContestIdTaken(gerr.message)
      }
    }
    convertAuthError(err)
    throw err
  }
}
