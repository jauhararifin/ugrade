import { ApolloClient, gql } from 'apollo-boost'
import { action, observable, runInAction, when } from 'mobx'
import { authStore } from './app'
import { AuthStore, Permission } from './auth'
import { ContestInfo, ContestStore } from './contest'
import { convertGraphqlError } from './graphqlError'

export interface Problem {
  id: string
  shortId: string
  name: string
  statement: string
  timeLimit: number
  tolerance: number
  memoryLimit: number
  outputLimit: number
  disabled: boolean
}

export class ProblemStore {
  @observable problems?: { [id: string]: Problem }

  private authStore: AuthStore
  private contestStore: ContestStore
  private client: ApolloClient<{}>

  constructor(auth: AuthStore, contest: ContestStore, apolloClient: ApolloClient<{}>) {
    this.authStore = auth
    this.contestStore = contest
    this.client = apolloClient

    when(() => {
      const hasToken = this.authStore.token
      const hasMe = this.authStore.me
      const canReadProbs = hasMe && hasMe.permissions.includes(Permission.ReadProblems)
      return !!hasToken && !!hasMe && !!canReadProbs
    }, this.loadProblems)
  }

  @action delete = async (problemId: string) => {
    try {
      const response = await this.client.mutate({
        mutation: gql`
          mutation DeleteProblem($problemId: String!) {
            deleteProblem(problemId: $problemId)
          }
        `,
        variables: { problemId },
        context: {
          headers: {
            authorization: `Bearer ${this.authStore.token}`,
          },
        },
      })
      const deleted = response.data.deleteProblem
      runInAction(() => {
        if (this.problems) delete this.problems[deleted]
      })
      return deleted
    } catch (error) {
      throw convertGraphqlError(error)
    }
  }

  @action update = async (problem: Problem) => {
    try {
      const response = await this.client.mutate({
        mutation: gql`
          mutation UpdateProblem(
            $problemId: String!
            $shortId: String!
            $name: String!
            $statement: String!
            $disabled: Boolean!
            $timeLimit: Int!
            $tolerance: Float!
            $memoryLimit: Int!
            $outputLimit: Int!
          ) {
            updateProblem(
              problemId: $problemId
              problem: {
                shortId: $shortId
                name: $name
                statement: $statement
                disabled: $disabled
                timeLimit: $timeLimit
                tolerance: $tolerance
                memoryLimit: $memoryLimit
                outputLimit: $outputLimit
              }
            ) {
              id
              shortId
              name
              statement
              disabled
              order
              timeLimit
              tolerance
              memoryLimit
              outputLimit
            }
          }
        `,
        variables: { problemId: problem.id, ...problem },
        context: {
          headers: {
            authorization: `Bearer ${this.authStore.token}`,
          },
        },
      })
      const updated = response.data.updateProblem
      runInAction(() => {
        if (this.problems) this.problems[updated.id] = updated
      })
      return updated
    } catch (error) {
      throw convertGraphqlError(error)
    }
  }

  @action create = async (problem: Problem) => {
    try {
      const response = await this.client.mutate({
        mutation: gql`
          mutation CreateProblem(
            $shortId: String!
            $name: String!
            $statement: String!
            $disabled: Boolean!
            $timeLimit: Int!
            $tolerance: Float!
            $memoryLimit: Int!
            $outputLimit: Int!
          ) {
            createProblem(
              problem: {
                shortId: $shortId
                name: $name
                statement: $statement
                disabled: $disabled
                timeLimit: $timeLimit
                tolerance: $tolerance
                memoryLimit: $memoryLimit
                outputLimit: $outputLimit
              }
            ) {
              id
              shortId
              name
              statement
              disabled
              order
              timeLimit
              tolerance
              memoryLimit
              outputLimit
            }
          }
        `,
        variables: problem,
        context: {
          headers: {
            authorization: `Bearer ${this.authStore.token}`,
          },
        },
      })
      const created = response.data.createProblem
      runInAction(() => {
        if (this.problems) this.problems[created.id] = created
      })
      return created
    } catch (error) {
      throw convertGraphqlError(error)
    }
  }

  @action private loadProblems = async () => {
    try {
      if (!this.authStore.me) return
      const contestId = this.authStore.me.contestId
      const response = await this.client.query({
        query: gql`
          query GetProblems($contestId: String!) {
            contest(id: $contestId) {
              problems {
                id
                shortId
                name
                statement
                disabled
                order
                timeLimit
                tolerance
                memoryLimit
                outputLimit
              }
            }
          }
        `,
        variables: { contestId },
        context: {
          headers: {
            authorization: `Bearer ${this.authStore.token}`,
          },
        },
      })
      const newProblems: { [id: string]: Problem } = {}
      for (const prob of response.data.contest.problems) {
        newProblems[prob.id] = prob
      }
      runInAction(() => (this.problems = newProblems))
      return newProblems
    } catch (error) {
      throw convertGraphqlError(error)
    }
  }
}
