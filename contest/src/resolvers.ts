import { IResolvers } from 'graphql-tools'
import { createContestResolvers } from './contest'
import { ContestStore } from './contest/store'

export function createResolvers(contestStore: ContestStore): IResolvers {
  const contestResolvers = createContestResolvers(contestStore)
  return {
    ...contestResolvers,
  }
}
