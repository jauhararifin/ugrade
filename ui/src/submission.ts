import { ApolloClient, gql } from 'apollo-boost'
import { action, observable, runInAction } from 'mobx'
import { AuthStore } from './auth'
import { ContestStore } from './contest'
import { convertGraphqlError } from './graphqlError'

export enum GradingVerdict {
  IE = 'IE',
  CE = 'CE',
  RTE = 'RTE',
  MLE = 'MLE',
  TLE = 'TLE',
  WA = 'WA',
  AC = 'AC',
  PENDING = 'PENDING',
}

export interface Submission {
  id: string
  problemId: string
  languageId: string
  issuedTime: Date
  issuerId: string
}

export class SubmissionStore {
  @observable submissions?: Submission[] = undefined

  private contestStore: ContestStore
  private authStore: AuthStore
  private apolloClient: ApolloClient<{}>

  constructor(apolloClient: ApolloClient<{}>, authStore: AuthStore, contestStore: ContestStore) {
    this.apolloClient = apolloClient
    this.authStore = authStore
    this.contestStore = contestStore
  }

  @action submit = async (problemId: string, languageId: string, sourceCode: File) => {
    try {
      const response = await this.apolloClient.mutate({
        mutation: gql`
          mutation SubmitSolution($problemId: String!, $languageId: String!, $sourceCode: Upload!) {
            submitSolution(problemId: $problemId, languageId: $languageId, sourceCode: $sourceCode) {
              id
              problem {
                id
              }
              language {
                id
              }
              issuedTime
              issuer {
                id
              }
            }
          }
        `,
        variables: { problemId, languageId, sourceCode },
        context: {
          headers: {
            authorization: `Bearer ${this.authStore.token}`,
          },
        },
      })
      const sub = response.data.submitSolution
      const submission: Submission = {
        id: sub.id,
        problemId: sub.problem.id,
        languageId: sub.language.id,
        issuedTime: sub.issuedTime,
        issuerId: sub.issuer.id,
      }
      runInAction(() => {
        if (this.submissions) this.submissions.push(submission)
        else this.submissions = [submission]
      })
    } catch (error) {
      throw convertGraphqlError(error)
    }
  }

  @action load = async () => {
    try {
      const response = await this.apolloClient.query({
        query: gql`
          {
            me {
              contest {
                submissions {
                  id
                  language {
                    id
                  }
                  problem {
                    id
                  }
                  issuedTime
                  issuer {
                    id
                  }
                }
              }
            }
          }
        `,
        context: {
          headers: {
            authorization: `Bearer ${this.authStore.token}`,
          },
        },
      })
      const submissions: Submission[] = response.data.me.contest.submissions.map((sub: any) => ({
        id: sub.id,
        problemId: sub.problem.id,
        languageId: sub.language.id,
        issuedTime: sub.issuedTime,
        issuerId: sub.issuer.id,
      }))
      runInAction(() => {
        this.submissions = submissions
      })
    } catch (error) {
      throw convertGraphqlError(error)
    }
  }
}
