import { Typegoose, prop, Ref, arrayProp, InstanceType } from 'typegoose'
import { LanguageSchema } from '../language/model'

export class ContestSchema extends Typegoose {
  @prop({ required: true })
  name: string

  @prop({ index: true, unique: true, required: true })
  shortId: string

  @prop({ required: true })
  shortDescription: string

  @prop({ required: true })
  description: string

  @prop({ required: true })
  startTime: Date

  @prop({ required: true })
  freezed: boolean

  @prop({ required: true })
  finishTime: Date

  @arrayProp({ itemsRef: LanguageSchema, required: true })
  permittedLanguages: Ref<LanguageSchema>[]
}

export const ContestModel = new ContestSchema().getModelForClass(ContestSchema, {
  schemaOptions: {
    id: true,
  },
})

export type Contest = InstanceType<ContestSchema>
