import { LanguageSchema } from '../language/model'
import { ProblemSchema } from '../problem/models'
import { UserSchema } from '../auth/models'
import { Typegoose, prop, Ref, InstanceType } from 'typegoose'

export class SubmissionSchema extends Typegoose {
  @prop({ required: true, ref: ProblemSchema })
  problem: Ref<ProblemSchema>

  @prop({ required: true, ref: LanguageSchema })
  language: Ref<LanguageSchema>

  @prop({ required: true, ref: UserSchema })
  issuer: Ref<UserSchema>

  @prop({ required: true })
  issuedAt: Date
}

export const SubmissionModel = new SubmissionSchema().getModelForClass(SubmissionSchema, {
  schemaOptions: {
    id: true,
  },
})

export type Submission = InstanceType<SubmissionSchema>
