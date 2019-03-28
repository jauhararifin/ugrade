import { Arg, Query, Resolver, ResolverInterface, Root, FieldResolver, Int } from 'type-graphql'
import { ApolloError } from 'apollo-server-core'
import { ContestEntity } from '@/entity/ContestEntity'
import { Contest } from './Contest'
import { Language } from '@/language/Language'
import { User } from '@/user/User'

@Resolver(of => Contest)
export class ContestResolver implements ResolverInterface<Contest> {
  @Query(returns => Contest!)
  async contest(
    @Arg('id', type => Int, { nullable: false })
    id: number
  ) {
    const contest = await ContestEntity.findOne(id)
    if (contest) return { ...contest }
    throw new ApolloError('NoSuchContest', 'No Such Contest')
  }

  @Query(returns => [Contest!]!)
  async contests() {
    const contests = await ContestEntity.find()
    return contests.map(contest => ({
      ...contest,
    }))
  }

  @FieldResolver(returns => [Language])
  async permittedLanguages(@Root() contest: Contest) {
    const item = await ContestEntity.findOne({
      relations: ['permittedLanguages'],
      where: { id: contest.id },
    })
    return item.permittedLanguages
  }

  @FieldResolver(returns => [User])
  async members(@Root() contest: Contest) {
    const item = await ContestEntity.findOne({
      relations: ['members'],
      where: { id: contest.id },
    })
    return item.members
  }
}
