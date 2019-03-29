import { Arg, Query, Resolver, Int } from 'type-graphql'
import { ApolloError } from 'apollo-server-core'
import { User } from './User'
import { UserEntity } from '@/entity/UserEntity'

@Resolver(of => User)
export class UserResolver {
  @Query(returns => User!)
  async user(@Arg('id', type => Int, { nullable: false }) id: number) {
    const user = await UserEntity.getRepository().findOne(id)
    if (user) return user
    throw new ApolloError('NoSuchUser', 'No Such User')
  }

  @Query(returns => [User], { nullable: false })
  async users() {
    return UserEntity.getRepository().find()
  }
}
