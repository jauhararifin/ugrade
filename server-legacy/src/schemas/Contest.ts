import { Field, ObjectType, Int } from 'type-graphql'
import { Language } from './Language'

@ObjectType()
export class Contest {
  @Field(_ => Int!)
  id: number

  @Field(_ => String!)
  name: string

  @Field(_ => String!)
  shortId: string

  @Field(_ => String!)
  shortDescription: string

  @Field(_ => String!)
  description: string

  @Field(_ => Date!)
  startTime: Date

  @Field(_ => Boolean!)
  freezed: boolean

  @Field(_ => Date!)
  finishTime: Date

  @Field(_ => [Language!]!)
  permittedLanguages: Language[]
}
