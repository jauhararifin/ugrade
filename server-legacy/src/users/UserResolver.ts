import { Arg, Query, Resolver } from 'type-graphql'
import { ApolloError } from 'apollo-server-core'
import { User } from '../users/User'
import { UserEntity } from '@/entity/UserEntity'

@Resolver(of => User)
export class UserResolver {
  @Query(returns => User!)
  async user(@Arg('id', { nullable: false }) id: number): Promise<User> {
    const user = await UserEntity.getRepository().findOne(id)
    if (user) return user
    throw new ApolloError('NoSuchUser', 'No Such User')
  }

  @Query(returns => [User!]!)
  async users(): Promise<User[]> {
    return UserEntity.getRepository().find()
  }
}
