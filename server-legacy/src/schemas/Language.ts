import { Field, ObjectType, Int } from 'type-graphql'

@ObjectType()
export class Language {
  @Field(_ => Int!)
  id: number

  @Field(_ => String!)
  name: string

  @Field(_ => [String!]!)
  extensions: string[]
}
