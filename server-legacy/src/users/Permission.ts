import { Field, ObjectType, Int } from 'type-graphql'

@ObjectType()
export class Permission {
  @Field(type => Int!) id: number
  @Field(type => String!) code: string
  @Field(type => String!) description: string
}
