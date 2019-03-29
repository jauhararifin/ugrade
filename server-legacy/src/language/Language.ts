import { Field, ObjectType, Int } from 'type-graphql'

@ObjectType()
export class Language {
  @Field(_ => Int, { nullable: false })
  id: number

  @Field(_ => String, { nullable: false })
  name: string

  @Field(_ => [String], { nullable: false })
  extensions: string[]
}
