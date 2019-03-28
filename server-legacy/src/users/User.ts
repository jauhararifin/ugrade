import { Field, ObjectType, Int } from 'type-graphql'
import { Permission } from './Permission'
import { Contest } from '@/contest/Contest'
import { Submission } from '@/submission/Submission'

@ObjectType()
export class User {
  @Field(type => Int, { nullable: false })
  id: number

  @Field(type => String, { nullable: true })
  name?: string

  @Field(type => String, { nullable: true })
  username?: string

  @Field(type => String, { nullable: false })
  email: string

  @Field(type => [Permission], { nullable: false })
  permissions: Permission[]

  @Field(type => Contest, { nullable: false })
  contest: Contest

  @Field(type => [Submission], { nullable: false })
  submissions: Submission[]
}
