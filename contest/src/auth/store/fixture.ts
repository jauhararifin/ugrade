import { hashSync } from 'bcrypt'
import {
  UserAdmin3,
  UserNewTest1,
  UserNewTest2,
  UserNewTest3,
  UserNewTest4,
  UserTest1,
  UserTest2,
  UserTest3,
  UserTest4,
} from 'ugrade/user/store'
import { CredentialModel } from './model'

export const credentials: CredentialModel[] = [
  { userId: UserTest1.id, password: hashSync('test', 10), token: '' },
  { userId: UserNewTest1.id, password: hashSync('newtest', 10), token: '' },
  { userId: UserTest2.id, password: hashSync('test', 10), token: '' },
  { userId: UserNewTest2.id, password: hashSync('newtest', 10), token: '' },
  { userId: UserTest3.id, password: hashSync('test', 10), token: '' },
  { userId: UserNewTest3.id, password: hashSync('newtest', 10), token: '' },
  { userId: UserAdmin3.id, password: hashSync('admin', 10), token: '' },
  { userId: UserTest4.id, password: hashSync('test', 10), token: '' },
  { userId: UserNewTest4.id, password: hashSync('newtest', 10), token: '' },
]
