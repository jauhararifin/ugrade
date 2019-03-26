import { ApolloClient } from 'apollo-boost'
import { observable } from 'mobx'
import { AuthStore } from './auth'
import { ContestStore } from './contest'

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

  contest: ContestStore
}

export class ProblemStore {
  @observable problems: { [id: string]: Problem } = {}

  private authStore: AuthStore
  private contestStore: ContestStore
  private client: ApolloClient<{}>

  constructor(auth: AuthStore, contest: ContestStore, apolloClient: ApolloClient<{}>) {
    this.authStore = auth
    this.contestStore = contest
    this.client = apolloClient
  }
}
