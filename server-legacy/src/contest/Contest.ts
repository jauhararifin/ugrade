import { Field, ObjectType, Int } from 'type-graphql'
import { Language } from '@/language/Language'
import { User } from '@/user/User'

@ObjectType()
export class Contest {
  @Field(type => Int, { nullable: false })
  id: number

  @Field(type => String, { nullable: false })
  name: string

  @Field(type => String, { nullable: false })
  shortId: string

  @Field(type => String, { nullable: false })
  shortDescription: string

  @Field(type => String, { nullable: false })
  description: string

  @Field(type => Date, { nullable: false })
  startTime: Date

  @Field(type => Boolean, { nullable: false })
  freezed: boolean

  @Field(type => Date, { nullable: false })
  finishTime: Date

  @Field(type => [Language], { nullable: false })
  permittedLanguages: Language[]

  @Field(type => [User], { nullable: false })
  members: User[]
}
