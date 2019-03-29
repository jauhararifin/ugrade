import { Typegoose, prop, Ref, InstanceType } from 'typegoose'
import { ContestSchema } from '../contest/model'

export class ProblemSchema extends Typegoose {
  @prop({ required: true })
  shortId: string

  @prop({ required: true })
  name: string

  @prop({ required: true })
  statement: string

  @prop({ required: true, ref: ContestSchema })
  contest: Ref<ContestSchema>

  @prop({ required: true })
  disabled: boolean

  @prop({ required: true })
  order: number

  @prop({ required: true })
  timeLimit: number

  @prop({ required: true })
  tolerance: number

  @prop({ required: true })
  memoryLimit: number

  @prop({ required: true })
  outputLimit: number
}

export const ProblemModel = new ProblemSchema().getModelForClass(ProblemSchema, {
  schemaOptions: {
    id: true,
  },
})

export type Problem = InstanceType<ProblemSchema>
