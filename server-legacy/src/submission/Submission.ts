import { Field, ObjectType, Int } from 'type-graphql'
import { Problem } from '../problem/Problem'
import { Language } from '@/language/Language'
import { User } from '../user/User'
import { Grading } from './Grading'

@ObjectType()
export class Submission {
  @Field(type => Int, { nullable: false })
  id: number

  @Field(type => Problem, { nullable: false })
  problem: Problem

  @Field(type => Language, { nullable: false })
  language: Language

  @Field(type => User, { nullable: false })
  issuer: User

  @Field({ nullable: false })
  issuedAt: Date

  @Field(type => Grading, { nullable: false })
  gradings: Grading[]
}
