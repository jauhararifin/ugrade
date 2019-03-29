import { Field, ObjectType, Int, Float } from 'type-graphql'
import { Contest } from '@/contest/Contest'

@ObjectType()
export class Problem {
  @Field(type => Int, { nullable: false })
  id: number

  @Field(type => String, { nullable: false })
  shortId

  @Field(type => String, { nullable: false })
  name

  @Field(type => String, { nullable: false })
  statement

  @Field(type => Contest, { nullable: false })
  contest: Contest

  @Field(type => Boolean, { nullable: false })
  disabled: boolean

  @Field(type => Int, { nullable: false })
  order: number

  @Field(type => Int, { nullable: false })
  timeLimit: number

  @Field(type => Float, { nullable: false })
  tolerance: number

  @Field(type => Int, { nullable: false })
  memoryLimit: number

  @Field(type => Int, { nullable: false })
  outputLimit: number
}
