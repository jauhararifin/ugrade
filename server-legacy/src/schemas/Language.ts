import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class Language {
  @Field(_ => String!)
  id: string

  @Field(_ => String!)
  name: string

  @Field(_ => [String!]!)
  extensions: string[]
}
