import { Arg, Query, Resolver } from 'type-graphql'
import { ApolloError } from 'apollo-server-core'
import { Contest } from './Contest'
import { ContestEntity } from '@/entity/ContestEntity'

@Resolver(of => Contest)
export class ContestResolver {
  @Query(returns => Contest!)
  async contest(@Arg('id', { nullable: false }) id: number): Promise<Contest> {
    const contest = await ContestEntity.getRepository().findOne(id)
    if (contest) return contest
    throw new ApolloError('NoSuchContest', 'No Such Contest')
  }

  @Query(returns => [Contest!]!)
  async contests(): Promise<Contest[]> {
    return ContestEntity.getRepository().find()
  }
}
