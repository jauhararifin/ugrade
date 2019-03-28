import { Field, ObjectType, Int } from 'type-graphql'
import { Permission } from './Permission'
import { Contest } from '@/contest/Contest'
import { Submission } from '@/submission/Submission'

@ObjectType()
export class User {
  @Field(type => Int!)
  id: number

  @Field(type => String)
  name?: string

  @Field(type => String)
  username?: string

  @Field(type => String!)
  email: string

  @Field(type => [Permission!]!)
  permissions: Permission[] | Promise<Permission[]>

  @Field(type => Contest!)
  contest: Contest | Promise<Contest>

  @Field(type => [Submission!]!)
  submissions: Submission[] | Promise<Submission[]>
}
