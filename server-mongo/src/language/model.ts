import { prop, Typegoose, arrayProp } from 'typegoose'

export class LanguageSchema extends Typegoose {
  @prop({ required: true })
  name: string

  @arrayProp({ items: String, required: true })
  extensions: string[]
}

export const LanguageModel = new LanguageSchema().getModelForClass(LanguageSchema, {
  schemaOptions: {
    id: true,
  },
})
