import { ObjectType, Field, registerEnumType, Int } from 'type-graphql'
import { Submission } from './Submission'
import { Verdict } from '@/entity/GradingEntity'

registerEnumType(Verdict, {
  name: 'Verdict',
})

@ObjectType()
export class Grading {
  @Field(type => Int, { nullable: false })
  id: number

  @Field(type => Submission, { nullable: false })
  submission: Submission

  @Field({ nullable: false })
  issuedAt: Date

  @Field(type => Verdict, { nullable: false })
  verdict: Verdict
}
