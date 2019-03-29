import { Typegoose, prop, Ref, arrayProp, InstanceType } from 'typegoose'
import { Permission, allPermissions } from './Permission'
import { ContestSchema } from '../contest/model'
import { SubmissionSchema } from '../submission/models'

export class UserSchema extends Typegoose {
  @prop({ required: false })
  name?: string

  @prop({ required: false })
  username?: string

  @prop({ required: true })
  email: string

  @prop({ required: true, enum: allPermissions })
  permissions: Permission[]

  @prop({ ref: ContestSchema, required: true })
  contest: Ref<ContestSchema>

  @prop({ required: false })
  password?: string

  @prop({ required: false })
  signupOtc?: string

  @prop({ required: false })
  resetPasswordOtc?: string

  @arrayProp({ itemsRef: SubmissionSchema, required: true })
  submissions: Ref<SubmissionSchema>[]
}

export const UserModel = new UserSchema().getModelForClass(UserSchema, {
  schemaOptions: {
    id: true,
  },
})

export type User = InstanceType<UserSchema>
