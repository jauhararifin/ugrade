import { Field, ObjectType, Int } from 'type-graphql'

@ObjectType()
export class Submission {
  @Field(type => Int!) id: number
}
