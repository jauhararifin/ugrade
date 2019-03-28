import { Arg, Query, Resolver, FieldResolver, Root, ResolverInterface } from 'type-graphql'
import { ApolloError } from 'apollo-server-core'
import { Contest } from './Contest'
import { ContestEntity } from '@/entity/ContestEntity'
import { User } from '../users/User'
import { UserEntity } from '@/entity/UserEntity'

@Resolver(of => ContestEntity)
export class ContestResolver implements ResolverInterface<ContestEntity> {
  @Query(returns => ContestEntity!)
  async contest(@Arg('id', { nullable: false }) id: number): Promise<ContestEntity> {
    const contest = await ContestEntity.getRepository().findOne(id)
    if (contest) return contest
    throw new ApolloError('NoSuchContest', 'No Such Contest')
  }

  @Query(returns => [ContestEntity!]!)
  async contests(): Promise<ContestEntity[]> {
    return ContestEntity.getRepository().find()
  }

  @FieldResolver()
  members(@Root() contest: ContestEntity): Promise<UserEntity[]> {
    return UserEntity.find({ contestId: contest.id })
  }
}
