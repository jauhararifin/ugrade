import { ApolloClient, ApolloError, gql } from 'apollo-boost'
import { Language } from 'ugrade/contest/store'
import { Contest } from '../Contest'
import { ContestService } from '../ContestService'
import { ContestIdTaken, NoSuchContest } from '../errors'

export class GraphqlContestService implements ContestService {
  QUERY_GET_CONTEST_BY_SHORT_ID = gql`
    query ContestByShortId($shortId: String!) {
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
        query: this.QUERY_GET_CONTEST_BY_SHORT_ID,
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      })
      .then(result => result.data.contest)
      .catch(this.convertError)
  }

  updateContestInfo(
    token: string,
    name?: string | undefined,
    shortDescription?: string | undefined,
    description?: string | undefined,
    startTime?: Date | undefined,
    freezed?: boolean | undefined,
    finishTime?: Date | undefined,
    permittedLanguages?: string[] | undefined
  ): Promise<Contest> {
    throw new Error('Method not implemented.')
  }

  subscribeMyContest(
    token: string,
    callback: import('../ContestService').SubscriptionCallback<Contest>
  ): import('../ContestService').UnsubscriptionFunction {
    throw new Error('Method not implemented.')
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
  ): Promise<[Contest, import('../../auth').User]> {
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
    throw err
  }
}
